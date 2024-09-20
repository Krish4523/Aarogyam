"use client";

import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FilePenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { hospitalProfileSchema } from "@/utils/validations/ProfileSchema";
import Image from "next/image";
import CreatableReactSelect from "react-select/creatable";

type HospitalFormValues = z.infer<typeof hospitalProfileSchema>;

const defaultValues: HospitalFormValues = {
  name: "City Hospital",
  email: "info@cityhospital.com",
  phone: "1234567890",
  address: "456 Healthcare St, Healthtown, USA",
  profileImage: "/hospital.jpg",
  website: "https://cityhospital.com",
  services: ["Cardiology", "Neurology"],
};

type ButtonSize = "default" | "sm" | "lg" | "icon" | null | undefined;

function Page() {
  const [isEditable, setIsEditable] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues.profileImage || null
  );
  const [buttonSize, setButtonSize] = useState<ButtonSize>("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateButtonSize = () => {
        setButtonSize(window.innerWidth <= 768 ? "sm" : "default");
      };

      updateButtonSize();
      window.addEventListener("resize", updateButtonSize);

      return () => {
        window.removeEventListener("resize", updateButtonSize);
      };
    }
  }, []);

  const { toast } = useToast();

  const form = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalProfileSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return;

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: HospitalFormValues) {
    if (!isEditable) {
      setIsEditable(true);
    } else {
      toast({
        title: "Profile updated",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      setIsEditable(false);
    }
  }

  return (
    <div className="max-w-4xl mt-4 mr-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8"
        >
          {/* Left Column - Profile Image, Email, Phone */}
          <div className="flex flex-col space-y-4">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <Image
                  src={"/doctors1.jpeg"} // imagePreview
                  alt="Hospital Image"
                  width={128}
                  height={128}
                  className="rounded-full size-32 object-cover border"
                />
                {isEditable && (
                  <label
                    htmlFor="profile-photo"
                    className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300 shadow-lg cursor-pointer"
                  >
                    <FilePenLine size={16} className="text-primary" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="profile-photo"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - All Other Fields */}
          <div className="space-y-8">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hospital Name"
                      {...field}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="Email" value={field.value} disabled />
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address"
                      {...field}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website Field */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://hospitalwebsite.com"
                      {...field}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Services Field with CreatableReactSelect */}
            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <FormControl>
                    <Controller
                      name="services"
                      control={form.control}
                      render={({ field }) => (
                        <CreatableReactSelect
                          {...field}
                          isMulti
                          placeholder="Select or create services"
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={defaultValues.services.map((service) => ({
                            value: service,
                            label: service,
                          }))}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              borderColor: state.isFocused
                                ? "hsl(var(--ring))"
                                : "hsl(var(--input))",
                              boxShadow: state.isFocused
                                ? "0 0 0 1px hsl(var(--ring))"
                                : "none",
                              "&:hover": {
                                borderColor: "hsl(var(--input))",
                              },
                            }),
                            option: (baseStyles, state) => ({
                              ...baseStyles,
                              backgroundColor: state.isFocused
                                ? "hsl(var(--accent))"
                                : "transparent",
                              color: state.isFocused
                                ? "hsl(var(--accent-foreground))"
                                : "inherit",
                            }),
                            multiValue: (baseStyles) => ({
                              ...baseStyles,
                              backgroundColor: "hsl(var(--secondary))",
                            }),
                            multiValueLabel: (baseStyles) => ({
                              ...baseStyles,
                              color: "hsl(var(--secondary-foreground))",
                            }),
                            multiValueRemove: (baseStyles) => ({
                              ...baseStyles,
                              color: "hsl(var(--secondary-foreground))",
                              "&:hover": {
                                backgroundColor: "hsl(var(--destructive))",
                                color: "hsl(var(--destructive-foreground))",
                              },
                            }),
                          }}
                          onChange={(newValue) =>
                            field.onChange(newValue.map((v) => v.value))
                          }
                          value={field.value?.map((value) => ({
                            label: value,
                            value,
                          }))}
                          isDisabled={!isEditable}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" size={buttonSize}>
                {isEditable ? "Update Profile" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Page;
