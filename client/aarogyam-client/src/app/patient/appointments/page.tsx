"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, MapPin, Hospital } from "lucide-react";
import Link from "next/link";
import { AppointmentSchema } from "@/utils/validations/AppointmentSchema";
import { formatDate, formatTime } from "@/utils/formatter";

// Appointment interface
interface Appointment {
  doctor: string;
  hospital: string;
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
}

type AppointmentFormValues = z.infer<typeof AppointmentSchema>;

// Mocked appointments data
const initialAppointments: Appointment[] = [
  {
    doctor: "Dr. John Doe",
    hospital: "City Hospital",
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    notes: "Initial consultation",
  },
  {
    doctor: "Dr. Jane Smith",
    hospital: "HealthCare Clinic",
    date: new Date(),
    startTime: "14:00",
    endTime: "15:00",
    notes: "Follow-up appointment",
  },
];

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
  });

  // Function to handle the edit button click
  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    reset(appointment); // Populate the form with current values
    setDialogOpen(true);
  };

  // Function to handle the form submission
  const onSubmit = (data: AppointmentFormValues) => {
    setLoading(true);
    setTimeout(() => {
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment === selectedAppointment
            ? { ...appointment, ...data }
            : appointment
        )
      );
      setLoading(false);
      setDialogOpen(false);
    }, 1000); // Simulating API call delay
  };

  // Function to handle the delete button click
  const handleDelete = (appointment: Appointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appt) => appt !== appointment)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Your Appointments
        </h1>
        <Link href="/patient/appointments/book">
          <Button>Book Appointment</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {appointments.map((appointment, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{appointment.doctor}</CardTitle>
              <CardDescription>{appointment.hospital}</CardDescription>
              <div className="mt-2 text-sm text-gray-600">
                {formatDate(appointment.date)} |{" "}
                {formatTime(appointment.startTime)} -{" "}
                {formatTime(appointment.endTime)}
              </div>
              {appointment.notes && (
                <p className="text-xs text-gray-500 mt-1">
                  Notes: {appointment.notes}
                </p>
              )}
            </CardHeader>
            <CardFooter className="flex gap-4">
              <Button variant="outline" onClick={() => handleEdit(appointment)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(appointment)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Appointment Dialog */}
      {selectedAppointment && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <div className="flex sm:flex-row flex-col gap-2">
              <div className="">
                <img
                  src="/doctors1.jpeg"
                  className="size-full sm:max-w-[11rem] object-cover rounded-md"
                  alt="Profile Image"
                />
              </div>
              <DialogHeader>
                <DialogTitle>
                  Edit Appointment with {selectedAppointment.doctor}
                </DialogTitle>
                <DialogDescription>
                  <span className="flex items-center gap-1 text-sm sm:text-md">
                    <Hospital className="w-5 h-5" />
                    {selectedAppointment.hospital}
                  </span>
                  <Link
                    href="#"
                    className="mt-2 flex items-center gap-1 text-sm sm:text-md text-wrap"
                  >
                    <MapPin size={20} /> Address Placeholder
                  </Link>
                </DialogDescription>
              </DialogHeader>
            </div>
            <div>Select a date and time for your appointment.</div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* Date Field */}
                <div className="flex items-center gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Date:
                  </label>
                  <Popover>
                    <PopoverTrigger className="border rounded-md py-1 px-4">
                      {selectedAppointment.date
                        ? selectedAppointment.date.toLocaleDateString()
                        : "Select Date"}
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-fit">
                      <Calendar
                        mode="single"
                        className="rounded-md border"
                        selected={selectedAppointment.date}
                        onSelect={(selectedDate) =>
                          setValue("date", selectedDate || new Date())
                        }
                        disabled={(date: Date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {errors.date && (
                  <p className="text-red-500 text-xs">{errors.date.message}</p>
                )}

                {/* Start Time Field */}
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <label className="text-sm text-nowrap font-medium text-gray-700">
                    Start Time:
                  </label>
                  <Input type="time" {...register("startTime")} />
                </div>
                {errors.startTime && (
                  <p className="text-red-500 text-xs">
                    {errors.startTime.message}
                  </p>
                )}

                {/* End Time Field */}
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <label className="text-sm text-nowrap font-medium text-gray-700">
                    End Time:
                  </label>
                  <Input type="time" {...register("endTime")} />
                </div>
                {errors.endTime && (
                  <p className="text-red-500 text-xs">
                    {errors.endTime.message}
                  </p>
                )}

                {/* Notes Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <Input
                    placeholder="Any special requests or notes"
                    {...register("notes")}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="mt-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin text-white me-2" />{" "}
                      Loading...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
