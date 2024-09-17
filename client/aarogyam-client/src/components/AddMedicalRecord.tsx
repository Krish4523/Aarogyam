"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ListPlus, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/utils/formatter";
import { MedicalRecordSchema } from "@/utils/validations/MedicalRecordSchema";

type MedicalRecordFormValues = z.infer<typeof MedicalRecordSchema>;
interface Person {
  id: number;
  name: string;
}

export default function AddMedicalRecord({
  role,
}: {
  role: "patient" | "doctor";
}) {
  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState<Person[]>([
    { id: 1, name: "Doctor1" },
    { id: 2, name: "Doctor2" },
  ]);

  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(MedicalRecordSchema),
    defaultValues: {
      recordDetails: [
        { name: "", normalRangeStart: 0, normalRangeEnd: 0, result: 0 },
      ],
      medicalRecordFiles: [],
    },
  });
  const date = form.watch("recordDate");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "recordDetails",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          role === "doctor" ? "/api/patients" : "/api/doctors"
        );
        setPersons(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "Error",
          description: "Failed to fetch doctors",
        });
      }
    };
    fetchDoctors();
  }, [role, toast]);
  const onSubmit = async (data: MedicalRecordFormValues) => {
    try {
      setLoading(true);

      console.log(data);
      const response = await axios.post("/api/patient/medical-records", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Success",
        description: "Medical record added successfully!",
      });
      router.push("/patient/medical-records");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to add medical record",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[768px]">
      <h1 className="text-2xl font-bold mb-4">Add Medical Record</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter record name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Optional description" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recordDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger className="ml-4 border rounded-md py-1 px-4">
                      {date ? formatDate(date) : "Select Date"}
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-fit">
                      <Calendar
                        mode="single"
                        className="rounded-md border"
                        selected={date}
                        onSelect={(selectedDate) =>
                          form.setValue(
                            "recordDate",
                            selectedDate || new Date()
                          )
                        }
                        disabled={(date: Date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={role === "doctor" ? "patientID" : "doctorID"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Select {role === "doctor" ? "Patient" : "Doctor"}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) =>
                      form.setValue(
                        role === "doctor" ? "patientID" : "doctorID",
                        Number(value)
                      )
                    }
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`Select a ${role === "doctor" ? "Patient" : "Doctor"}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {persons.map((person) => (
                        <SelectItem
                          key={person.id}
                          value={person.id.toString()}
                        >
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Medical Examination Details
              </h3>
              <Button
                type="button"
                size={"icon"}
                variant={"outline"}
                onClick={() =>
                  append({
                    name: "",
                    normalRangeStart: 0,
                    normalRangeEnd: 0,
                    result: 0,
                  })
                }
              >
                <ListPlus className="size-4 sm:size-5" />
              </Button>
            </div>
            {fields.map((item, index) => (
              <div key={item.id} className="space-y-2">
                <div className="flex gap-2 sm:gap-4 items-start">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`recordDetails.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detail Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter detail name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row mt-2 sm:space-x-4">
                      <FormField
                        control={form.control}
                        name={`recordDetails.${index}.normalRangeStart`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Normal Range Start</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                placeholder="Start"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`recordDetails.${index}.normalRangeEnd`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Normal Range End</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                placeholder="End"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`recordDetails.${index}.result`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Result</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                placeholder="Enter result"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="mt-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <FormField
            control={form.control}
            name="medicalRecordFiles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Files</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) =>
                      form.setValue(
                        "medicalRecordFiles",
                        Array.from(e.target.files!)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
