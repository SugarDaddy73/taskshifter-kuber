import React, { useState, useEffect, useCallback } from 'react';
import { ProjectService } from "@/entities/project/api/ProjectService";
import { useProjectStore } from "@/entities/project/lib/hooks/useProjectStore";
import { useUserStore } from "@/entities/user/lib/hooks/useUserStore";
import { UserCard } from "@/entities/user/ui/UserCard";
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";
import { Separator } from "@/shared/ui/separator";
import { Search, UserPlus } from 'lucide-react';
import { toast } from "sonner";
import type { ProjectModel } from "@/entities/project/model/ProjectModel";
import { useFetchProjects } from '@/pages/dashboard/lib/hooks/useFetchProjects';
import type { AxiosError } from 'axios';
import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';

interface ManageAccessDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project: ProjectModel;
}

export function ManageAccessDialog({ isOpen, onOpenChange, project }: ManageAccessDialogProps) {
  const { setSelectedProject, setSelectedProjectId } = useProjectStore();
  const { profile: currentUser } = useUserStore();
  const { refetch: refetchProjects } = useFetchProjects();
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [projectData, setProjectData] = useState<ProjectModel>(project);

  const refreshProjectData = useCallback(async () => {
    try {
      const response = await ProjectService.getProjectById(project.id);
      setProjectData(response.data);
      setSelectedProject(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400 || axiosError.response?.status === 404) {
        onOpenChange(false);
        return;
      }
      toast.error("Error!", { description: "Failed to refresh project data." });
      console.error("Refresh project error:", error);
    }
  }, [project.id, setSelectedProject, onOpenChange]);

  // Отримуємо поточну роль користувача в проекті (безпечно)
  const currentUserMember = projectData?.members?.find(m => m.id === currentUser?.id);
  const currentUserRole = currentUserMember?.role ?? 2;

  // Фільтруємо учасників за пошуковим запитом (безпечно)
  const filteredMembers = projectData?.members?.filter(member =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsAdding(true);
    try {
      await ProjectService.addMemberToProject(project.id, email.trim());
      toast.success("Success!", { description: "User has been added to the project." });
      setEmail('');
      await refreshProjectData();
    } catch (error: any) {
      if (error.response?.data.code === "NOT_ENOUGH_PERMISSIONS") {
        toast.error("Error!", { 
          description: "You don't have permission to add users to this project." 
        });
      } else if (error.response?.data.code === "USER_ALREADY_MEMBER") {
        toast.error("Error!", { 
          description: "This user is already a member of the project." 
        });
      } else if (error.response?.data.code === "PROJECT_NOT_FOUND") {
        toast.error("Error!", { 
          description: "Project not found." 
        });
      } else {
        toast.error("Error!", { 
          description: error.response?.data.message || "Failed to add user to project." 
        });
      }
      console.error("Add member error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleMemberUpdated = () => {
    refreshProjectData();
  };

  const handleUserLeftProject = () => {
    refetchProjects();
    onOpenChange(false);
    if (project.id === useProjectStore.getState().selectedProjectId) {
      setSelectedProject(undefined);
      setSelectedProjectId(undefined);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshProjectData();
    }
  }, [isOpen, refreshProjectData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogTitle className="text-xl flex justify-center">
          Manage Access
        </DialogTitle>
        
        {/* Додавання нового учасника */}
        <div className="space-y-3">
          <form onSubmit={handleAddMember} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email to add member"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isAdding}
              className="flex-1"
            />
            <Button type="submit" disabled={isAdding || !email.trim()}>
              <UserPlus size={16} className="mr-2" />
              {isAdding ? "Adding..." : "Add"}
            </Button>
          </form>
        </div>

        <Separator />

        {/* Пошук учасників */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search members by name, username or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Список учасників */}
        <ScrollArea className="h-82">
          <div className="space-y-3 pr-2.5">
            {filteredMembers.map((member) => (
              <UserCard
                key={member.id}
                member={member}
                projectId={project.id}
                currentUserRole={currentUserRole}
                onMemberUpdated={handleMemberUpdated}
                onUserLeftProject={handleUserLeftProject}
              />
            ))}
            
            {filteredMembers.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="mb-2">👥</div>
                <p className="text-sm">No members found</p>
                {searchQuery && (
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                )}
              </div>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        
        {/* Кнопка закриття */}
        <div className="pt-2">
          <Button 
            onClick={() => onOpenChange(false)} 
            className="w-full" 
            variant="outline"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}