"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Hospital, Loader2, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitForm } from "@/utils/submitForm";
import { useRouter } from "next/navigation";
import { AppointmentSchema } from "@/utils/validations/AppointmentSchema";

interface DoctorCardProps {
  name: string;
  degree: string;
  imageUrl: string;
  speciality: string;
  hospital: string;
  address: string;
  rating: number;
}

type AppointmentForm = z.infer<typeof AppointmentSchema>;

function DoctorCard({
  name,
  degree,
  speciality,
  hospital,
  address,
  imageUrl,
  rating,
}: DoctorCardProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]); // State to store fetched slots
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentForm>({
    resolver: zodResolver(AppointmentSchema),
  });

  const router = useRouter();

  const date = watch("date");

  // Function to fetch available slots for the selected date

  // Call fetchAppointmentSlots when the date changes
  useEffect(() => {
    const fetchAppointmentSlots = async (selectedDate: Date) => {
      try {
        const response = await axios.get(`/api/appointment/slots`, {
          params: {
            date: selectedDate.toISOString(),
          },
        });

        setAvailableSlots(response.data.slots); // Assuming the response contains an array of available slots
      } catch (error) {
        console.error("Error fetching appointment slots:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available slots.",
        });
      }
    };
    if (date) {
      fetchAppointmentSlots(date);
    }
  }, [date, setAvailableSlots]);

  const onSubmit = async (data: AppointmentForm) => {
    toast({
      title: "Appointment Booked",
      description: `Date: ${data.date.toLocaleDateString()} Time: ${data.time}`,
    });
    await submitForm<AppointmentForm>({
      data,
      endpoint: "/api/appointments",
      setLoading,
      setErrorMessage,
      onSuccess: (response) => {
        console.log("Appointment created successfully:", response);
        router.push("/patient/appointments");
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: `${error} - ${errorMessage}`,
        });
        router.push("/patient/appointments");
      },
    });
    setDialogOpen(false); // Close the dialog on error
  };

  return (
    <div className="xl:mx-40 shadow-md max-w-4xl">
      <Card>
        <div className="flex sm:flex-row flex-col gap-1 sm:gap-2">
          <div className="">
            <img
              src="/doctors1.jpeg"
              className="size-full sm:max-w-[11rem] object-cover rounded-md"
              alt="Profile Image"
            />
          </div>
          <div className="flex-1">
            <CardHeader className="py-2">
              <CardTitle className="text-lg sm:text-2xl">{name}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs sm:text-sm">
                <GraduationCap className="w-5 h-5" />
                {degree} | {speciality}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-1 text-sm sm:text-md">
                <Hospital className="w-5 h-5" />
                {hospital}
              </p>
              <Link
                href={address}
                className="mt-2 flex items-center gap-1 text-sm sm:text-md text-wrap"
              >
                <MapPin size={20} /> {address}
              </Link>
            </CardContent>
            <CardFooter>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-xs sm:text-md">
                    Book Appointment
                  </Button>
                </DialogTrigger>
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
                      <DialogTitle>Book Appointment with {name}</DialogTitle>
                      <DialogDescription>
                        <p className="flex items-center gap-1 text-sm sm:text-md">
                          <Hospital className="w-5 h-5" />
                          {hospital}
                        </p>
                        <Link
                          href={address}
                          className="mt-2 flex items-center gap-1 text-sm sm:text-md text-wrap"
                        >
                          <MapPin size={20} /> {address}
                        </Link>
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <div>Select a date and time for your appointment.</div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Date:
                        </label>

                        <Popover>
                          <PopoverTrigger className="border rounded-md py-1 px-4">
                            {date ? date.toLocaleDateString() : "Select Date"}
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-fit">
                            <Calendar
                              mode="single"
                              className="rounded-md border"
                              selected={date}
                              onSelect={(selectedDate) =>
                                setValue("date", selectedDate || new Date())
                              }
                              disabled={(date: Date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      {errors.date && (
                        <p className="text-red-500 text-xs">
                          {errors.date.message}
                        </p>
                      )}

                      {/* Time Slot Selection */}
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <label className="text-sm font-medium text-gray-700">
                          Time Slot:
                        </label>
                        <ToggleGroup
                          variant="outline"
                          type="single"
                          onValueChange={(value) => setValue("time", value)}
                          className="flex flex-wrap justify-start gap-2"
                        >
                          {availableSlots.length > 0 ? (
                            availableSlots.map((slot) => (
                              <ToggleGroupItem key={slot} value={slot}>
                                {slot}
                              </ToggleGroupItem>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">
                              No available slots for this date.
                            </p>
                          )}
                        </ToggleGroup>
                      </div>
                      {errors.time && (
                        <p className="text-red-500 text-xs">
                          {errors.time.message}
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
                          "Book"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DoctorCard;

function RatingStar({ fillColor }: { fillColor: string }) {
  return (
    <svg
      className={`size-4 ${fillColor}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>
  );
}
