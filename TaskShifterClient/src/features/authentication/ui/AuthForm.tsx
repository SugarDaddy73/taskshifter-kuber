"use client"
import { toast } from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  z
} from "zod"
import {
  Button
} from "@/shared/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/Form"
import {
  Input
} from "@/shared/ui/Input"
import { AuthService } from "../api/AuthService"
import { useAuthStore } from "@/shared/lib/hooks/useAuthStore"
import { type AxiosError } from "axios"
import type { ErrorResponse } from "@/shared/models/ErrorResponse"

const formSchema = z.object({
  email: z.string(),
  pass: z.string()
});

export default function AuthForm() {
  const { setAuthenticated } = useAuthStore();

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),

  })

  async function onSubmit(values: z.infer < typeof formSchema > ) {
    AuthService.authenticate(values.email, values.pass)
      .then((response) => {
        setAuthenticated(response.data.accessToken);
      })
      .catch((err: AxiosError<ErrorResponse>) => {
        if (err.response?.data.code === "VALIDATION_ERROR") {
          console.log(err.response?.data.errors);
          toast.error(err.response?.data.errors);
        }
        else if (err.response?.data.code === "INVALID_CREDENTIALS") {
          console.log("Invalid credentials");
          toast.error("Invalid credentials");
        }
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5 max-w-3xl mx-auto">
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                placeholder="example@expample.com"
                
                type="email"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                placeholder="Password"
                
                type="password"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-10 flex items-center justify-center py-2 bg-slate-900">Sign In</Button>
      </form>
    </Form>
  )
}