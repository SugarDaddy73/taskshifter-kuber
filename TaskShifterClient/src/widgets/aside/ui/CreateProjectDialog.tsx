import { ProjectService } from "@/entities/project/api/ProjectService";
import { useFetchProjects } from "@/pages/dashboard/lib/hooks/useFetchProjects";
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { Separator } from "@/shared/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Project name must be less than 100 characters"),
});

interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CreateProjectDialog({ isOpen, onOpenChange }: CreateProjectDialogProps) {
  const { refetch } = useFetchProjects();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    }
  });

  function onDataSubmit(data: z.infer<typeof formSchema>) {
    ProjectService.createProject(data.name)
      .then(() => {
        refetch(); // Оновлюємо список проєктів
        form.reset();
        onOpenChange(false);
        toast.success("Success!", { description: "Project has been created successfully." });
      })
      .catch((error) => {
        toast.error("Error!", { description: "Failed to create project." });
        console.error("Create project error:", error);
      });
  }

  function handleCancelClick(e: React.MouseEvent) {
    e.preventDefault();
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2">
        <DialogTitle className="text-xl flex justify-center">Create New Project</DialogTitle>
        <Separator />
        <Form {...form}>
          <form className="flex flex-col gap-1.5" onSubmit={form.handleSubmit(onDataSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input 
                      autoComplete="off"
                      placeholder="Enter project name"
                      {...field}
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
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}