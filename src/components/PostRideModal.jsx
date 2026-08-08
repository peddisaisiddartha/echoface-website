import React, { useState } from "react";

const INITIAL_FORM = {
  driverName: "",
  college: "MLR Institute of Technology",
  gate: "Gate 1 (Main Campus)",
  vehicleType: "Bike",
  vehicleName: "",
  departureTime: "",
  pickupLocation: "",
  seatsAvailable: 1,
  costPerSeat: "",
  genderPreference: "Any",
};

export default function PostRideModal({
  isOpen,
  onClose,
  onAddRide,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  if (!isOpen) {
    return null;
  }

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM);
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.driverName.trim() ||
      !formData.pickupLocation.trim() ||
      !formData.costPerSeat
    ) {
      window.alert("Please fill in all required fields.");
      return;
    }

    const cost = Number(formData.costPerSeat);
    const seats = Number(formData.seatsAvailable);

    if (!Number.isFinite(cost) || cost < 0) {
      window.alert("Please enter a valid fare.");
      return;
    }

    if (!Number.isInteger(seats) || seats < 1 || seats > 6) {
      window.alert("Seats must be between 1 and 6.");
      return;
    }

    const newRide = {
      ...formData,
      id: `ride-${Date.now()}`,
      driverName: formData.driverName.trim(),
      pickupLocation: formData.pickupLocation.trim(),
      vehicleName: formData.vehicleName.trim(),
      costPerSeat: cost,
      seatsAvailable: seats,
      isVerifiedStudent: true,
    };

    onAddRide(newRide);
    setFormData(INITIAL_FORM);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-ride-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2
              id="post-ride-title"
              className="text-xl font-black text-slate-900"
            >
              Post a Campus Ride
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Share your empty seats with fellow students.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close post ride form"
            className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5 text-xs">
          <div>
            <label
              htmlFor="driverName"
              className="mb-1 block font-bold text-slate-700"
            >
              Your Name *
            </label>

            <input
              id="driverName"
              type="text"
              required
              value={formData.driverName}
              onChange={(event) =>
                updateField("driverName", event.target.value)
              }
              placeholder="e.g. Rahul Sharma"
              className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="vehicleType"
                className="mb-1 block font-bold text-slate-700"
              >
                Vehicle Type
              </label>

              <select
                id="vehicleType"
                value={formData.vehicleType}
                onChange={(event) =>
                  updateField("vehicleType", event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Auto Split">Auto Split</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="vehicleName"
                className="mb-1 block font-bold text-slate-700"
              >
                Vehicle Name / No.
              </label>

              <input
                id="vehicleName"
                type="text"
                value={formData.vehicleName}
                onChange={(event) =>
                  updateField("vehicleName", event.target.value)
                }
                placeholder="e.g. Pulsar 150"
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pickupLocation"
                className="mb-1 block font-bold text-slate-700"
              >
                Pickup Location *
              </label>

              <input
                id="pickupLocation"
                type="text"
                required
                value={formData.pickupLocation}
                onChange={(event) =>
                  updateField("pickupLocation", event.target.value)
                }
                placeholder="e.g. Gandi Maisamma"
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="gate"
                className="mb-1 block font-bold text-slate-700"
              >
                Drop-off Gate
              </label>

              <input
                id="gate"
                type="text"
                value={formData.gate}
                onChange={(event) =>
                  updateField("gate", event.target.value)
                }
                placeholder="e.g. Gate 2"
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label
                htmlFor="departureTime"
                className="mb-1 block font-bold text-slate-700"
              >
                Departure Time
              </label>

              <input
                id="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={(event) =>
                  updateField("departureTime", event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="costPerSeat"
                className="mb-1 block font-bold text-slate-700"
              >
                Fare (₹) *
              </label>

              <input
                id="costPerSeat"
                type="number"
                required
                min="0"
                step="1"
                value={formData.costPerSeat}
                onChange={(event) =>
                  updateField("costPerSeat", event.target.value)
                }
                placeholder="e.g. 30"
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="seatsAvailable"
                className="mb-1 block font-bold text-slate-700"
              >
                Seats
              </label>

              <input
                id="seatsAvailable"
                type="number"
                min="1"
                max="6"
                value={formData.seatsAvailable}
                onChange={(event) =>
                  updateField(
                    "seatsAvailable",
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="genderPreference"
              className="mb-1 block font-bold text-slate-700"
            >
              Gender Preference
            </label>

            <select
              id="genderPreference"
              value={formData.genderPreference}
              onChange={(event) =>
                updateField("genderPreference", event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Any">Any Student</option>
              <option value="Female Only">
                Female Students Only
              </option>
              <option value="Male Only">
                Male Students Only
              </option>
            </select>
          </div>

          <div className="flex gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="w-1/2 rounded-xl bg-slate-100 py-2.5 font-bold text-slate-700 transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-1/2 rounded-xl bg-indigo-600 py-2.5 font-bold text-white shadow-md transition-colors hover:bg-indigo-700"
            >
              Publish Ride
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}