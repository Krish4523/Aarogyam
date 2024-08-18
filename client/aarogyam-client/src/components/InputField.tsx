import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SignUpForm } from "@/app/(auth)/signup/page";

type InputFieldProps = {
  form: UseFormReturn<SignUpForm>;
  name: FieldName;
  placeholder: string;
};

export type FieldName = "name" | "email" | "password" | "phone" | "address";

function InputField({ form, name, placeholder }: InputFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type={name !== "password" ? "text" : "password"}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default InputField;
