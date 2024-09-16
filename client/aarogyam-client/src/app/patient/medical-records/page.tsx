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
import { Calendar, ListChecks, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MedicalRecord = {
  id: number;
  name: string;
  description: string;
  recordDate: Date;
  doctorName: string;
  doctorID: number;
  result: number;
};

const medicalRecords: MedicalRecord[] = [
  {
    id: 1,
    name: "Cancer Treatment",
    description: "Annual Physical Exam",
    recordDate: new Date("2023-06-15"),
    doctorName: "Dr. Smith",
    doctorID: 123,
    result: 85.4,
  },
  {
    id: 2,
    name: "Heart Attack",
    description: "Dental Checkup",
    recordDate: new Date("2023-05-12"),
    doctorName: "Dr. Adams",
    doctorID: 124,
    result: 92.1,
  },
];

const MedicalRecordsPage = () => {
  const [records] = useState<MedicalRecord[]>(medicalRecords);

  return (
    <div className="">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl text-primary font-bold">
          Patient Medical Records
        </h1>
        <Link href="/patient/medical-records/add">
          <Button>Add Record</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record) => (
          <Link
            key={record.id}
            href={`/patient/medical-records/${record.id}`}
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
                  <Stethoscope size={20} />
                  <span>{record.doctorName}</span>
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

export default MedicalRecordsPage;
