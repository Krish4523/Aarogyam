"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { SignUpSchema } from "@/utils/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { submitForm } from "@/utils/submitForm";

interface InputFieldsProps {
  name: "name" | "email" | "password" | "phone";
  placeholder: string;
}
const inputFields: InputFieldsProps[] = [
  { name: "name", placeholder: "Name" },
  { name: "email", placeholder: "Email" },
  { name: "password", placeholder: "Password" },
  { name: "phone", placeholder: "Phone No" },
];

export type SignUpForm = z.infer<typeof SignUpSchema>;

function SignupPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const form: UseFormReturn<SignUpForm> = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });
  const router = useRouter();

  async function onSubmit(data: SignUpForm) {
    await submitForm<SignUpForm>({
      data,
      endpoint: "/api/signup",
      router,
      setLoading,
      setErrorMessage,
      onSuccess: (response) => {
        console.log("Account created successfully:", response);
        // Additional success logic if needed
      },
    });
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
                                    name !== "password" ? "text" : "password"
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
                  {/*<div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="profileImage"
                      render={({
                        field: { value, onChange, ...fieldProps },
                      }) => (
                        <FormItem>
                          <FormLabel>Profile picture</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...fieldProps}
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={(event) => {
                                onChange(
                                  event.target.files && event.target.files[0]
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>*/}
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
