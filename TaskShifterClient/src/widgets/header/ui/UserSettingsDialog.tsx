import { UserService } from "@/entities/user/api/UserService";
import { useUserStore } from "@/entities/user/lib/hooks/useUserStore";
import { useUserProfile } from "@/shared/lib/hooks/useUserProfile";
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

const formSchema = z.object({
    email: z.string(),
    username: z.string().min(2, `Username must contain at least ${2} symbols!`).max(50, `Username must contain no more than ${50} symbols!`),
    fullName: z.string().min(2, `Full name must contain at least ${2} symbols!`).max(50, `Full name must contain no more than ${50} symbols!`)
});

interface UserSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function UserSettingsDialog({ isOpen, onOpenChange }: UserSettingsDialogProps) {
  const user = useUserStore((state) => state.profile);
  const { invalidateUserProfile } = useUserProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
        username: "",
        fullName: ""
    }
  });

  function onDataSubmit(data: z.infer<typeof formSchema>) {
    UserService.updateCurrentUserProfile(data.email, data.username, data.fullName)
      .then(() => {
        invalidateUserProfile();
        
        onOpenChange(false);
        toast.success("Success!", { description: "Your profile has been updated." });
      })
      .catch((error) => {
        toast.error("Error!", { description: "Failed to update profile." });
        console.error("Update error:", error);
      });
  }

  function handleCancelClick(e: React.MouseEvent) {
    e.preventDefault();
    onOpenChange(false);
  }

  useEffect(() => {
    if (isOpen && user) {
      form.reset({
        email: user.email || "",
        username: user.username || "",
        fullName: user.fullName || ""
      });
    }
  }, [isOpen, user, form]);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2">
        <DialogTitle className="text-xl flex justify-center">Edit Profile</DialogTitle>
        <Separator />
        <DialogDescription></DialogDescription>
        <Form {...form}>
          <form className="flex flex-col gap-1.5" onSubmit={form.handleSubmit(onDataSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      autoComplete="email" 
                      placeholder="Your email" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      autoComplete="username" 
                      placeholder="Your display name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      autoComplete="name" 
                      placeholder="Your full name" 
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
              <Button disabled={!form.formState.isDirty} className="flex-1" type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UserSettingsDialog;