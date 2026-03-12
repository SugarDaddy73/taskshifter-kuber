import { ProjectService } from "@/entities/project/api/ProjectService";
import { Button } from "@/shared/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/Dialog";
import { Separator } from "@/shared/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface LeaveProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: string;
  projectName: string;
  onLeftProject: () => void;
}

export function LeaveProjectDialog({
  isOpen,
  onOpenChange,
  projectId,
  onLeftProject,
}: LeaveProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLeave = async () => {
    setIsLoading(true);
    try {
      await ProjectService.leaveProject(projectId);
      toast.success("Success!", { description: "You have left the project." });
      onLeftProject();
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ code: string; message: string }>;
      if (axiosError.response?.data.code === "OWNER_CANNOT_LEAVE") {
        toast.error("Error!", { 
          description: "Project owner cannot leave the project. Transfer ownership first." 
        });
      } else {
        toast.error("Error!", { 
          description: axiosError.response?.data.message || "Failed to leave project." 
        });
      }
      console.error("Leave project error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2 sm:max-w-md">
        <DialogTitle className="text-xl flex justify-center text-red-600">
          Leave Project
        </DialogTitle>
        <Separator />
        <DialogDescription className="text-center">
          Are you sure you want to leave this project?<br />
          You will lose access to all project data.
        </DialogDescription>

        <div className="flex flex-row gap-1.5 mt-4">
          <Button
            onClick={handleCancel}
            className="flex-1"
            type="button"
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLeave}
            className="flex-1"
            type="button"
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? "Leaving..." : "Leave"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}