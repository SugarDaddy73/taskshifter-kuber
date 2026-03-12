import { UserService } from "@/entities/user/api/UserService";
import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/Dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { Separator } from "@/shared/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AxiosError } from "axios";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password must be no more than 25 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function ChangePasswordDialog({ isOpen, onOpenChange }: ChangePasswordDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true);
    
    UserService.updateCurrentUserPassword(data.currentPassword, data.newPassword)
      .then(() => {
        toast.success("Success!", { 
          description: "Your password has been changed successfully." 
        });
        form.reset();
        onOpenChange(false);
      })
      .catch((err: AxiosError<{ code: string; message: string }>) => {
        if (err.response?.data.code === "INVALID_CURRENT_PASSWORD") {
          toast.error("Error!", { 
            description: "Current password is incorrect." 
          });
        }
        else {
          toast.error("Error!", { 
            description: err.response?.data.message || "Failed to change password. Please try again." 
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCancelClick(e: React.MouseEvent) {
    e.preventDefault();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-2 sm:max-w-[425px]">
        <DialogTitle className="text-xl flex justify-center">Change Password</DialogTitle>
        <Separator />
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      autoComplete="off"
                      placeholder="Enter current password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      autoComplete="off"
                      placeholder="Enter new password (8-25 characters)"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      autoComplete="off"
                      placeholder="Confirm new password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row w-full gap-1 mt-4">
              <Button 
                onClick={handleCancelClick} 
                className="min-w-0 flex-1" 
                type="button" 
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                className="min-w-0 flex-1" 
                type="submit"
                disabled={isLoading || !form.formState.isDirty}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordDialog;