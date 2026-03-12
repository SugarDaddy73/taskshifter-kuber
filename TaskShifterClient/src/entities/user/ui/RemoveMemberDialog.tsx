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
import type { MemberModel } from "@/entities/user/model/MemberModel";
import type { AxiosError } from "axios";

interface RemoveMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  member: MemberModel;
  projectId: string;
  onMemberRemoved: () => void;
}

export function RemoveMemberDialog({
  isOpen,
  onOpenChange,
  member,
  projectId,
  onMemberRemoved,
}: RemoveMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await ProjectService.removeMemberFromProject(projectId, member.id);
      toast.success("Success!", { description: "User has been removed from the project." });
      onMemberRemoved();
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ code: string; message: string }>;
      if (axiosError.response?.data.code === "NOT_ENOUGH_PERMISSIONS") {
        toast.error("Error!", { 
          description: "You don't have permission to remove users." 
        });
      } else if (axiosError.response?.data.code === "USER_NOT_MEMBER") {
        toast.error("Error!", { 
          description: "User is not a member of this project." 
        });
      } else if (axiosError.response?.data.code === "CANNOT_REMOVE_SELF") {
        toast.error("Error!", { 
          description: "You cannot remove yourself. Use 'Leave Project' instead." 
        });
      } else if (axiosError.response?.data.code === "PROJECT_NOT_FOUND") {
        toast.error("Error!", { 
          description: "Project not found." 
        });
      } else {
        toast.error("Error!", { 
          description: axiosError.response?.data.message || "Failed to remove user from project." 
        });
      }
      console.error("Remove member error:", error);
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
          Remove Member
        </DialogTitle>
        <Separator />
        <DialogDescription className="text-center">
          Are you sure you want to remove <strong>{member.fullName}</strong> from the project?<br />
          They will lose access to all project data.
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
            onClick={handleRemove}
            className="flex-1"
            type="button"
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}