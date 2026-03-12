import { ColumnService } from "@/entities/column/api/ColumnService";
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Separator } from "@/shared/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface DeleteColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  column: {
    id: string;
    name: string;
  };
  projectId: string;
  onColumnDeleted: () => void;
}

export function DeleteColumnDialog({
  isOpen,
  onOpenChange,
  column,
  projectId,
  onColumnDeleted,
}: DeleteColumnDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await ColumnService.deleteColumn(projectId, column.id);
      onColumnDeleted();
      onOpenChange(false);
      toast.success("Success!", { description: "Column has been deleted successfully." });
    } catch (error) {
      const axiosError = error as AxiosError<{ code: string; message: string }>;
      if (axiosError.response?.data.code === "NOT_ENOUGH_PERMISSIONS") {
        toast.error("Error!", { 
          description: "You don't have permission to delete this column." 
        });
      } else if (axiosError.response?.data.code === "COLUMN_NOT_FOUND") {
        toast.error("Error!", { 
          description: "Column not found." 
        });
      } else if (axiosError.response?.data.code === "COLUMN_HAS_TASKS") {
        toast.error("Error!", { 
          description: "Cannot delete column with tasks. Move or delete tasks first." 
        });
      } else {
        toast.error("Error!", { 
          description: axiosError.response?.data.message || "Failed to delete column." 
        });
      }
      console.error("Delete column error:", error);
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
          Delete Column
        </DialogTitle>
        <Separator />
        <DialogDescription className="text-center">
          Are you sure you want to delete the column <strong>"{column.name}"</strong>?<br />
          {isDeleting ? "This action cannot be undone." : "All tasks in this column will also be deleted."}
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