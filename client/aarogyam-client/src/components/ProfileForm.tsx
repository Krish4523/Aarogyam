"use client";

import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FilePenLine, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { patientProfileSchema } from "@/utils/validations/ProfileSchema";

type ProfileFormValues = z.infer<typeof patientProfileSchema>;

const defaultValues: ProfileFormValues = {
  name: "john_doe",
  email: "john@example.com",
  phone: "1234567890",
  address: "123 Main St, Anytown, USA",
  profileImage: "/doctors1.jpeg",
  emergencyContacts: [
    {
      name: "Jane Doe",
      relation: "Sister",
      phoneNo: "0987654321",
    },
    {
      name: "John Smith",
      relation: "Friend",
      phoneNo: "1122334455",
    },
  ],
};

type ButtonSize = "default" | "sm" | "lg" | "icon" | null | undefined;

export function ProfileForm() {
  const [isEditable, setIsEditable] = useState(false); // State to manage edit mode

  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues.profileImage || null
  );
  const [buttonSize, setButtonSize] = useState<ButtonSize>("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // The window object is available, you can safely use it
      const updateButtonSize = () => {
        setButtonSize(window.innerWidth <= 768 ? "sm" : "default");
      };

      updateButtonSize(); // Set the initial size
      window.addEventListener("resize", updateButtonSize);

      return () => {
        window.removeEventListener("resize", updateButtonSize);
      };
    }
  }, []);

  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "emergencyContacts",
    control: form.control,
  });

  const handleClearChatHistory = () => {
    toast({
      title: "Chat history cleared.",
      description: "All your AI chat history has been cleared.",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return; // Prevent image change if not in edit mode

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: ProfileFormValues) {
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
              <img
                src={imagePreview || "/default-avatar.png"}
                alt="Profile Image"
                className="rounded-full size-32 object-cover border"
              />
              {isEditable && ( // Show the edit icon only in edit mode
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
                  <Input placeholder="Name" {...field} disabled={!isEditable} />
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

          {/* Emergency Contacts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <FormLabel>Emergency Contacts</FormLabel>
              {isEditable && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          append({ name: "", relation: "", phoneNo: "" })
                        }
                      >
                        <UserPlus size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-muted text-muted-foreground">
                      <p>Add Contact</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row flex-1 gap-2">
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-auto flex-1">
                        <FormControl>
                          <Input
                            placeholder="Name"
                            {...field}
                            disabled={!isEditable}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.relation`}
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-auto flex-1">
                        <FormControl>
                          <Input
                            placeholder="Relation"
                            {...field}
                            disabled={!isEditable}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.phoneNo`}
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-auto flex-1">
                        <FormControl>
                          <Input
                            placeholder="Phone Number"
                            {...field}
                            disabled={!isEditable}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="self-start"
                        onClick={() => remove(index)}
                        disabled={!isEditable}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-muted text-muted-foreground">
                      <p>Remove Contact</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <Button type="submit" size={buttonSize}>
              {isEditable ? "Update Profile" : "Edit Profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size={buttonSize}
              onClick={handleClearChatHistory}
            >
              Clear AI Chat History
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
