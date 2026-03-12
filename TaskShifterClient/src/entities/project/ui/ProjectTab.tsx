import React, { useState } from 'react';
import { Ellipsis } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ProjectModel } from '@/entities/project/model/ProjectModel';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui/Context-menu"
import { Button } from '@/shared/ui/Button';
import { Pencil, Trash2, Users, LogOut } from 'lucide-react';
import { RenameProjectDialog } from './RenameProjectDialog';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { ManageAccessDialog } from './ManageAccessDialog';
import { LeaveProjectDialog } from '@/entities/user/ui/LeaveProjectDialog';
import { useUserStore } from '@/entities/user/lib/hooks/useUserStore';
import { useFetchProjects } from '@/pages/dashboard/lib/hooks/useFetchProjects';
import { useProjectStore } from '@/entities/project/lib/hooks/useProjectStore';
import { ProjectService } from '../api/ProjectService';

interface ProjectTabProps {
  project: ProjectModel;
  isSelected?: boolean;
  onClick?: (project: ProjectModel) => void;
}

export const ProjectTab: React.FC<ProjectTabProps> = ({ 
  project, 
  isSelected = false,
  onClick 
}) => {
  const { profile: currentUser } = useUserStore();
  const { refetch } = useFetchProjects();
  const { setSelectedProject, setSelectedProjectId } = useProjectStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isManageAccessDialogOpen, setIsManageAccessDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const currentUserMember = project.members?.find(m => m.id === currentUser?.id);
  const currentUserRole = currentUserMember?.role ?? 0;
  const isOwner = currentUserRole === 2;

  const handleClick = async () => {
    try {
      const response = await ProjectService.getProjectById(project.id);
      const fullProjectData = response.data;
      
      setSelectedProject(fullProjectData);
      setSelectedProjectId(fullProjectData.id);
      
      onClick?.(fullProjectData);
      
      console.log('Full project data loaded:', fullProjectData);
    } catch (error) {
      console.error('Failed to load project details:', error);
      setSelectedProject(project);
      setSelectedProjectId(project.id);
      onClick?.(project);
    }
  };

  const handleRenameClick = (e: Event) => {
    e.preventDefault();
    setIsRenameDialogOpen(true);
  };

  const handleManageAccessClick = (e: Event) => {
    e.preventDefault();
    setIsManageAccessDialogOpen(true);
  };

  const handleDeleteClick = (e: Event) => {
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  const handleLeaveClick = (e: Event) => {
    e.preventDefault();
    setIsLeaveDialogOpen(true);
  };

  const handleLeftProject = () => {
    refetch();
    
    if (isSelected) {
      setSelectedProject(undefined);
      setSelectedProjectId(undefined);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-between w-full px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 h-9",
              "border border-transparent",
              {
                "bg-slate-100": isSelected,
                "bg-white hover:bg-slate-50": !isSelected,
                "text-gray-900": !isSelected,
              }
            )}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="font-medium text-sm truncate flex-1">
              {project.name}
            </span>
            {(isHovered) && (
              <Button 
                className="rounded h-fit w-fit bg-transparent p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.preventDefault();
                  const event = new MouseEvent("contextmenu", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: e.clientX,
                    clientY: e.clientY,
                  });
                  e.currentTarget.dispatchEvent(event);
                }}
              >
                <Ellipsis 
                  size={16} 
                  className="text-gray-500"
                />
              </Button>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {isOwner && (
            <>
              <ContextMenuItem 
                className='hover:cursor-pointer'
                onSelect={handleRenameClick}
              >
                <Pencil color='black' size={16} className="mr-2" />
                Rename project
              </ContextMenuItem>
              <ContextMenuItem 
                className='hover:cursor-pointer'
                onSelect={handleManageAccessClick}
              >
                <Users color='black' size={16} className="mr-2" />
                Manage access
              </ContextMenuItem>
              <ContextMenuItem 
                className='hover:cursor-pointer text-red-500 focus:text-red-500'
                onSelect={handleDeleteClick}
              >
                <Trash2 color='red' size={16} className="mr-2" />
                Delete project
              </ContextMenuItem>
            </>
          )}
          
          {!isOwner && (
            <>
              <ContextMenuItem 
                className='hover:cursor-pointer'
                onSelect={handleManageAccessClick}
              >
                <Users color='black' size={16} className="mr-2" />
                Manage access
              </ContextMenuItem>
              <ContextMenuItem 
                className='hover:cursor-pointer text-red-500 focus:text-red-500'
                onSelect={handleLeaveClick}
              >
                <LogOut color='red' size={16} className="mr-2" />
                Leave project
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <RenameProjectDialog 
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        project={project}
      />

      <DeleteProjectDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        project={project}
      />

      <ManageAccessDialog
        isOpen={isManageAccessDialogOpen}
        onOpenChange={setIsManageAccessDialogOpen}
        project={project}
      />

      <LeaveProjectDialog
        isOpen={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
        projectId={project.id}
        projectName={project.name}
        onLeftProject={handleLeftProject}
      />
    </>
  );
};