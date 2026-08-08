import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import RideCard from "../components/RideCard";
import PostRideModal from "../components/PostRideModal";
import { supabase } from "../utils/supabase";

function mapRide(row) {
  return {
    id: row.id,
    driverId: row.driver_id,
    driverName: row.driver_name,
    college: row.college,
    gate: row.gate,
    vehicleType: row.vehicle_type,
    vehicleName: row.vehicle_name,
    departureTime: row.departure_time,
    pickupLocation: row.pickup_location,
    seatsAvailable: row.seats_available,
    totalSeats: row.total_seats,
    costPerSeat: Number(row.cost_per_seat),
    genderPreference: row.gender_preference,
    status: row.status,
    createdAt: row.created_at,
  };
}

export default function Home() {
  const router = useRouter();

  const [rides, setRides] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(
    "MLR Institute of Technology"
  );
  const [filterVehicle, setFilterVehicle] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSessionAndRides = async () => {
      setLoading(true);
      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (sessionError) {
        setError("Unable to check your account.");
        setLoading(false);
        return;
      }

      if (!session) {
        router.replace("/auth/login");
        return;
      }

      setUser(session.user);

      const { data, error: ridesError } = await supabase
        .from("rides")
        .select("*")
        .in("status", ["active", "full"])
        .order("created_at", {
          ascending: false,
        });

      if (!mounted) {
        return;
      }

      if (ridesError) {
        setError(
          ridesError.message ||
            "Unable to load available rides."
        );
        setLoading(false);
        return;
      }

      setRides((data || []).map(mapRide));
      setLoading(false);
    };

    loadSessionAndRides();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) {
          return;
        }

        if (event === "SIGNED_OUT" || !session) {
          router.replace("/auth/login");
          return;
        }

        setUser(session.user);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleAddRide = (newRide) => {
    setRides((currentRides) => [
      mapRide(newRide),
      ...currentRides,
    ]);
  };

  const handleBookRide = async (ride) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setError("");

    const { error: bookingError } = await supabase.rpc(
      "book_ride",
      {
        p_ride_id: ride.id,
      }
    );

    if (bookingError) {
      setError(
        bookingError.message ||
          "Unable to book this ride."
      );
      return;
    }

    setRides((currentRides) =>
      currentRides
        .map((currentRide) => {
          if (currentRide.id !== ride.id) {
            return currentRide;
          }

          const seatsAvailable =
            currentRide.seatsAvailable - 1;

          return {
            ...currentRide,
            seatsAvailable,
            status:
              seatsAvailable === 0
                ? "full"
                : "active",
          };
        })
        .filter(
          (currentRide) =>
            currentRide.status === "active" ||
            currentRide.status === "full"
        )
    );

    alert("Ride booked successfully!");
  };

  const filteredRides = rides.filter((ride) => {
    const matchesCollege =
      ride.college === selectedCollege;

    const matchesVehicle =
      filterVehicle === "All" ||
      ride.vehicleType === filterVehicle;

    const query = searchQuery.trim().toLowerCase();

    const matchesLocation =
      !query ||
      ride.pickupLocation
        .toLowerCase()
        .includes(query) ||
      ride.gate.toLowerCase().includes(query);

    return (
      matchesCollege &&
      matchesVehicle &&
      matchesLocation
    );
  });

  if (loading) {
    return (
      <>
        <Navbar
          onOpenPostModal={() => setIsModalOpen(true)}
        />

        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-sm font-medium text-slate-500">
            Loading available rides...
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onOpenPostModal={() => setIsModalOpen(true)}
      />

      <section className="bg-indigo-900 px-4 py-12 text-white shadow-inner">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Direct Rides Right to Your Campus Gate
          </h1>

          <p className="mx-auto max-w-xl text-sm text-indigo-200 md:text-base">
            Skip congested transfers. Find peer students
            heading directly to your college gate in
            bikes, cars, or shared autos.
          </p>

          <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 rounded-2xl bg-white p-4 text-slate-800 shadow-xl md:grid-cols-3">
            <div>
              <label className="mb-1 block text-left text-xs font-bold text-slate-500">
                YOUR COLLEGE
              </label>

              <select
                value={selectedCollege}
                onChange={(event) =>
                  setSelectedCollege(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <label className="mb-1 block text-left text-xs font-bold text-slate-500">
                PICKUP POINT / GATE
              </label>

              <input
                type="text"
                placeholder="e.g. Gandi Maisamma, Gate 2"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-left text-xs font-bold text-slate-500">
                VEHICLE TYPE
              </label>

              <select
                value={filterVehicle}
                onChange={(event) =>
                  setFilterVehicle(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
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

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {filteredRides.length} Active Rides
          </span>
        </div>

        {filteredRides.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
            No rides match your filter. Be the first to
            post a ride!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onBook={handleBookRide}
              />
            ))}
          </div>
        )}
      </main>

      <PostRideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddRide={handleAddRide}
      />
    </div>
  );
}