import React, { useState } from "react";
import { supabase } from "../utils/supabase";

export default function RideCard({ ride, onBook }) {
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  const handleBook = async () => {
    if (booking || ride.seatsAvailable <= 0) {
      return;
    }

    setBooking(true);
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
      setBooking(false);
      return;
    }

    setBooking(false);

    if (onBook) {
      onBook(ride);
    }
  };

  const vehicleBadgeClass =
    ride.vehicleType === "Bike"
      ? "bg-amber-100 text-amber-800"
      : ride.vehicleType === "Car"
        ? "bg-blue-100 text-blue-800"
        : "bg-purple-100 text-purple-800";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-black text-indigo-700">
            {ride.driverName?.charAt(0)?.toUpperCase() ||
              "S"}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-bold text-slate-900">
                {ride.driverName}
              </h3>

              {ride.isVerifiedStudent && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  ✓ Verified
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-xs text-slate-500">
              {ride.vehicleName || "Vehicle details unavailable"}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${vehicleBadgeClass}`}
        >
          {ride.vehicleType}
        </span>
      </div>

      <div className="my-4 space-y-2 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">
            Pickup:
          </span>

          <span className="text-right font-semibold text-slate-800">
            {ride.pickupLocation}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">
            Drop-off Gate:
          </span>

          <span className="text-right font-bold text-indigo-700">
            {ride.gate}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">
            Departure Time:
          </span>

          <span className="text-right font-semibold text-slate-800">
            {ride.departureTime}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">
            Preferences:
          </span>

          <span className="text-right font-medium text-slate-700">
            {ride.genderPreference}
          </span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div>
          <span className="text-lg font-black text-slate-900">
            ₹{ride.costPerSeat}
          </span>

          <span className="text-xs text-slate-500">
            {" "}
            / seat
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500">
            {ride.seatsAvailable}{" "}
            {ride.seatsAvailable === 1
              ? "seat"
              : "seats"}{" "}
            left
          </span>

          <button
            type="button"
            onClick={handleBook}
            disabled={
              booking || ride.seatsAvailable <= 0
            }
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {booking
              ? "Booking..."
              : ride.seatsAvailable <= 0
                ? "Full"
                : "Book Ride"}
          </button>
        </div>
      </div>
    </div>
  );
}