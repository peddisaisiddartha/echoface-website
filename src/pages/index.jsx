import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import RideCard from "../components/RideCard";
import PostRideModal from "../components/PostRideModal";
import BookingModal from "../components/BookingModal";
import { INITIAL_RIDES } from "../utils/mockData";

const RIDES_STORAGE_KEY = "echoface_rides";
const BOOKINGS_STORAGE_KEY = "echoface_bookings";

export default function Home() {
  const [rides, setRides] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(
    "MLR Institute of Technology"
  );
  const [filterVehicle, setFilterVehicle] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] =
    useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] =
    useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedRides = window.localStorage.getItem(
        RIDES_STORAGE_KEY
      );

      if (storedRides) {
        const parsedRides = JSON.parse(storedRides);

        setRides(
          Array.isArray(parsedRides)
            ? parsedRides
            : INITIAL_RIDES
        );
      } else {
        setRides(INITIAL_RIDES);
      }
    } catch {
      setRides(INITIAL_RIDES);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      RIDES_STORAGE_KEY,
      JSON.stringify(rides)
    );
  }, [rides, isLoaded]);

  const handleAddRide = (newRide) => {
    setRides((currentRides) => [
      newRide,
      ...currentRides,
    ]);
  };

  const handleOpenBooking = (ride) => {
    if (ride.seatsAvailable <= 0) {
      window.alert("This ride is already full.");
      return;
    }

    setSelectedRide(ride);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = ({
    passengerName,
  }) => {
    if (!selectedRide) {
      return;
    }

    const currentRides = rides;

    const ride = currentRides.find(
      (item) => item.id === selectedRide.id
    );

    if (!ride || ride.seatsAvailable <= 0) {
      window.alert(
        "Sorry, this ride is no longer available."
      );
      setIsBookingModalOpen(false);
      setSelectedRide(null);
      return;
    }

    const booking = {
      id: `booking-${Date.now()}`,
      rideId: ride.id,
      passengerName,
      driverName: ride.driverName,
      pickupLocation: ride.pickupLocation,
      gate: ride.gate,
      departureTime: ride.departureTime,
      costPerSeat: ride.costPerSeat,
      bookedAt: new Date().toISOString(),
    };

    const updatedRides = currentRides.map(
      (currentRide) =>
        currentRide.id === ride.id
          ? {
              ...currentRide,
              seatsAvailable:
                currentRide.seatsAvailable - 1,
            }
          : currentRide
    );

    try {
      window.localStorage.setItem(
        RIDES_STORAGE_KEY,
        JSON.stringify(updatedRides)
      );

      const storedBookings =
        window.localStorage.getItem(
          BOOKINGS_STORAGE_KEY
        );

      const existingBookings = storedBookings
        ? JSON.parse(storedBookings)
        : [];

      const bookings = Array.isArray(existingBookings)
        ? existingBookings
        : [];

      window.localStorage.setItem(
        BOOKINGS_STORAGE_KEY,
        JSON.stringify([booking, ...bookings])
      );

      setRides(updatedRides);
      setIsBookingModalOpen(false);
      setSelectedRide(null);

      window.alert(
        `Booking confirmed for ${passengerName}.`
      );
    } catch {
      window.alert(
        "Unable to save your booking. Please try again."
      );
    }
  };

  const filteredRides = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rides.filter((ride) => {
      const matchesCollege =
        !selectedCollege ||
        ride.college === selectedCollege;

      const matchesVehicle =
        filterVehicle === "All" ||
        ride.vehicleType === filterVehicle;

      const matchesLocation =
        !query ||
        ride.pickupLocation
          .toLowerCase()
          .includes(query) ||
        ride.gate.toLowerCase().includes(query) ||
        ride.college.toLowerCase().includes(query);

      return (
        matchesCollege &&
        matchesVehicle &&
        matchesLocation
      );
    });
  }, [
    rides,
    selectedCollege,
    filterVehicle,
    searchQuery,
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onOpenPostModal={() =>
          setIsPostModalOpen(true)
        }
      />

      <section className="bg-indigo-900 px-4 py-12 text-white shadow-inner">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            EchoFace Campus Mobility
          </p>

          <h1 className="text-3xl font-extrabold md:text-4xl">
            Direct Rides Right to Your Campus Gate
          </h1>

          <p className="mx-auto max-w-xl text-sm text-indigo-200 md:text-base">
            Skip congested transfers. Find fellow students
            heading directly to your college gate by bike,
            car, or shared auto.
          </p>

          <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 rounded-2xl bg-white p-4 text-slate-800 shadow-xl md:grid-cols-3">
            <div>
              <label
                htmlFor="college"
                className="mb-1 block text-left text-xs font-bold text-slate-500"
              >
                YOUR COLLEGE
              </label>

              <select
                id="college"
                value={selectedCollege}
                onChange={(event) =>
                  setSelectedCollege(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>
                  MLR Institute of Technology
                </option>
                <option>IARE Dundigal</option>
                <option>BVRIT Narsapur</option>
                <option>Malla Reddy University</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="search"
                className="mb-1 block text-left text-xs font-bold text-slate-500"
              >
                PICKUP POINT / GATE
              </label>

              <input
                id="search"
                type="search"
                placeholder="e.g. Gandi Maisamma, Gate 2"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="vehicle"
                className="mb-1 block text-left text-xs font-bold text-slate-500"
              >
                VEHICLE TYPE
              </label>

              <select
                id="vehicle"
                value={filterVehicle}
                onChange={(event) =>
                  setFilterVehicle(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="All">
                  All Modes (Bike, Car, Auto)
                </option>
                <option value="Bike">Bike Pool</option>
                <option value="Car">Car Pool</option>
                <option value="Auto Split">
                  Shared Auto
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Available Commutes
            </h2>

            <p className="text-xs text-slate-500">
              Showing rides targeting{" "}
              <span className="font-semibold text-indigo-700">
                {selectedCollege}
              </span>
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {filteredRides.length} Active{" "}
            {filteredRides.length === 1
              ? "Ride"
              : "Rides"}
          </span>
        </div>

        {!isLoaded ? (
          <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
            Loading rides...
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
            <p>No rides match your filter.</p>

            <button
              type="button"
              onClick={() =>
                setIsPostModalOpen(true)
              }
              className="mt-3 font-bold text-indigo-600 hover:text-indigo-800"
            >
              Be the first to post a ride →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onBook={handleOpenBooking}
              />
            ))}
          </div>
        )}
      </main>

      <PostRideModal
        isOpen={isPostModalOpen}
        onClose={() =>
          setIsPostModalOpen(false)
        }
        onAddRide={handleAddRide}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        ride={selectedRide}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedRide(null);
        }}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}