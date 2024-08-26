"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { SignUpSchema } from "@/utils/validations/AuthSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface InputFieldsProps {
  name: "name" | "email" | "password" | "confirm_password" | "phone";
  placeholder: string;
}

const inputFields: InputFieldsProps[] = [
  { name: "name", placeholder: "Name" },
  { name: "email", placeholder: "Email" },
  { name: "password", placeholder: "Password" },
  { name: "confirm_password", placeholder: "Confirm Password" },
  { name: "phone", placeholder: "Phone No" },
];

export type SignUpForm = z.infer<typeof SignUpSchema>;

function SignupPage() {
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const { signup, loading, errorMessage } = useAuth();

  const form: UseFormReturn<SignUpForm> = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
    },
  });
  // const router = useRouter();

  // const { toast } = useToast();

  async function onSubmit(data: SignUpForm) {
    /*await submitForm<SignUpForm>({
      data,
      endpoint: "auth/signup",
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
    });*/
    await signup(data);
  }

  return (
    <>
      <div className="flex items-start py-20 justify-center min-h-screen bg-secondary">
        <Form {...form}>
          <Card className="mx-auto max-w-sm shadow-md">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Sign up</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {inputFields.map(
                    ({ name, placeholder }: InputFieldsProps) => (
                      <div className="grid gap-2" key={name}>
                        <FormField
                          control={form.control}
                          name={name}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type={
                                    ["password", "confirm_password"].includes(
                                      name
                                    )
                                      ? "password"
                                      : "text"
                                  }
                                  placeholder={placeholder}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )
                  )}
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
                      "Create Account"
                    )}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </form>
          </Card>
        </Form>
      </div>
    </>
  );
}

export default SignupPage;
