"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/utils/validations/AuthSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { submitForm } from "@/utils/submitForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type LoginForm = z.infer<typeof LoginSchema>;

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form: UseFormReturn<LoginForm> = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(data: LoginForm) {
    const isEmail = z.string().email().safeParse(data.emailOrPhone).success;

    // Create the formData object with appropriate empty fields
    const formData = {
      email: isEmail ? data.emailOrPhone : "",
      phone: isEmail ? "" : data.emailOrPhone,
      password: data.password,
    };
    await submitForm({
      data: formData,
      endpoint: "/api/login",
      setLoading,
      setErrorMessage,
      onSuccess: (response) => {
        console.log("Account created successfully:", response);
        router.push("/patient");
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: `${error}`,
        });
      },
    });
  }

  return (
    <div className="flex items-start py-20 justify-center min-h-screen bg-secondary">
      <Form {...form}>
        <Card className="mx-auto max-w-sm shadow-md">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="emailOrPhone"
                    render={({ field }) => (
                      <FormItem>
                        {/*<FormLabel>Email</FormLabel>*/}
                        <FormControl>
                          <Input placeholder="Email or Phone No." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          {/*<FormLabel>Password</FormLabel>*/}
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm text-center">
                    {errorMessage}
                  </div>
                )}
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin text-white me-2" />{" "}
                      Loading...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <Link href="#" className="text-center text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </Form>
    </div>
  );
}

export default LoginPage;
