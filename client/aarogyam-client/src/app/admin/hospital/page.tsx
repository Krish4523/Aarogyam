"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  Link,
  ClipboardList,
  Phone,
  Trash2,
  PlusCircle,
  Mail,
} from "lucide-react"; // Import Lucide Icons

interface Hospital {
  id: number;
  name: string;
  location: string;
  url: string;
  services: string;
  phone: string;
  email: string;
}

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
    null
  );
  const [newHospital, setNewHospital] = useState<Hospital>({
    id: 0,
    name: "",
    location: "",
    url: "",
    services: "",
    phone: "",
    email: "",
  });
  const [warningMessage, setWarningMessage] = useState<string>("");

  useEffect(() => {
    // Simulate fetching hospital data
    const fetchHospitals = async () => {
      const data: Hospital[] = [
        {
          id: 1,
          name: "City Hospital",
          location: "Downtown",
          url: "https://cityhospital.com",
          services: "Emergency, Surgery, General Medicine",
          phone: "123-456-7890",
          email: "abc@gmail.com",
        },
        {
          id: 2,
          name: "Greenwood Clinic",
          location: "Suburb",
          url: "https://greenwoodclinic.com",
          services: "Primary Care, Pediatrics, Dermatology",
          phone: "234-567-8901",
          email: "abc@gmail.com",
        },
        {
          id: 3,
          name: "Northside Health Center",
          location: "Northside",
          url: "https://northsidehealth.com",
          services: "Orthopedics, Cardiology, Neurology",
          phone: "345-678-9012",
          email: "abc@gmail.com",
        },
      ];
      setHospitals(data);
    };

    fetchHospitals();
  }, []);

  const handleDelete = () => {
    if (selectedHospitalId !== null) {
      setHospitals((prevHospitals) =>
        prevHospitals.filter((hospital) => hospital.id !== selectedHospitalId)
      );
    }
    setShowDeleteModal(false); // Close modal after deletion
  };

  const openDeleteModal = (hospitalId: number) => {
    setSelectedHospitalId(hospitalId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewHospital({
      id: 0,
      name: "",
      location: "",
      url: "",
      services: "",
      phone: "",
      email: "",
    });
    setWarningMessage("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddHospital = () => {
    if (
      !newHospital.name ||
      !newHospital.location ||
      !newHospital.url ||
      !newHospital.services ||
      !newHospital.phone ||
      !newHospital.email
    ) {
      setWarningMessage(
        "Please fill in all fields before adding the hospital."
      );
    } else if (!validateEmail(newHospital.email)) {
      setWarningMessage("Please enter a valid email address.");
    } else {
      setHospitals((prevHospitals) => [
        ...prevHospitals,
        { ...newHospital, id: prevHospitals.length + 1 },
      ]);
      closeAddModal();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Hospital List</h1>

      {/* Add Hospital Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-300"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Hospital
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:border hover:border-blue-500"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-2">{hospital.name}</h2>
              <button
                onClick={() => openDeleteModal(hospital.id)}
                className="text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <p>{hospital.location}</p>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <Link className="w-5 h-5 mr-2 text-blue-500" />
              <a
                href={hospital.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {hospital.url}
              </a>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
              <p>{hospital.services}</p>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <Phone className="w-5 h-5 mr-2 text-blue-500" />
              <p>{hospital.phone}</p>
            </div>

            <div className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-2 text-blue-500" />
              <p>{hospital.email}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this hospital?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Hospital</h2>
            {warningMessage && (
              <div className="text-red-600 mb-4">{warningMessage}</div>
            )}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Hospital Name"
                value={newHospital.name}
                onChange={(e) =>
                  setNewHospital((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Location"
                value={newHospital.location}
                onChange={(e) =>
                  setNewHospital((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Website URL"
                value={newHospital.url}
                onChange={(e) =>
                  setNewHospital((prev) => ({ ...prev, url: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Services"
                value={newHospital.services}
                onChange={(e) =>
                  setNewHospital((prev) => ({
                    ...prev,
                    services: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newHospital.phone}
                onChange={(e) =>
                  setNewHospital((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Email"
                value={newHospital.email}
                onChange={(e) =>
                  setNewHospital((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHospital}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalsPage;
