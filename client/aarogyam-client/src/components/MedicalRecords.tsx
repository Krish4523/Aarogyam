"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { Calendar, ListChecks, Stethoscope, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MedicalRecord = {
  id: number;
  name: string;
  description: string;
  recordDate: Date;
  doctorName: string;
  doctorID?: number;
  patientName?: string; // Add patientName for clarity
  patientID?: number;
  result: number;
};

const medicalRecords: MedicalRecord[] = [
  {
    id: 1,
    name: "Cancer Treatment",
    description: "Annual Physical Exam",
    recordDate: new Date("2023-06-15"),
    doctorName: "Dr. Smith",
    patientName: "John Doe",
    doctorID: 123,
    patientID: 456,
    result: 85.4,
  },
  {
    id: 2,
    name: "Heart Attack",
    description: "Dental Checkup",
    recordDate: new Date("2023-05-12"),
    doctorName: "Dr. Adams",
    patientName: "Jane Doe",
    doctorID: 124,
    patientID: 457,
    result: 92.1,
  },
];

interface MedicalRecordsProps {
  role: "doctor" | "patient"; // Role prop to determine which name to display
}

const MedicalRecords = ({ role }: MedicalRecordsProps) => {
  const [records] = useState<MedicalRecord[]>(medicalRecords);

  return (
    <div className="">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl text-primary font-bold">
          {role === "doctor"
            ? "Doctor's Medical Records"
            : "Patient's Medical Records"}
        </h1>
        <Link href={`/${role}/medical-records/add`}>
          <Button>Add Record</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record) => (
          <Link
            key={record.id}
            href={`/${role}/medical-records/${record.id}`}
            className="hover:no-underline"
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <CardHeader>
                <CardTitle className="text-primary">{record.name}</CardTitle>
                <CardDescription>{record.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="flex items-center gap-2 mb-1">
                  <Calendar size={20} />{" "}
                  <span>{record.recordDate.toDateString()}</span>
                </p>
                <p className="flex items-center gap-2 mb-1">
                  {role === "doctor" ? (
                    <>
                      <User2 size={20} />
                      <span>{record.patientName}</span>
                    </>
                  ) : (
                    <>
                      <Stethoscope size={20} />
                      <span>{record.doctorName}</span>
                    </>
                  )}
                </p>
                <p className="flex items-center gap-2">
                  <ListChecks size={20} /> {record.result}%
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MedicalRecords;
