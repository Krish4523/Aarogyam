"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit2, X } from "lucide-react"; // Import Trash, Edit, and X icons from Lucide

interface Medicine {
  name: string;
  times: string[]; // stores times in 'HH:mm' format
  dose: string;
  frequency: number; // frequency is equal to the length of times array
  source: "Doctor Prescribed" | "Your added"; // Two possible values
}
interface Prescription {
  id: string; // Unique identifier for the prescription
  patientName: string; // Name of the patient
  doctorName: string; // Name of the doctor who prescribed the medicine
  medicines: Medicine[]; // List of medicines in the prescription
  dateIssued: string; // Date when the prescription was issued
  instructions: string; // Additional instructions for taking the medicines
}

export default function Medications() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      name: "Aspirin",
      times: ["08:00", "20:00"],
      dose: "2 tablets",
      frequency: 2,
      source: "Doctor Prescribed",
    },
    {
      name: "Vitamin D",
      times: ["10:00"],
      dose: "1 capsule",
      frequency: 1,
      source: "Your added",
    },
  ]);

  const dummyPrescriptions: Prescription[] = [
    {
      id: "pres1",
      patientName: "John Doe",
      doctorName: "Dr. Smith",
      medicines: [
        {
          name: "Aspirin",
          times: ["08:00", "20:00"],
          dose: "2 tablets",
          frequency: 2,
          source: "Doctor Prescribed",
        },
        {
          name: "Vitamin D",
          times: ["10:00"],
          dose: "1 capsule",
          frequency: 1,
          source: "Doctor Prescribed",
        },
      ],
      dateIssued: "2024-09-10",
      instructions: "Take with food. Do not exceed the recommended dosage.",
    },
    {
      id: "pres2",
      patientName: "Jane Roe",
      doctorName: "Dr. Johnson",
      medicines: [
        {
          name: "Ibuprofen",
          times: ["09:00", "21:00"],
          dose: "1 tablet",
          frequency: 2,
          source: "Doctor Prescribed",
        },
        {
          name: "Calcium",
          times: ["08:00"],
          dose: "1 tablet",
          frequency: 1,
          source: "Doctor Prescribed",
        },
      ],
      dateIssued: "2024-09-15",
      instructions: "Take after meals. Avoid alcohol while on this medication.",
    },
  ];

  const [newMedicine, setNewMedicine] = useState<Medicine>({
    name: "",
    times: [],
    dose: "",
    frequency: 0,
    source: "Doctor Prescribed",
  });

  const [newTime, setNewTime] = useState(""); // stores individual time input
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMedicineIndex, setSelectedMedicineIndex] = useState<
    number | null
  >(null);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [showEditModal, setShowEditModal] = useState(false); // Modal for editing medicines
  const [prescriptionModal, setPrescriptionModal] = useState(false); // Modal for editing medicines
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(dummyPrescriptions);

  const [editMedicine, setEditMedicine] = useState<Medicine | null>(null); // Store the medicine being edited
  const [error, setError] = useState<string>(""); // For displaying error messages

  const validateMedicine = (medicine: Medicine) => {
    if (!medicine.name || !medicine.dose || medicine.times.length === 0) {
      setError("All fields are required. Please fill out all fields.");
      return false;
    }
    return true;
  };

  const addMedicine = () => {
    if (validateMedicine(newMedicine)) {
      setMedicines([
        ...medicines,
        { ...newMedicine, frequency: newMedicine.times.length }, // Automatically set frequency based on times length
      ]);
      setNewMedicine({
        name: "",
        times: [],
        dose: "",
        frequency: 0,
        source: "Doctor Prescribed",
      });
      setNewTime(""); // clear time input
      setShowModal(false);
      setError(""); // Clear error message
    }
  };

  const addTime = () => {
    if (newTime) {
      setNewMedicine({
        ...newMedicine,
        times: [...newMedicine.times, newTime],
        frequency: newMedicine.times.length + 1, // Update frequency as times array grows
      });
      setNewTime("");
    }
  };

  const removeTime = (time: string) => {
    if (editMedicine) {
      setEditMedicine({
        ...editMedicine,
        times: editMedicine.times.filter((t) => t !== time),
        frequency: editMedicine.times.length - 1,
      });
    }
  };

  const confirmDeleteMedicine = (index: number) => {
    setSelectedMedicineIndex(index);
    setShowConfirmModal(true);
  };

  const deleteMedicine = () => {
    if (selectedMedicineIndex !== null) {
      setMedicines(medicines.filter((_, i) => i !== selectedMedicineIndex));
      setSelectedMedicineIndex(null);
      setShowConfirmModal(false);
    }
  };

  const handleEditMedicine = (index: number) => {
    setEditMedicine({ ...medicines[index] }); // Set the selected medicine for editing
    setSelectedMedicineIndex(index); // Track the index for updating later
    setShowEditModal(true); // Show the modal for editing
  };

  const saveEditedMedicine = () => {
    if (
      selectedMedicineIndex !== null &&
      editMedicine &&
      validateMedicine(editMedicine)
    ) {
      const updatedMedicines = [...medicines];
      updatedMedicines[selectedMedicineIndex] = {
        ...editMedicine,
        frequency: editMedicine.times.length,
      };
      setMedicines(updatedMedicines); // Update the medicines list with edited medicine
      setShowEditModal(false); // Close the modal
      setEditMedicine(null); // Clear the edit state
      setError(""); // Clear error message
    }
  };

  const addEditTime = () => {
    if (newTime && editMedicine) {
      setEditMedicine({
        ...editMedicine,
        times: [...editMedicine.times, newTime],
        frequency: editMedicine.times.length + 1,
      });
      setNewTime(""); // Clear the time input
    }
  };

  const removeEditTime = (time: string) => {
    if (editMedicine) {
      setEditMedicine({
        ...editMedicine,
        times: editMedicine.times.filter((t) => t !== time),
        frequency: editMedicine.times.length - 1,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Medicines</h1>
      </div>
      <div className="flex justify-end gap-4 mb-3">
        <Button
          onClick={() => setPrescriptionModal(true)}
          className="flex items-center"
        >
          Prescriptions
        </Button>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center"
        >
          Add Medicine
        </Button>
      </div>

      {/* List of Medicines */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {medicines.map((med, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow relative"
          >
            <div className="font-semibold text-xl text-gray-800">
              {med.name}
            </div>
            <div className="text-gray-600">
              {med.dose} at{" "}
              <span className="italic">{med.times.join(", ")}</span>
            </div>
            <div className="text-gray-600">
              Frequency: {med.frequency} times/day
            </div>
            <div className="text-gray-600">Source: {med.source}</div>

            {/* Container for Edit and Delete buttons */}
            <div className="absolute top-2 right-2 flex space-x-2">
              {/* Edit button when source is 'Your added' */}
              {med.source === "Your added" && (
                <Button
                  variant="secondary"
                  onClick={() => handleEditMedicine(index)}
                  className="bg-transparent hover:bg-blue-100 transition p-2"
                >
                  <Edit2 className="w-5 h-5 text-blue-600" />
                </Button>
              )}

              {/* Delete button with Trash Icon */}
              <Button
                variant="destructive"
                onClick={() => confirmDeleteMedicine(index)}
                className="bg-transparent hover:bg-red-100 transition p-2"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup for Adding Medicine */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Background */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal Content */}
          <div className="bg-white p-8 rounded-lg shadow-lg z-10 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Add New Medicine
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
            {/* Display error message */}
            <div className="mb-5">
              <Label
                htmlFor="name"
                className="block mb-2 font-medium text-gray-700"
              >
                Medicine Name
              </Label>
              <Input
                id="name"
                placeholder="Enter medicine name"
                value={newMedicine.name}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-5">
              <Label
                htmlFor="times"
                className="block mb-2 font-medium text-gray-700"
              >
                Times
              </Label>
              <div className="flex gap-2">
                <Input
                  type="time"
                  id="times"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Button
                  onClick={addTime}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Time
                </Button>
              </div>
              <div className="mt-3">
                <Label className="block mb-1 font-medium text-gray-700">
                  Selected Times:
                </Label>
                {newMedicine.times.map((time, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between mb-1"
                  >
                    <span>{time}</span>
                    <Button
                      onClick={() =>
                        setNewMedicine({
                          ...newMedicine,
                          times: newMedicine.times.filter((t) => t !== time),
                          frequency: newMedicine.times.length - 1,
                        })
                      }
                      className="bg-red-600 text-white hover:bg-red-700 p-1 rounded"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <Label
                htmlFor="dose"
                className="block mb-2 font-medium text-gray-700"
              >
                Dose
              </Label>
              <Input
                id="dose"
                placeholder="Enter dose"
                value={newMedicine.dose}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, dose: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-5">
              <Label
                htmlFor="source"
                className="block mb-2 font-medium text-gray-700"
              >
                Source
              </Label>
              <select
                id="source"
                value={newMedicine.source}
                onChange={(e) =>
                  setNewMedicine({
                    ...newMedicine,
                    source: e.target.value as
                      | "Doctor Prescribed"
                      | "Your added",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Doctor Prescribed">Doctor Prescribed</option>
                <option value="Your added">Your added</option>
              </select>
            </div>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                  setNewMedicine({
                    name: "",
                    times: [],
                    dose: "",
                    frequency: 0,
                    source: "Doctor Prescribed",
                  });
                  setNewTime(""); // Clear time input
                }}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={addMedicine}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Add Medicine
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Container */}
      {prescriptionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 p-4">
          {/* Modal Container */}
          <div className="relative bg-white shadow-lg rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto p-4">
            {/* Close Button */}
            <button
              onClick={() => setPrescriptionModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prescription Summary Cards */}
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="w-full mb-4">
                <div
                  className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() =>
                    setSelectedPrescription(
                      selectedPrescription?.id === prescription.id
                        ? null
                        : prescription
                    )
                  }
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {prescription.doctorName}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Date Issued:</strong> {prescription.dateIssued}
                  </p>
                </div>

                {/* Show Details if this Prescription is Selected */}
                {selectedPrescription?.id === prescription.id && (
                  <div className="bg-white shadow-md rounded-lg p-4 mt-2">
                    <p className="text-gray-600 mb-2">
                      <strong>Doctor:</strong> {selectedPrescription.doctorName}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Date Issued:</strong>{" "}
                      {selectedPrescription.dateIssued}
                    </p>
                    <h4 className="text-lg font-medium mt-2 mb-1">
                      Medicines:
                    </h4>
                    {selectedPrescription.medicines.map((medicine, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 p-3 rounded-lg mb-2 shadow-sm"
                      >
                        <p className="font-semibold">
                          <strong>Name:</strong> {medicine.name}
                        </p>
                        <p>
                          <strong>Times:</strong> {medicine.times.join(", ")}
                        </p>
                        <p>
                          <strong>Dose:</strong> {medicine.dose}
                        </p>
                        <p>
                          <strong>Frequency:</strong> {medicine.frequency} times
                          a day
                        </p>
                        <p>
                          <strong>Source:</strong> {medicine.source}
                        </p>
                      </div>
                    ))}
                    <p className="text-gray-800 mt-2">
                      <strong>Instructions:</strong>{" "}
                      {selectedPrescription.instructions}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Popup for Editing Medicine */}
      {showEditModal && editMedicine && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Background */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal Content */}
          <div className="bg-white p-8 rounded-lg shadow-lg z-10 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Edit Medicine
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
            {/* Display error message */}
            <div className="mb-5">
              <Label
                htmlFor="name"
                className="block mb-2 font-medium text-gray-700"
              >
                Medicine Name
              </Label>
              <Input
                id="name"
                placeholder="Enter medicine name"
                value={editMedicine.name}
                onChange={(e) =>
                  setEditMedicine({ ...editMedicine, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-5">
              <Label
                htmlFor="times"
                className="block mb-2 font-medium text-gray-700"
              >
                Times
              </Label>
              <div className="flex gap-2">
                <Input
                  type="time"
                  id="times"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Button
                  onClick={addEditTime}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Time
                </Button>
              </div>
              <div className="mt-3">
                <Label className="block mb-1 font-medium text-gray-700">
                  Selected Times:
                </Label>
                {editMedicine.times.map((time, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between mb-1"
                  >
                    <span>{time}</span>
                    <Button
                      onClick={() => removeEditTime(time)}
                      className="bg-red-600 text-white hover:bg-red-700 p-1 rounded"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <Label
                htmlFor="dose"
                className="block mb-2 font-medium text-gray-700"
              >
                Dose
              </Label>
              <Input
                id="dose"
                placeholder="Enter dose"
                value={editMedicine.dose}
                onChange={(e) =>
                  setEditMedicine({ ...editMedicine, dose: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-5">
              <Label
                htmlFor="source"
                className="block mb-2 font-medium text-gray-700"
              >
                Source
              </Label>
              <select
                id="source"
                value={editMedicine.source}
                onChange={(e) =>
                  setEditMedicine({
                    ...editMedicine,
                    source: e.target.value as
                      | "Doctor Prescribed"
                      | "Your added",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Doctor Prescribed">Doctor Prescribed</option>
                <option value="Your added">Your added</option>
              </select>
            </div>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditMedicine(null); // Clear the edit state
                }}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={saveEditedMedicine}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Medicine */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Background */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal Content */}
          <div className="bg-white p-8 rounded-lg shadow-lg z-10 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this medicine?
            </p>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={deleteMedicine}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
