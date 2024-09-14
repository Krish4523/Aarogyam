"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, MapPin, Phone } from "lucide-react";

type AppointmentSlot = {
  date: Date;
  startTime: string;
  endTime: string;
  status: "available" | "booked";
};

type Appointment = {
  date: Date;
  type: "online" | "offline";
  location?: string;
  status:
    | "pending"
    | "completed"
    | "cancelled_by_patient"
    | "cancelled_by_doctor";
  notes?: string;
  appointmentSlot?: AppointmentSlot;
};

type Doctor = {
  id: number;
  imageUrl?: string;
  name: string;
  email: string;
  phone: string;
  specialities: string[];
  appointments: Appointment[];
  appointmentSlots: AppointmentSlot[];
};

// Dummy data
const dummyDoctor: Doctor = {
  id: 1,
  imageUrl: "/doctors1.jpeg",
  name: "Dr. Jane Smith",
  email: "jane.smith@hospital.com",
  phone: "+1 (555) 123-4567",
  specialities: ["Cardiology", "Radiology"],
  appointments: [
    {
      date: new Date("2023-06-15T10:00:00"),
      type: "online",
      status: "pending",
      notes: "Regular checkup",
    },
  ],
  appointmentSlots: [
    {
      date: new Date("2023-06-16T09:00:00"),
      startTime: "09:00",
      endTime: "09:30",
      status: "available",
    },
    {
      date: new Date("2023-06-16T10:00:00"),
      startTime: "10:00",
      endTime: "10:30",
      status: "booked",
    },
  ],
};

export default function DoctorPage({ params }: { params: { id: string } }) {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(Number(params.id));
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        // Uncomment the following lines to use real API call
        // const response = await axios.get(`/api/doctors/${id}`)
        // setDoctor(response.data)

        // Using dummy data for now
        setDoctor(dummyDoctor);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch doctor data");
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!doctor) return <div className="text-center mt-8">Doctor not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center space-x-4">
            <Image
              src={doctor.imageUrl || "/placeholder.svg?height=100&width=100"}
              alt={doctor.name}
              width={100}
              height={100}
              className="rounded-lg aspect-square object-cover"
            />
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                {doctor.name}
              </CardTitle>
              <div className="flex space-x-2 mt-2">
                {doctor.specialities.map((speciality, index) => (
                  <Badge key={index} variant="secondary">
                    {speciality}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <span>{doctor.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <span>{doctor.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {doctor.appointments.map((appointment, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>{appointment.date.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>
                    {appointment.appointmentSlot?.startTime} -{" "}
                    {appointment.appointmentSlot?.endTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge
                    variant={
                      appointment.type === "online" ? "default" : "secondary"
                    }
                  >
                    {appointment.type}
                  </Badge>
                  {appointment.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>{appointment.location}</span>
                    </div>
                  )}
                </div>
                <Badge
                  variant={
                    appointment.status === "pending"
                      ? "default"
                      : appointment.status === "completed"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {appointment.status}
                </Badge>
                {appointment.notes && (
                  <p className="mt-2 text-sm text-gray-500">
                    {appointment.notes}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {doctor.appointmentSlots.map((slot, index) => (
              <div
                key={index}
                className="mb-4 p-4 border rounded flex flex-wrap gap-2 justify-between items-center"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>{slot.date.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    slot.status === "available" ? "secondary" : "outline"
                  }
                >
                  {slot.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
