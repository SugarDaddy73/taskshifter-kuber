import { ProjectService } from "@/entities/project/api/ProjectService";
import { useFetchProjects } from "@/pages/dashboard/lib/hooks/useFetchProjects";
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

const formSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Project name must be less than 100 characters"),
});

interface RenameProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project: {
    id: string;
    name: string;
  };
}

export function RenameProjectDialog({ isOpen, onOpenChange, project }: RenameProjectDialogProps) {
  const { refetch } = useFetchProjects();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    }
  });

  function onDataSubmit(data: z.infer<typeof formSchema>) {
    ProjectService.updateProject(project.id, data.name)
      .then(() => {
        refetch();
        form.reset();
        onOpenChange(false);
        toast.success("Success!", { description: "Project has been renamed successfully." });
      })
      .catch((error: AxiosError<{ code: string; message: string }>) => {
        if (error.response?.data.code === "NOT_ENOUGH_PERMISSIONS") {
          toast.error("Error!", { 
            description: "You don't have permission to rename this project." 
          });
        } else if (error.response?.data.code === "PROJECT_NOT_FOUND") {
          toast.error("Error!", { 
            description: "Project not found." 
          });
        } else {
          toast.error("Error!", { 
            description: error.response?.data.message || "Failed to rename project." 
          });
        }
        console.error("Rename project error:", error);
      });
  }

  function handleCancelClick(e: React.MouseEvent) {
    e.preventDefault();
    form.reset();
    onOpenChange(false);
  }

  useEffect(() => {
    if (isOpen && project) {
      form.reset({
        name: project.name,
      });
    }
  }, [isOpen, project, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2">
        <DialogTitle className="text-xl flex justify-center">Rename Project</DialogTitle>
        <Separator />
        <DialogDescription>
          Enter a new name for your project.
        </DialogDescription>
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
                Rename
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}