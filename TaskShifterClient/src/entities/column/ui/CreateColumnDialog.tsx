import { ColumnService } from "@/entities/column/api/ColumnService";
import { useFetchProjects } from "@/pages/dashboard/lib/hooks/useFetchProjects";
import { useProjectStore } from "@/entities/project/lib/hooks/useProjectStore";
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { Separator } from "@/shared/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ColorPicker } from '@/shared/ui/Color-picker';
import { hexToDecimal } from '@/shared/lib/colorUtils';
import { ProjectService } from "@/entities/project/api/ProjectService";

const formSchema = z.object({
  name: z.string().min(1, "Column name is required").max(50, "Column name must be less than 50 characters"),
  color: z.string().min(1, "Color is required"),
  taskLimit: z.union([z.number().min(0, "Task limit must be positive"), z.literal('')]).optional(),
});

interface CreateColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: string;
}

export function CreateColumnDialog({ isOpen, onOpenChange, projectId }: CreateColumnDialogProps) {
  const { refetch } = useFetchProjects();
  const { setSelectedProject } = useProjectStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6", // blue-500 за замовчуванням
      taskLimit: '',
    }
  });

  const refreshProjectData = async () => {
    try {
      const response = await ProjectService.getProjectById(projectId);
      setSelectedProject(response.data);
    } catch (error) {
      console.error("Failed to refresh project data:", error);
    }
  };

  async function onDataSubmit(data: z.infer<typeof formSchema>) {
    const colorDecimal = hexToDecimal(data.color);
    
    // Конвертуємо пустий рядок в undefined, а числа залишаємо як є
    const processedTaskLimit = data.taskLimit === '' ? undefined : data.taskLimit;
    
    try {
      await ColumnService.createColumn(projectId, data.name, colorDecimal, processedTaskLimit);
      
      // Оновлюємо дані проекту
      await refreshProjectData();
      
      // Оновлюємо список проектів в сайдбарі
      refetch();
      
      form.reset();
      onOpenChange(false);
      toast.success("Success!", { description: "Column has been created successfully." });
    } catch (error) {
      toast.error("Error!", { description: "Failed to create column." });
      console.error("Create column error:", error);
    }
  }

  function handleCancelClick(e: React.MouseEvent) {
    e.preventDefault();
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2">
        <DialogTitle className="text-xl flex justify-center">Create New Column</DialogTitle>
        <Separator />
        <DialogDescription>
          Create a new column to organize your tasks.
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
                Create Column
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}