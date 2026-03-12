"use client"
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
import { toast } from "sonner"

const formSchema = z.object({
  username: z.string().min(2).max(50),
  fullName: z.string().min(2).max(50),
  email: z.string(),
  password: z.string().min(8).max(25),
  passwordConfirm: z.string().min(8).max(25),
}).superRefine(({ passwordConfirm, password }, ctx) => {
  if (passwordConfirm !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['passwordConfirm']
    });
  }
});

export default function RegistrationForm() {
  const { setAuthenticated } = useAuthStore();

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),

  })

  async function onSubmit(values: z.infer < typeof formSchema > ) {
      AuthService.register(
        values.email,
        values.username,
        values.fullName,
        values.password
      )
      .then((response) => {
        setAuthenticated(response.data.accessToken);
      })
      .catch((err: AxiosError<ErrorResponse>) => {
        if (err.response?.data.code === "USER_ALREADY_EXISTS") {
          console.log(err.response?.data.errors);
          toast.error("User already exists");
        }
        else if (err.response?.data.code === "VALIDATION_ERROR") {
          console.log(err.response?.data.errors);
          toast.error("Validation error");
        }
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 max-w-3xl mx-auto">
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                placeholder="Username"
                
                type="text"
                {...field} />
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
                placeholder="John Pork"
                
                type="text"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
          name="password"
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
        
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirmation</FormLabel>
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
        <Button type="submit" className='flex items-center justify-center w-full bg-slate-900 text-white'>Sign Up</Button>
      </form>
    </Form>
  )
}