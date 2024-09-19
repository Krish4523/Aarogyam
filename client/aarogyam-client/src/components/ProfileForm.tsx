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
import axios from "axios";

type ProfileFormValues = z.infer<typeof patientProfileSchema>;

type ButtonSize = "default" | "sm" | "lg" | "icon" | null | undefined;

export function ProfileForm() {
  const [user, setUser] = useState<ProfileFormValues>({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
    emergencyContacts: [],
  });

  const [isEditable, setIsEditable] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profileImage || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [buttonSize, setButtonSize] = useState<ButtonSize>("default");

  console.log(user);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            },
          }
        );
        console.log(response.data);
        const sanitizedUser = sanitizeData(response.data);
        setUser(sanitizeData(response.data));
        form.reset({ ...sanitizedUser, emergencyContacts: [] });
        setImagePreview(sanitizedUser.profileImage || null);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [process.env.NEXT_PUBLIC_TOKEN]);

  useEffect(() => {
    const getEmergencyContact = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/emergency-contact`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            },
          }
        );
        console.log(response.data.data);
        setUser({
          ...user,
          emergencyContacts: response.data.data || [],
        });

        form.reset({
          ...user,
          emergencyContacts: response.data.data || [],
        });
      } catch (error) {
        console.log(error);
      }
    };
    getEmergencyContact();
  }, [process.env.NEXT_PUBLIC_TOKEN]);

  const sanitizeData = (data: any) => {
    return {
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      address: data.address ?? "",
      profileImage: data.profileImage ?? "",
      emergencyContacts: data.emergencyContacts || [],
    };
  };

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
    defaultValues: user,
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
    console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!isEditable) {
      setIsEditable(true);
    } else {
      try {
        const formData = new FormData();

        // Append form data
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("address", data.address);

        // If an image was uploaded, append it to the formData
        if (imageFile) {
          formData.append("profileImage", imageFile);
        }

        console.log(formData);
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/patient`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const contactResponse = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/patient`,
          data.emergencyContacts,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast({
          title: "Profile updated",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(response.data, null, 2)}
              </code>
            </pre>
          ),
        });

        setIsEditable(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to update profile.",
        });
      }
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
                    name={`emergencyContacts.${index}.phone`}
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
                        onClick={() => {
                          remove(index);
                          console.log(field.id);
                        }}
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
