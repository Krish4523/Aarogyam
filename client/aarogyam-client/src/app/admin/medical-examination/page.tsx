"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Assuming you are using Input from Shadcn UI
import { Edit, Trash, MoreVertical, Plus } from "lucide-react";

const MedicalRecords = () => {
  const [showActions, setShowActions] = useState<number | null>(null);
  const [records, setRecords] = useState([
    { name: "Blood pressure", unit: "mg/dL", range: "70-100", result: "95" },
    { name: "Heart rate", unit: "mmHg", range: "120-80", result: "130-85" },
  ]);

  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedRecord, setEditedRecord] = useState({
    name: "",
    unit: "",
    range: "",
    result: "",
  });

  const [newRecord, setNewRecord] = useState({
    name: "",
    unit: "",
    range: "",
    result: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    unit: "",
    range: "",
    result: "",
  });

  // Validate fields
  const validateFields = (record: typeof newRecord) => {
    const newErrors = {
      name: record.name ? "" : "Name is required.",
      unit: record.unit ? "" : "Unit is required.",
      range: record.range ? "" : "Range is required.",
      result: record.result ? "" : "Result is required.",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleEditRecordDetail = (index: number) => {
    const recordToEdit = records[index];
    setSelectedRecord(index);
    setEditedRecord({ ...recordToEdit });
    setShowActions(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    if (validateFields(editedRecord)) {
      if (selectedRecord !== null) {
        const updatedRecords = [...records];
        updatedRecords[selectedRecord] = editedRecord;
        setRecords(updatedRecords);
        setSelectedRecord(null);
      }
    }
  };

  const handleDeleteRecord = (index: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (confirmed) {
      const updatedRecords = [...records];
      updatedRecords.splice(index, 1);
      setRecords(updatedRecords);
    }
    setShowActions(null);
  };

  const handleAddRecord = () => {
    if (validateFields(newRecord)) {
      setRecords((prevRecords) => [...prevRecords, newRecord]);
      setNewRecord({
        name: "",
        unit: "",
        range: "",
        result: "",
      });
      setIsDialogOpen(false);
    }
  };

  const handleNewRecordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1 className="text-blue-700">Medical Record Details</h1>

      {/* Add Record Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="m-4 ml-auto flex items-center"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Add Record
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Add New Medical Record</DialogHeader>
          <form>
            <div className="grid gap-4">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={newRecord.name}
                onChange={handleNewRecordChange}
                placeholder="Enter name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <label htmlFor="unit" className="block text-sm font-medium">
                Unit
              </label>
              <Input
                id="unit"
                name="unit"
                type="text"
                value={newRecord.unit}
                onChange={handleNewRecordChange}
                placeholder="Enter unit"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
              {errors.unit && <p className="text-red-500">{errors.unit}</p>}
              <label htmlFor="range" className="block text-sm font-medium">
                Range
              </label>
              <Input
                id="range"
                name="range"
                type="text"
                value={newRecord.range}
                onChange={handleNewRecordChange}
                placeholder="Enter range"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
              {errors.range && <p className="text-red-500">{errors.range}</p>}
              <label htmlFor="result" className="block text-sm font-medium">
                Result
              </label>
              <Input
                id="result"
                name="result"
                value={newRecord.result}
                onChange={handleNewRecordChange}
                placeholder="Enter result"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
              {errors.result && <p className="text-red-500">{errors.result}</p>}
            </div>
          </form>
          <DialogFooter className="flex justify-end">
            <Button onClick={handleAddRecord}>Add Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          {records.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.unit}</TableCell>
              <TableCell>{record.range}</TableCell>
              <TableCell>{record.result}</TableCell>
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
                      onClick={() => handleEditRecordDetail(index)}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleDeleteRecord(index)}
                    >
                      <Trash size={16} className="mr-2" />
                      Delete
                    </Button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            {/*<TableCell colSpan={5}>Showing {records.length} records</TableCell>*/}
          </TableRow>
        </TableFooter>
      </Table>

      {/* Edit Dialog */}
      <Dialog
        open={selectedRecord !== null}
        onOpenChange={(isOpen) =>
          setSelectedRecord(isOpen ? selectedRecord : null)
        }
      >
        <DialogTrigger asChild>
          <Button></Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Edit Medical Record</DialogHeader>
          <form>
            <div className="grid gap-4">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={editedRecord.name}
                onChange={handleInputChange}
                placeholder="Enter name"
              />
              <label htmlFor="unit" className="block text-sm font-medium">
                Unit
              </label>
              <Input
                id="unit"
                name="unit"
                type="text"
                value={editedRecord.unit}
                onChange={handleInputChange}
                placeholder="Enter unit"
              />
              <label htmlFor="range" className="block text-sm font-medium">
                Range
              </label>
              <Input
                id="range"
                name="range"
                type="text"
                value={editedRecord.range}
                onChange={handleInputChange}
                placeholder="Enter range"
              />
              <label htmlFor="result" className="block text-sm font-medium">
                Result
              </label>
              <Input
                id="result"
                name="result"
                type="text"
                value={editedRecord.result}
                onChange={handleInputChange}
                placeholder="Enter result"
              />
            </div>
          </form>
          <DialogFooter className="flex justify-end">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalRecords;
