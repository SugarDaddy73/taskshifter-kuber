import { ProjectService } from "@/entities/project/api/ProjectService";
import { useFetchProjects } from "@/pages/dashboard/lib/hooks/useFetchProjects";
import { useProjectStore } from "@/entities/project/lib/hooks/useProjectStore";
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Separator } from "@/shared/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project: {
    id: string;
    name: string;
  };
}

export function DeleteProjectDialog({ isOpen, onOpenChange, project }: DeleteProjectDialogProps) {
  const { refetch } = useFetchProjects();
  const { setSelectedProject, setSelectedProjectId } = useProjectStore();
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setIsDeleting(true);
    ProjectService.deleteProject(project.id)
      .then(() => {
        setSelectedProject(undefined);
        setSelectedProjectId(undefined);

        refetch();
        onOpenChange(false);
        toast.success("Success!", { description: "Project has been deleted successfully." });
      })
      .catch((error: AxiosError<{ code: string; message: string }>) => {
        if (error.response?.data.code === "NOT_ENOUGH_PERMISSIONS") {
          toast.error("Error!", { 
            description: "You don't have permission to delete this project." 
          });
        } else if (error.response?.data.code === "PROJECT_NOT_FOUND") {
          toast.error("Error!", { 
            description: "Project not found." 
          });
        } else {
          toast.error("Error!", { 
            description: error.response?.data.message || "Failed to delete project." 
          });
        }
        console.error("Delete project error:", error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }

  function handleCancelClick(e: React.MouseEvent) {
    e.preventDefault();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2">
        <DialogTitle className="text-xl flex justify-center text-red-600">Delete Project</DialogTitle>
        <Separator />
        <DialogDescription className="text-center">
          Are you sure you want to delete the project <strong>"{project.name}"</strong>?<br />
          This action cannot be undone.
        </DialogDescription>
        
        <div className="flex flex-row gap-1.5 mt-4">
          <Button 
            onClick={handleCancelClick} 
            className="flex-1" 
            type="button" 
            variant={"outline"}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            className="flex-1" 
            type="button"
            variant={"destructive"}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}