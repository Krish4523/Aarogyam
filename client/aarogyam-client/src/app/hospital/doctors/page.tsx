"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { MoreHorizontal } from "lucide-react";
import CreatableReactSelect from "react-select/creatable";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AddDoctorSchema } from "@/utils/validations/AddDoctorSchema";

interface DoctorInfo {
  id: number;
  imageUrl?: string;
  name: string;
  email: string;
  phone: string;
  specialities: string[];
  gender: "male" | "female" | "other";
}

function Page() {
  const [doctors, setDoctors] = useState<DoctorInfo[]>([
    {
      id: 1,
      imageUrl: "https://example.com/doctor1.jpg",
      name: "Dr. Alice Smith",
      email: "alice.smith@example.com",
      phone: "2345678901",
      specialities: ["Cardiology", "Radiology"],
      gender: "female",
    },
    {
      id: 2,
      imageUrl: "https://example.com/doctor2.jpg",
      name: "Dr. John Doe",
      email: "john.doe@example.com",
      phone: "9876503210",
      specialities: ["Neurology", "Pediatrics"],
      gender: "male",
    },
    {
      id: 3,
      imageUrl: "https://example.com/doctor3.jpg",
      name: "Dr. Emily Johnson",
      email: "emily.johnson@example.com",
      phone: "4567890123",
      specialities: ["Dermatology"],
      gender: "female",
    },
    {
      id: 4,
      imageUrl: "https://example.com/doctor4.jpg",
      name: "Dr. Michael Brown",
      email: "michael.brown@example.com",
      phone: "3216549870",
      specialities: ["Orthopedics", "MD"],
      gender: "male",
    },
    {
      id: 5,
      imageUrl: "https://example.com/doctor5.jpg",
      name: "Dr. Sarah Lee",
      email: "sarah.lee@example.com",
      phone: "1654321098",
      specialities: ["Ophthalmology", "Surgery"],
      gender: "female",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorInfo | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof AddDoctorSchema>>({
    resolver: zodResolver(AddDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialities: [],
      gender: undefined,
    },
  });

  const deleteDoctor = (id: number) => {
    console.log(id);
  };

  const viewDetails = (id: number) => {
    router.push(`/hospital/doctors/${id}`);
  };

  const openEditDialog = (doctor: DoctorInfo) => {
    setEditingDoctor(doctor);
    form.reset({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialities: doctor.specialities.map((s) => ({ value: s, label: s })),
      gender: doctor.gender,
    });
    setIsDialogOpen(true);
  };

  const handleAddDoctorClick = () => {
    setEditingDoctor(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      specialities: [],
      gender: undefined,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof AddDoctorSchema>) => {
    if (editingDoctor) {
      // Update existing doctor
      const updatedDoctors = doctors.map((d) =>
        d.id === editingDoctor.id
          ? {
              ...d,
              ...values,
              specialities: values.specialities.map((s) => s.value),
            }
          : d
      );
      setDoctors(updatedDoctors);
    } else {
      // Add new doctor
      const newDoctor: DoctorInfo = {
        id: doctors.length + 1,
        name: values.name,
        email: values.email,
        phone: values.phone,
        specialities: values.specialities.map((s) => s.value),
        gender: values.gender,
      };
      setDoctors([...doctors, newDoctor]);
    }
    setIsDialogOpen(false);
    setEditingDoctor(null);
    form.reset();
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={handleAddDoctorClick}>
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
              </DialogTitle>
              <DialogDescription>
                {editingDoctor
                  ? "Edit the details of the doctor."
                  : "Enter the details of the new doctor here."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Doe" {...field} />
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
                          placeholder="john.doe@example.com"
                          {...field}
                          disabled={!!editingDoctor}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialities</FormLabel>
                      <FormControl>
                        <Controller
                          name="specialities"
                          control={form.control}
                          render={({ field }) => (
                            <CreatableReactSelect
                              {...field}
                              isMulti
                              placeholder="Select or create specialities"
                              className="react-select-container"
                              classNamePrefix="react-select"
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
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingDoctor ? "Update" : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>
            <TableHead className="text-primary">Name</TableHead>
            <TableHead className="text-primary hidden md:table-cell">
              Email
            </TableHead>
            <TableHead className="text-primary">Phone</TableHead>
            <TableHead className="text-primary">Specialities</TableHead>
            <TableHead className="text-primary hidden md:table-cell">
              Gender
            </TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Doctor Image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src="/doctors1.jpeg"
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {doctor.email}
                </TableCell>
                <TableCell className="">{doctor.phone}</TableCell>
                <TableCell className="">
                  <div className="flex flex-wrap gap-1">
                    {doctor.specialities.map((speciality, index) => (
                      <Badge key={index} variant="secondary">
                        {speciality}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell capitalize">
                  {doctor.gender}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => viewDetails(doctor.id)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(doctor)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteDoctor(doctor.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No Doctors Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Page;
