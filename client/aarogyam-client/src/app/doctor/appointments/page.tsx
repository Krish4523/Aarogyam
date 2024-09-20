"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, User, Inbox, FileText, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // Assuming you're using this component for doctor notes

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

interface Appointment {
  id: number;
  patientName: string;
  startTime: string;
  endTime: string;
  patientNote?: string; // New field for patient note
  doctorNote?: string; // Field for doctor's note
  status?: string;
  prescription?: Prescription[];
}

const formatDateTime = (startTimeString: string, endTimeString: string) => {
  const startObj = new Date(startTimeString);
  const endObj = new Date(endTimeString);

  const day = startObj.toLocaleString("en-US", { weekday: "short" });
  const date = startObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const startTime = startObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTime = endObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return { day, date, startTime, endTime };
};

const isInFutureOrToday = (endTimeString: string) => {
  const appointmentEndDate = new Date(endTimeString);
  const today = new Date();
  return appointmentEndDate >= today;
};

export default function AppointmentsPage() {
  const [confirmedAppointments, setConfirmedAppointments] = useState<
    Appointment[]
  >([]);
  const [requestedAppointments, setRequestedAppointments] = useState<
    Appointment[]
  >([]);
  const [updatedAppointments, setUpdatedAppointments] = useState<Appointment[]>(
    []
  );
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] =
    useState<boolean>(false);
  const [isRequestedVisible, setIsRequestedVisible] = useState<boolean>(false);
  const [rescheduleData, setRescheduleData] = useState<Appointment | null>(
    null
  );
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false); // New state for details dialog
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null); // Selected appointment for details view
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] =
    useState<boolean>(false); // New state for details dialog

  const [doctorNote, setDoctorNote] = useState<string>(""); // State to store doctor's note
  const [newStartTime, setNewStartTime] = useState<string>("");
  const [newEndTime, setNewEndTime] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    name: "",
    times: [],
    dose: "",
    frequency: 0,
    source: "Doctor Prescribed",
  });
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [instructions, setInstructions] = useState<string>("");
  const [newTime, setNewTime] = useState("");

  // State to hold added medicines

  useEffect(() => {
    const confirmedData: Appointment[] = [
      {
        id: 1,
        patientName: "John Doe",
        startTime: "2024-09-17T10:00:00",
        endTime: "2024-09-17T11:00:00",
        patientNote: "Patient has a cold.",
        prescription: [],
        status: "Completed",
      },
      {
        id: 2,
        patientName: "Jane Smith",
        startTime: "2024-09-18T11:00:00",
        endTime: "2024-09-18T12:00:00",
        patientNote: "Needs advice on diet.",
        prescription: [],
        status: "pending",
      },
      {
        id: 3,
        patientName: "Sam Green",
        startTime: "2024-09-19T09:00:00",
        endTime: "2024-09-19T10:00:00",
        patientNote: "Follow-up for medication.",
        prescription: [],
        status: "pending",
      },
    ];

    const requestedData: Appointment[] = [
      {
        id: 4,
        patientName: "Mike Johnson",
        startTime: "2024-09-17T10:00:00",
        endTime: "2024-09-17T11:00:00",
        patientNote: "Regular checkup",
      },
      {
        id: 5,
        patientName: "Emily Davis",
        startTime: "2024-09-18T12:00:00",
        endTime: "2024-09-18T13:00:00",
        patientNote: "Follow-up for medication.",
      },
    ];

    // const futureConfirmed = confirmedData.filter((appointment) =>
    //   isInFutureOrToday(appointment.endTime)
    // );

    const futureRequested = requestedData.filter((appointment) =>
      isInFutureOrToday(appointment.endTime)
    );

    setConfirmedAppointments(confirmedData);
    updateRequestedAppointmentsStatus(futureRequested, confirmedData);
  }, []);

  const updateRequestedAppointmentsStatus = (
    requestedAppointments: Appointment[],
    confirmedAppointments: Appointment[]
  ) => {
    const updated = requestedAppointments.map((req) => {
      const isUnavailable = confirmedAppointments.some(
        (conf) =>
          new Date(conf.startTime).toISOString() ===
          new Date(req.startTime).toISOString()
      );
      return { ...req, status: isUnavailable ? "Unavailable" : "Available" };
    });
    setUpdatedAppointments(updated);
  };

  const handleReschedule = (appointment: Appointment) => {
    setRescheduleData(appointment);
    setIsRescheduleDialogOpen(true);
    setNewStartTime(appointment.startTime);
    setNewEndTime(appointment.endTime);
  };

  const confirmReschedule = () => {
    if (rescheduleData) {
      const formattedNewStartTime = new Date(newStartTime).toISOString();
      const formattedNewEndTime = new Date(newEndTime).toISOString();

      if (new Date(newEndTime) <= new Date(newStartTime)) {
        setErrorMessage("End time must be later than start time.");
        return;
      }
      if (new Date(newStartTime) <= new Date()) {
        setErrorMessage("Start time must be in upcoming time");
        return;
      }

      const newConfirmedAppointments = confirmedAppointments.map(
        (appointment) =>
          appointment.id === rescheduleData.id
            ? {
                ...appointment,
                startTime: formattedNewStartTime,
                endTime: formattedNewEndTime,
              }
            : appointment
      );

      setConfirmedAppointments(newConfirmedAppointments);
      updateRequestedAppointmentsStatus(
        updatedAppointments,
        newConfirmedAppointments
      );

      setIsRescheduleDialogOpen(false);
      setErrorMessage("");
    }
  };

  const handleCancel = (id: number) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      const updatedConfirmed = confirmedAppointments.filter(
        (appointment) => appointment.id !== id
      );

      setConfirmedAppointments(updatedConfirmed);
      updateRequestedAppointmentsStatus(updatedAppointments, updatedConfirmed);
    }
  };

  const handleRespond = (id: number, status: string) => {
    const appointmentToUpdate = updatedAppointments.find(
      (appointment) => appointment.id === id
    );
    if (appointmentToUpdate) {
      setUpdatedAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== id)
      );

      if (status === "Accepted") {
        setConfirmedAppointments((prevConfirmed) => [
          ...prevConfirmed,
          appointmentToUpdate,
        ]);
      }
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDoctorNote(appointment.doctorNote || "");
    setDetailsDialogOpen(true);
  };
  const handlePrescription = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setPrescriptionDialogOpen(true);
  };

  const handleSaveDoctorNote = () => {
    if (selectedAppointment) {
      const updatedConfirmed = confirmedAppointments.map((appointment) =>
        appointment.id === selectedAppointment.id
          ? { ...appointment, doctorNote }
          : appointment
      );
      setConfirmedAppointments(updatedConfirmed);
      setDetailsDialogOpen(false);
    }
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.times.length > 0 && newMedicine.dose) {
      setMedicines([...medicines, newMedicine]);
      setNewMedicine({
        name: "",
        times: [],
        dose: "",
        frequency: 0,
        source: "Doctor Prescribed",
      });
    }
  };

  const handleSavePrescription = () => {
    if (selectedAppointment) {
      const newPrescription: Prescription = {
        id: `${Date.now()}`, // Unique ID for the prescription
        patientName: selectedAppointment.patientName,
        doctorName: "Doctor Name", // Replace with actual doctor name
        medicines,
        dateIssued: new Date().toISOString(),
        instructions,
      };

      const updatedConfirmed = confirmedAppointments.map((appointment) =>
        appointment.id === selectedAppointment.id
          ? {
              ...appointment,
              prescription: [
                ...(appointment.prescription || []),
                newPrescription,
              ],
            }
          : appointment
      );
      setConfirmedAppointments(updatedConfirmed);
      setPrescriptionDialogOpen(false);
    }
  };

  const addTime = () => {
    if (newTime && !newMedicine.times.includes(newTime)) {
      setNewMedicine({
        ...newMedicine,
        times: [...newMedicine.times, newTime],
        frequency: newMedicine.times.length + 1, // Update frequency
      });
      setNewTime(""); // Clear time input after adding
    }
  };

  // Function to add the medicine to the medicines array
  const addMedicine = () => {
    if (newMedicine.name && newMedicine.times.length > 0 && newMedicine.dose) {
      setMedicines([...medicines, newMedicine]); // Add the new medicine to the array
      // Reset newMedicine and newTime
      setNewMedicine({
        name: "",
        times: [],
        dose: "",
        frequency: 0,
        source: "Doctor Prescribed",
      });
      setNewTime(""); // Clear time input
    } else {
      alert("Please fill out all fields for the medicine.");
    }
  };

  const notificationCount = updatedAppointments.length;

  return (
    <div className="relative flex h-screen">
      <div
        className={`flex-1 transition-all duration-300 ${isRequestedVisible ? "md:w-2/3" : "w-full"}`}
      >
        <h2 className="text-2xl font-bold mb-4">Your upcoming Appointments</h2>
        {confirmedAppointments.map((appointment) => {
          const { day, date, startTime, endTime } = formatDateTime(
            appointment.startTime,
            appointment.endTime
          );
          return (
            <Card key={appointment.id} className="mb-4">
              <div className="p-4">
                <div className="flex items-center">
                  <User className="mr-2" />
                  <p>{appointment.patientName}</p>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2" />
                  <p>
                    {day}, {date}
                  </p>
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="mr-2" />
                  <p>
                    {startTime} - {endTime}
                  </p>
                </div>

                <div>
                  <Badge
                    variant={
                      appointment.status === "Complete" ? "subtle" : "solid"
                    }
                    className={`mt-2 ${
                      appointment.status === "Completed"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {appointment.status}
                  </Badge>

                  {appointment.status == "Completed" && (
                    <Button
                      onClick={() => handlePrescription(appointment)}
                      className="ms-2"
                    >
                      Add prescription
                    </Button>
                  )}
                </div>

                <div className="flex justify-start space-x-2 mt-4">
                  <Button onClick={() => handleViewDetails(appointment)}>
                    View Details
                  </Button>
                  <Button onClick={() => handleReschedule(appointment)}>
                    Reschedule
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleCancel(appointment.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {isRequestedVisible && (
        <div className="w-full md:w-2/3 mt-8 rem p-4 overflow-y-auto">
          {updatedAppointments.map((appointment) => {
            const { day, date, startTime, endTime } = formatDateTime(
              appointment.startTime,
              appointment.endTime
            );
            return (
              <Card key={appointment.id} className="mb-4">
                <div className="p-4">
                  <div className="flex items-center">
                    <User className="mr-2" />
                    <p>{appointment.patientName}</p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2" />
                    <p>
                      {day}, {date}
                    </p>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="mr-2" />
                    <p>
                      {startTime} - {endTime}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "Unavailable" ? "subtle" : "solid"
                    }
                    className={`mt-2 ${
                      appointment.status === "Unavailable"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {appointment.status}
                  </Badge>

                  {appointment.status === "Available" && (
                    <div className="flex justify-start space-x-2 mt-4">
                      <Button onClick={() => handleViewDetails(appointment)}>
                        View Details
                      </Button>
                      <Button
                        variant="default"
                        onClick={() =>
                          handleRespond(appointment.id, "Accepted")
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleRespond(appointment.id, "Declined")
                        }
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                  {appointment.status === "Unavailable" && (
                    <div className="flex justify-start space-x-2 mt-4">
                      <Button onClick={() => handleViewDetails(appointment)}>
                        View Details
                      </Button>
                      <Button
                        disabled={true}
                        variant="default"
                        onClick={() =>
                          handleRespond(appointment.id, "Accepted")
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleRespond(appointment.id, "Declined")
                        }
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="absolute top-1 right-1 block ">
        <Button
          className="flex items-center justify-center mb-3"
          onClick={() => setIsRequestedVisible(!isRequestedVisible)}
        >
          <Inbox />
          {/*{isRequestedVisible ? "Hide" : "Show"} Requested Appointments*/}
          {notificationCount > 0 && (
            <span className="ml-2 text-red-500">({notificationCount})</span>
          )}
        </Button>
      </div>

      <Dialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
      >
        <DialogContent>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          {rescheduleData && (
            <>
              <div className="mt-4">
                <label>New Start Time:</label>
                <Input
                  type="datetime-local"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full mt-2"
                  min={new Date().toISOString().slice(0, 16)} // Set minimum value to current date-time
                />
              </div>
              <div className="mt-4">
                <label>New End Time:</label>
                <Input
                  type="datetime-local"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full mt-2"
                  min={new Date().toISOString().slice(0, 16)} // Set minimum value to current date-time
                />
              </div>
              {errorMessage && (
                <p className="text-red-600 mt-2">{errorMessage}</p>
              )}
              <div className="mt-4 flex justify-end">
                <Button onClick={confirmReschedule}>Confirm</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for viewing appointment details */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogTitle>
            <FileText className="inline-block mr-2" /> Appointment Details
          </DialogTitle>

          {selectedAppointment && (
            <div>
              <div className="mb-4">
                <p>
                  <User className="inline-block mr-2" />
                  {selectedAppointment.patientName}
                </p>
                <p>
                  <Calendar className="inline-block mr-2" />
                  {
                    formatDateTime(
                      selectedAppointment.startTime,
                      selectedAppointment.endTime
                    ).day
                  }
                  {
                    formatDateTime(
                      selectedAppointment.startTime,
                      selectedAppointment.endTime
                    ).date
                  }
                </p>

                <p>
                  <Clock className="inline-block mr-2" />
                  {
                    formatDateTime(
                      selectedAppointment.startTime,
                      selectedAppointment.endTime
                    ).startTime
                  }{" "}
                  -{" "}
                  {
                    formatDateTime(
                      selectedAppointment.startTime,
                      selectedAppointment.endTime
                    ).endTime
                  }
                </p>
                <p>
                  <FileText className="inline-block mr-2" />
                  {selectedAppointment.patientNote || "No note provided"}
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="doctor-note">Your Notes:</label>
                <Textarea
                  id="doctor-note"
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                  placeholder="Add a note for this appointment..."
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveDoctorNote}>
                  <Save className="inline-block mr-2" /> Save Note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={prescriptionDialogOpen}
        onOpenChange={setPrescriptionDialogOpen}
      >
        <DialogContent>
          <DialogTitle>
            <FileText className="inline-block mr-2" /> Add Prescription
          </DialogTitle>
          <div>
            {/* Instructions Section */}

            {/* Medicine Section */}
            <div className="my-4">
              {/* Medicine Name */}
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

              {/* Times Section */}
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

              {/* Dose Section */}
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

              <Button
                className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
                onClick={addMedicine}
              >
                Add Medicine
              </Button>
            </div>

            {/* Added Medicines Section */}
            {medicines.length > 0 && (
              <div className="my-4">
                <Label>Added Medicines</Label>
                <ul>
                  {medicines.map((medicine, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {medicine.name} - {medicine.dose} - {medicine.frequency}{" "}
                        times a day
                      </span>
                      <Button
                        onClick={() => {
                          const updatedMedicines = medicines.filter(
                            (med, medIndex) => medIndex !== index
                          );
                          setMedicines(updatedMedicines);
                        }}
                        className="bg-red-600 text-white hover:bg-red-700 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Label>Instructions</Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Add instructions for the prescription"
            />

            <Button
              className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSavePrescription}
            >
              Save Prescription
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
