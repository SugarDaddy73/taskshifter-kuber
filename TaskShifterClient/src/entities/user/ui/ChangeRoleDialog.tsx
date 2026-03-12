import { ProjectService } from "@/entities/project/api/ProjectService";
import { Button } from "@/shared/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/Select";
import { Separator } from "@/shared/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import type { MemberModel } from "@/entities/user/model/MemberModel";
import type { AxiosError } from "axios";

interface ChangeRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  member: MemberModel;
  projectId: string;
  currentRole: number;
  onRoleChanged: () => void;
}

const roleOptions = [
  { value: "1", label: "Admin", description: "Can manage project settings and members" },
  { value: "0", label: "Member", description: "Can create and edit tasks" },
];

export function ChangeRoleDialog({
  isOpen,
  onOpenChange,
  member,
  projectId,
  currentRole,
  onRoleChanged,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (selectedRole === currentRole.toString()) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      await ProjectService.updateMemberRole(
        projectId,
        member.id,
        parseInt(selectedRole)
      );
      toast.success("Success!", { description: "User role has been updated." });
      onRoleChanged();
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ code: string; message: string }>;
      if (axiosError.response?.data.code === "NOT_ENOUGH_PERMISSIONS") {
        toast.error("Error!", { 
          description: "You don't have permission to change user roles." 
        });
      } else if (axiosError.response?.data.code === "USER_NOT_MEMBER") {
        toast.error("Error!", { 
          description: "User is not a member of this project." 
        });
      } else if (axiosError.response?.data.code === "CANNOT_ASSIGN_OWNER_ROLE") {
        toast.error("Error!", { 
          description: "Cannot assign owner role through this dialog." 
        });
      } else if (axiosError.response?.data.code === "PROJECT_NOT_FOUND") {
        toast.error("Error!", { 
          description: "Project not found." 
        });
      } else {
        toast.error("Error!", { 
          description: axiosError.response?.data.message || "Failed to update user role." 
        });
      }
      console.error("Update role error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedRole(currentRole.toString());
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2 sm:max-w-md">
        <DialogTitle className="text-xl flex justify-center">
          Change Role
        </DialogTitle>
        <Separator />
        <DialogDescription className="text-center">
          Change role for <strong>{member.fullName}</strong>
        </DialogDescription>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full justify-between">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value} className="w-full">
                    <div className="flex flex-col items-start w-full">
                      <span className="font-medium text-left">{role.label}</span>
                      <span className="text-xs text-gray-500 text-left">
                        {role.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row gap-1.5">
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
              onClick={handleSave}
              className="flex-1"
              type="button"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}