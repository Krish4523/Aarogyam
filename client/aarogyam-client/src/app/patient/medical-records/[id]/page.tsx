"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, MoreVertical, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// MedicalRecord and MedicalRecordDetail interfaces
interface MedicalRecord {
  id: number;
  name: string;
  description: string;
  recordDate: Date;
  doctorName: string;
  doctorID: number;
  recordDetails: MedicalRecordDetail[];
  medicalRecordFiles: RecordFile[];
}

export interface MedicalRecordDetail {
  name: string;
  unit?: string;
  normalRangeStart: number;
  normalRangeEnd: number;
  result: number;
}

type RecordFile = {
  id: number;
  name: string;
};

// Sample medicalRecords data
const medicalRecords: MedicalRecord[] = [
  {
    id: 1,
    name: "Cancer Operation",
    description: "Annual Physical Exam",
    recordDate: new Date("2023-06-15"),
    doctorName: "Dr. Smith",
    doctorID: 123,
    recordDetails: [
      {
        name: "Blood Pressure",
        normalRangeStart: 80,
        normalRangeEnd: 120,
        result: 50.32,
      },
      {
        name: "Heart Rate",
        unit: "bpm",
        normalRangeStart: 60,
        normalRangeEnd: 100,
        result: 50.32,
      },
    ],
    medicalRecordFiles: [
      { id: 1, name: "file1.pdf" },
      { id: 2, name: "file2.pdf" },
    ],
  },
];

const MedicalRecordDetailsPage = () => {
  const { id } = useParams();
  const record = medicalRecords.find((rec) => rec.id === Number(id));

  const [editRecordDetail, setEditRecordDetail] =
    useState<MedicalRecordDetail | null>(null);
  const [isEditRecordDetailDialogOpen, setIsEditRecordDetailDialogOpen] =
    useState(false);
  const [isAddingDetail, setIsAddingDetail] = useState(false); // Track if adding a new detail

  const detailFormMethods = useForm({
    defaultValues: editRecordDetail || {},
  });

  const handleEditRecordDetail = (detail: MedicalRecordDetail) => {
    setEditRecordDetail(detail);
    detailFormMethods.reset({ result: detail.result }); // Only the result field should be editable
    setIsAddingDetail(false); // Not adding, we're editing
    setIsEditRecordDetailDialogOpen(true);
  };

  const handleAddRecordDetail = () => {
    setEditRecordDetail(null);
    detailFormMethods.reset({
      name: "",
      unit: "",
      normalRangeStart: undefined,
      normalRangeEnd: undefined,
      result: undefined,
    }); // Reset the form for new detail input
    setIsAddingDetail(true); // We're adding a new detail
    setIsEditRecordDetailDialogOpen(true);
  };

  const handleGetFile = (file: RecordFile) => {
    console.log("Fetching file:", file.name);
  };

  if (!record) {
    return <p>Record not found</p>;
  }

  return (
    <div className="container mx-auto mt-4 p-0">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary text-2xl">
              {record.name}
            </CardTitle>
          </div>
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
        </CardContent>
      </Card>

      {/* Tabs for Record Details and Files */}
      <Tabs defaultValue="details" className="mt-6">
        <TabsList>
          <TabsTrigger value="details">Record Details</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        {/* Record Details Tab */}
        <TabsContent value="details">
          <div className="flex justify-between items-center my-2 me-2">
            <h3 className="text-primary text-lg font-semibold">
              Medical Record Details
            </h3>
            <Button size="sm" onClick={handleAddRecordDetail}>
              Add Detail
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Name</TableHead>
                <TableHead className="text-primary">Unit</TableHead>
                <TableHead className="text-primary">Range</TableHead>
                <TableHead className="text-primary">Result</TableHead>
                <TableHead className="text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {record.recordDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.name}</TableCell>
                  <TableCell>{detail.unit || "-"}</TableCell>
                  <TableCell>
                    {detail.normalRangeStart} - {detail.normalRangeEnd}
                  </TableCell>
                  <TableCell>{detail.result}%</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical size={16} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-26 p-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mb-2"
                          onClick={() => handleEditRecordDetail(detail)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                        >
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files">
          <h3 className="text-primary text-lg font-semibold">
            Medical Record Files
          </h3>
          <ol className="list-decimal pl-5">
            {record.medicalRecordFiles.map((file) => (
              <li key={file.id} className="marker:font-semibold my-4">
                <div className="flex justify-between">
                  <span>{file.name}</span>
                  <Button
                    size="sm"
                    onClick={() => handleGetFile(file)}
                    className="ml-4"
                  >
                    Get File
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>

      {/* Edit/Add Medical Record Detail Dialog */}
      <Dialog
        open={isEditRecordDetailDialogOpen}
        onOpenChange={setIsEditRecordDetailDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddingDetail ? "Add Record Detail" : "Edit Record Detail"}
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...detailFormMethods}>
            <form
              onSubmit={detailFormMethods.handleSubmit((data) =>
                console.log(
                  isAddingDetail ? "Added Detail:" : "Updated Detail:",
                  data
                )
              )}
            >
              {/* Conditionally render fields based on whether editing or adding */}
              {isAddingDetail && (
                <>
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detail Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="unit"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="normalRangeStart"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Normal Range Start</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="normalRangeEnd"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Normal Range End</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                name="result"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Result</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4">
                {isAddingDetail ? "Add Detail" : "Save Detail"}
              </Button>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalRecordDetailsPage;
