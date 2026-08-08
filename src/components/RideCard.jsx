import React from "react";

export default function RideCard({ ride, onBook }) {
  const vehicleBadgeClass =
    ride.vehicleType === "Bike"
      ? "bg-amber-100 text-amber-800"
      : ride.vehicleType === "Car"
        ? "bg-blue-100 text-blue-800"
        : "bg-purple-100 text-purple-800";

  const isAvailable = ride.seatsAvailable > 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-black text-indigo-700">
            {ride.driverName?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">
                {ride.driverName}
              </h3>

              {ride.isVerifiedStudent && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  ✓ Verified
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-xs text-slate-500">
              {ride.vehicleName}
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
          <span className="text-slate-500">Pickup:</span>
          <span className="text-right font-semibold text-slate-800">
            {ride.pickupLocation}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Drop-off Gate:</span>
          <span className="text-right font-bold text-indigo-700">
            {ride.gate}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Departure:</span>
          <span className="font-semibold text-slate-800">
            {ride.departureTime}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Preference:</span>
          <span className="font-medium text-slate-700">
            {ride.genderPreference}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3">
        <div>
          <span className="text-lg font-black text-slate-900">
            ₹{ride.costPerSeat}
          </span>

          <span className="text-xs text-slate-500"> / seat</span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-medium ${
              isAvailable ? "text-slate-500" : "text-red-600"
            }`}
          >
            {isAvailable
              ? `${ride.seatsAvailable} ${
                  ride.seatsAvailable === 1 ? "seat" : "seats"
                } left`
              : "Full"}
          </span>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => onBook(ride)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isAvailable ? "Book Ride" : "Full"}
          </button>
        </div>
      </div>
    </article>
  );
}