// entities/task/ui/DeleteTaskDialog.tsx
import { TaskService } from "@/entities/task/api/TaskService";
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Separator } from "@/shared/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import type { TaskModel } from '@/entities/task/model/TaskModel';
import { useProjectStore } from '@/entities/project/lib/hooks/useProjectStore';
import { ProjectService } from '@/entities/project/api/ProjectService';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task: TaskModel;
  projectId: string;
}

export function DeleteTaskDialog({
  isOpen,
  onOpenChange,
  task,
  projectId,
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { setSelectedProject } = useProjectStore();

  const refreshProjectData = async () => {
    try {
      const response = await ProjectService.getProjectById(projectId);
      setSelectedProject(response.data);
    } catch (error) {
      console.error("Failed to refresh project data:", error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await TaskService.deleteTask(projectId, task.id);
      await refreshProjectData();
      onOpenChange(false);
      toast.success("Success!", { description: "Task has been deleted successfully." });
    } catch (error) {
      toast.error("Error!", { description: "Failed to delete task." });
      console.error("Delete task error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2">
        <DialogTitle className="text-xl flex justify-center text-red-600">
          Delete Task
        </DialogTitle>
        <Separator />
        <DialogDescription className="text-center">
          Are you sure you want to delete the task <strong>"{task.title}"</strong>?<br />
          This action cannot be undone.
        </DialogDescription>

        <div className="flex flex-row gap-1.5 mt-4">
          <Button
            onClick={handleCancel}
            className="flex-1"
            type="button"
            variant="outline"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="flex-1"
            type="button"
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}