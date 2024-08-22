"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ListFilter, Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DoctorCard from "@/components/DoctorCard";

interface Doctor {
  name: string;
  degree: string;
  imageUrl: string;
  speciality: string;
  hospital: string;
  address: string;
  rating: number;
}

function AppointmentsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      name: "Dr. Emily Carter",
      degree: "MD",
      imageUrl: "https://example.com/images/emily-carter.jpg",
      speciality: "Cardiology",
      hospital: "General Hospital",
      address: "123 Heart Lane, Springfield, IL",
      rating: 5,
    },
    {
      name: "Dr. John Doe",
      degree: "DO",
      imageUrl: "https://example.com/images/john-doe.jpg",
      speciality: "Neurology",
      hospital: "City Medical Center",
      address: "456 Brain Blvd, Springfield, IL",
      rating: 4,
    },
    {
      name: "Dr. Sarah Johnson",
      degree: "PhD",
      imageUrl: "https://example.com/images/sarah-johnson.jpg",
      speciality: "Oncology",
      hospital: "Springfield Cancer Institute",
      address: "789 Oncology Road, Springfield, IL",
      rating: 4,
    },
    {
      name: "Dr. Mark Taylor",
      degree: "MD",
      imageUrl: "https://example.com/images/mark-taylor.jpg",
      speciality: "Pediatrics",
      hospital: "Children's Hospital",
      address: "101 Pediatric Ave, Springfield, IL",
      rating: 3,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // 300ms debounce
  const [filters, setFilters] = useState({
    name: false,
    hospital: true, // Initially checked as per your example
    speciality: false,
    rating: false,
    location: false,
  });

  useEffect(() => {
    // Function to fetch doctors
    const fetchDoctors = async () => {
      try {
        const response = await axios.post("/api/doctors", {
          searchTerm: debouncedSearchTerm,
          filters: Object.keys(filters).filter(
            (key) => filters[key as keyof typeof filters]
          ),
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [debouncedSearchTerm, filters]);

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  return (
    <div className="my-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg bg-background pl-8"
          />
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(filters).map((filterName) => (
                <DropdownMenuCheckboxItem
                  key={filterName}
                  checked={filters[filterName as keyof typeof filters]}
                  onCheckedChange={() =>
                    handleFilterChange(filterName as keyof typeof filters)
                  }
                >
                  {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <h5>Doctors</h5>
        {doctors.length ? (
          doctors.map((doctor) => <DoctorCard key={doctor.name} {...doctor} />)
        ) : (
          <p>No doctors found</p>
        )}
      </div>
    </div>
  );
}

export default AppointmentsPage;
