import React, { useState } from "react";

export default function BookingModal({
  isOpen,
  ride,
  onClose,
  onConfirm,
}) {
  const [passengerName, setPassengerName] = useState("");

  if (!isOpen || !ride) {
    return null;
  }

  const handleClose = () => {
    setPassengerName("");
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = passengerName.trim();

    if (!name) {
      window.alert("Please enter your name.");
      return;
    }

    onConfirm({
      passengerName: name,
    });

    setPassengerName("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2
              id="booking-modal-title"
              className="text-xl font-black text-slate-900"
            >
              Book Your Ride
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Confirm your seat with {ride.driverName}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close booking form"
            className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 bg-slate-50 px-5 py-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Pickup</span>
            <span className="text-right font-semibold text-slate-800">
              {ride.pickupLocation}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Drop-off</span>
            <span className="text-right font-semibold text-indigo-700">
              {ride.gate}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Departure</span>
            <span className="font-semibold text-slate-800">
              {ride.departureTime}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Fare</span>
            <span className="font-black text-slate-900">
              ₹{ride.costPerSeat}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="passengerName"
              className="mb-1 block text-sm font-bold text-slate-700"
            >
              Your Name *
            </label>

            <input
              id="passengerName"
              type="text"
              required
              autoFocus
              value={passengerName}
              onChange={(event) =>
                setPassengerName(event.target.value)
              }
              placeholder="e.g. Arjun Kumar"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="w-1/2 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-1/2 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-md transition-colors hover:bg-indigo-700"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}