"use client";

import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { ListFilter, Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

type FilterState = {
  hospitals: string[];
  specialities: string[];
  ratings: number[];
  locations: string[];
  selectedHospitals: string[];
  selectedSpecialities: string[];
  selectedRatings: number[];
  selectedLocations: string[];
};

type FilterAction =
  | {
      type: "SET_FILTER_OPTIONS";
      payload: { key: keyof FilterState; value: any[] };
    }
  | {
      type: "TOGGLE_FILTER";
      payload: { key: keyof FilterState; value: string | number };
    };

const initialFilterState: FilterState = {
  hospitals: [
    "General Hospital",
    "City Medical Center",
    "Springfield Cancer Institute",
    "Children's Hospital",
    "Regional Hospital",
    "Downtown Clinic",
    "HealthFirst Center",
    "Riverside Medical",
    "Suburban Healthcare",
    "Community Wellness",
  ],
  specialities: [
    "Cardiology",
    "Neurology",
    "Oncology",
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
  ],
  ratings: [1, 2, 3, 4, 5], // Ratings from 1 to 5
  locations: [
    "123 Heart Lane, Springfield, IL",
    "456 Brain Blvd, Springfield, IL",
    "789 Oncology Road, Springfield, IL",
    "101 Pediatric Ave, Springfield, IL",
    "202 Health St, Springfield, IL",
    "303 Medical Park, Springfield, IL",
    "404 Wellness Way, Springfield, IL",
    "505 Doctor's Rd, Springfield, IL",
    "606 Care Circle, Springfield, IL",
    "707 Healing Dr, Springfield, IL",
  ],
  selectedHospitals: [],
  selectedSpecialities: [],
  selectedRatings: [],
  selectedLocations: [],
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_FILTER_OPTIONS":
      return { ...state, [action.payload.key]: action.payload.value };
    case "TOGGLE_FILTER": {
      const key = action.payload.key;
      const currentSelected = state[key] as (string | number)[];
      const newSelected = currentSelected.includes(action.payload.value)
        ? currentSelected.filter((item) => item !== action.payload.value)
        : [...currentSelected, action.payload.value];
      return { ...state, [key]: newSelected };
    }
    default:
      return state;
  }
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
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.post("/api/doctors", {
          searchTerm: debouncedSearchTerm,
          hospitals: filterState.selectedHospitals,
          specialities: filterState.selectedSpecialities,
          ratings: filterState.selectedRatings,
          locations: filterState.selectedLocations,
        });
        setDoctors(response.data);

        // Update filter options based on response data
        dispatch({
          type: "SET_FILTER_OPTIONS",
          payload: {
            key: "hospitals",
            value: Array.from(
              new Set(response.data.map((doctor: Doctor) => doctor.hospital))
            ),
          },
        });
        dispatch({
          type: "SET_FILTER_OPTIONS",
          payload: {
            key: "specialities",
            value: Array.from(
              new Set(response.data.map((doctor: Doctor) => doctor.speciality))
            ),
          },
        });
        dispatch({
          type: "SET_FILTER_OPTIONS",
          payload: {
            key: "ratings",
            value: Array.from(
              new Set(response.data.map((doctor: Doctor) => doctor.rating))
            ),
          },
        });
        dispatch({
          type: "SET_FILTER_OPTIONS",
          payload: {
            key: "locations",
            value: Array.from(
              new Set(response.data.map((doctor: Doctor) => doctor.address))
            ),
          },
        });
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [
    debouncedSearchTerm,
    filterState.selectedHospitals,
    filterState.selectedSpecialities,
    filterState.selectedRatings,
    filterState.selectedLocations,
  ]);

  const handleFilterChange = (
    category:
      | "selectedHospitals"
      | "selectedSpecialities"
      | "selectedRatings"
      | "selectedLocations",
    value: string | number
  ) => {
    dispatch({ type: "TOGGLE_FILTER", payload: { key: category, value } });
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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filter
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="max-h-screen overflow-y-scroll">
            <SheetHeader className="flex items-center">
              <SheetTitle>Filter Doctors</SheetTitle>
            </SheetHeader>
            <div className="mt-4 text-xs sm:text-md grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Hospitals</h4>
                {filterState.hospitals.map((hospital) => (
                  <div key={hospital} className="flex items-center space-x-2">
                    <Checkbox
                      id={`hospital-${hospital}`}
                      checked={filterState.selectedHospitals.includes(hospital)}
                      onCheckedChange={() =>
                        handleFilterChange("selectedHospitals", hospital)
                      }
                    />
                    <Label htmlFor={`hospital-${hospital}`}>{hospital}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Specialities</h4>
                {filterState.specialities.map((speciality) => (
                  <div key={speciality} className="flex items-center space-x-2">
                    <Checkbox
                      id={`speciality-${speciality}`}
                      checked={filterState.selectedSpecialities.includes(
                        speciality
                      )}
                      onCheckedChange={() =>
                        handleFilterChange("selectedSpecialities", speciality)
                      }
                    />
                    <Label htmlFor={`speciality-${speciality}`}>
                      {speciality}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Ratings</h4>
                {filterState.ratings.map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={filterState.selectedRatings.includes(rating)}
                      onCheckedChange={() =>
                        handleFilterChange("selectedRatings", rating)
                      }
                    />
                    <Label htmlFor={`rating-${rating}`}>
                      {rating} Star{rating !== 1 && "s"}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Locations</h4>
                {filterState.locations.map((location) => (
                  <div key={location} className="flex items-stretch space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filterState.selectedLocations.includes(location)}
                      onCheckedChange={() =>
                        handleFilterChange("selectedLocations", location)
                      }
                    />
                    <Label htmlFor={`location-${location}`}>{location}</Label>
                  </div>
                ))}
              </div>
            </div>
            <SheetFooter className="mt-2"></SheetFooter>
          </SheetContent>
        </Sheet>
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
