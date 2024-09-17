"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  MoreVertical,
  Stethoscope,
  Edit,
  Trash2,
  User2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatDate } from "@/utils/formatter";
import { Calendar } from "@/components/ui/calendar";

// MedicalRecord and MedicalRecordDetail interfaces
export interface MedicalRecord {
  id: number;
  name: string;
  description: string;
  recordDate: Date;
  doctorName: string;
  doctorID: number;
  patientID: number;
  patientName: string;
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
    patientName: "John Doe",
    patientID: 123,
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

// Zod schema for validation
const recordSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  recordDate: z.date(),
});

const addFileSchema = z.object({
  files: z.array(z.instanceof(File)),
});

type AddFilesFormValues = z.infer<typeof addFileSchema>;

interface MedicalRecordDetailsProps {
  role: "doctor" | "patient";
}

const MedicalRecordDetails = ({ role }: MedicalRecordDetailsProps) => {
  const { id } = useParams();
  const record = medicalRecords.find((rec) => rec.id === Number(id));

  const [isEditRecordDialogOpen, setIsEditRecordDialogOpen] = useState(false);
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [isEditRecordDetailDialogOpen, setIsEditRecordDetailDialogOpen] =
    useState(false);
  const [editRecordDetail, setEditRecordDetail] =
    useState<MedicalRecordDetail | null>(null);
  const [isAddingDetail, setIsAddingDetail] = useState(false);

  // UseForm with zod schema
  const recordFormMethods = useForm({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      name: record?.name || "",
      description: record?.description || "",
      recordDate: record?.recordDate || new Date(),
    },
  });

  const detailFormMethods = useForm({
    defaultValues: editRecordDetail || {},
  });
  const addFilesForm = useForm<AddFilesFormValues>({
    resolver: zodResolver(addFileSchema),
    defaultValues: { files: [] },
  });

  const date = recordFormMethods.watch("recordDate");

  const handleEditRecord = () => {
    setIsEditRecordDialogOpen(true);
  };

  const handleEditRecordDetail = (detail: MedicalRecordDetail) => {
    setEditRecordDetail(detail);
    detailFormMethods.reset({ result: detail.result });
    setIsAddingDetail(false);
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
    });
    setIsAddingDetail(true);
    setIsEditRecordDetailDialogOpen(true);
  };

  const handleGetFile = (file: RecordFile) => {
    console.log("Fetching file:", file.name);
  };

  const handleAddFile = (data: AddFilesFormValues) => {
    console.log(data);
  };

  const handleSubmitRecordEdit = (data: any) => {
    console.log("Updated Record Data:", data);
    setIsEditRecordDialogOpen(false); // Close dialog after submission
  };

  if (!record) {
    return <p>Record not found</p>;
  }

  return (
    <div className="container mx-auto mt-4 p-0">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <CardTitle className="text-primary text-2xl">
              {record.name}
            </CardTitle>
          </div>
          <CardDescription>{record.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="flex items-center gap-2 mb-1">
            <CalendarIcon size={20} />{" "}
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
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleEditRecord}>
              <Edit size={16} /> Edit
            </Button>
            <Button size="sm" variant="destructive">
              <Trash2 size={16} /> Delete
            </Button>
          </div>
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
          <div className="flex justify-between items-center">
            <h3 className="text-primary text-lg font-semibold">
              Medical Record Files
            </h3>
            <Button onClick={() => setIsAddFileOpen(true)}>Add File</Button>
            <Dialog open={isAddFileOpen} onOpenChange={setIsAddFileOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Medical Record Files</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <Form {...addFilesForm}>
                  <form
                    className={"space-y-2"}
                    onSubmit={addFilesForm.handleSubmit(handleAddFile)}
                  >
                    <FormField
                      control={addFilesForm.control}
                      name="files"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Files</FormLabel>
                          <FormControl>
                            <Input
                              name={field.name}
                              ref={field.ref}
                              type="file"
                              multiple
                              onChange={(e) => {
                                const files = e.target.files
                                  ? Array.from(e.target.files)
                                  : [];
                                addFilesForm.setValue("files", files);
                              }}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Add File</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <ol className="list-decimal pl-5">
            {record.medicalRecordFiles.map((file) => (
              <li key={file.id} className="marker:font-semibold my-4">
                <div className="flex justify-between">
                  <span>{file.name}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => handleGetFile(file)}
                      className="ml-4"
                    >
                      Get File
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleGetFile(file)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>

      {/* Edit Record Dialog */}
      <Dialog
        open={isEditRecordDialogOpen}
        onOpenChange={setIsEditRecordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>
          <FormProvider {...recordFormMethods}>
            <form
              onSubmit={recordFormMethods.handleSubmit(handleSubmitRecordEdit)}
            >
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="recordDate"
                render={({ field }) => (
                  <FormItem className="mt-2">
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
                              recordFormMethods.setValue(
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
              <Button type="submit" className="mt-4">
                Save Changes
              </Button>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

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

export default MedicalRecordDetails;
