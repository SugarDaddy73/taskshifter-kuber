import { ColumnService } from "@/entities/column/api/ColumnService";
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { Separator } from "@/shared/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { AxiosError } from "axios";
import { ColorPicker } from '@/shared/ui/Color-picker';
import { hexToDecimal, decimalToHex } from '@/shared/lib/colorUtils';

const formSchema = z.object({
  name: z.string().min(1, "Column name is required").max(50, "Column name must be less than 50 characters"),
  color: z.string().min(1, "Color is required"),
  taskLimit: z.union([z.number().min(0, "Task limit must be positive"), z.literal('')]).optional(),
});

interface EditColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  column: {
    id: string;
    name: string;
    color: number;
    taskLimit?: number;
  };
  projectId: string;
  onColumnUpdated: () => void;
}

export function EditColumnDialog({ 
  isOpen, 
  onOpenChange, 
  column, 
  projectId,
  onColumnUpdated 
}: EditColumnDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
      taskLimit: '',
    }
  });

  function onDataSubmit(data: z.infer<typeof formSchema>) {
    const colorDecimal = hexToDecimal(data.color);
    
    // Конвертуємо пустий рядок в undefined, а числа залишаємо як є
    const processedTaskLimit = data.taskLimit === '' ? undefined : data.taskLimit;
    
    ColumnService.updateColumn(projectId, column.id, data.name, colorDecimal, processedTaskLimit)
      .then(() => {
        onColumnUpdated();
        form.reset();
        onOpenChange(false);
        toast.success("Success!", { description: "Column has been updated successfully." });
      })
      .catch((error: AxiosError<{ code: string; message: string }>) => {
        if (error.response?.data.code === "NOT_ENOUGH_PERMISSIONS") {
          toast.error("Error!", { 
            description: "You don't have permission to edit this column." 
          });
        } else if (error.response?.data.code === "COLUMN_NOT_FOUND") {
          toast.error("Error!", { 
            description: "Column not found." 
          });
        } else {
          toast.error("Error!", { 
            description: error.response?.data.message || "Failed to update column." 
          });
        }
        console.error("Edit column error:", error);
      });
  }

  function handleCancelClick(e: React.MouseEvent) {
    e.preventDefault();
    form.reset();
    onOpenChange(false);
  }

  useEffect(() => {
    if (isOpen && column) {
      form.reset({
        name: column.name,
        color: decimalToHex(column.color),
        taskLimit: !column.taskLimit ? '' : column.taskLimit,
      });
    }
  }, [isOpen, column, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2">
        <DialogTitle className="text-xl flex justify-center">Edit Column</DialogTitle>
        <Separator />
        <DialogDescription>
          Update column name, color, and task limit.
        </DialogDescription>
        <Form {...form}>
          <form className="flex flex-col gap-1.5" onSubmit={form.handleSubmit(onDataSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Column Name</FormLabel>
                  <FormControl>
                    <Input 
                      autoComplete="off"
                      placeholder="Enter column name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Limit (Empty for unlimited)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      placeholder="Leave empty for unlimited"
                      value={field.value === '' ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Дозволяємо пустий рядок або числа
                        if (value === '') {
                          field.onChange('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 0) {
                            field.onChange(numValue);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-1.5 mt-4">
              <Button onClick={handleCancelClick} className="flex-1" type="button" variant={"outline"}>
                Cancel
              </Button>
              <Button className="flex-1" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}