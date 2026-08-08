import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const INITIAL_FORM = {
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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let mounted = true;

    const loadProfile = async () => {
      setLoadingProfile(true);
      setError("");

      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (userError || !currentUser) {
        setError("Please sign in before posting a ride.");
        setLoadingProfile(false);
        return;
      }

      setUser(currentUser);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, college, student_id")
        .eq("id", currentUser.id)
        .single();

      if (!mounted) {
        return;
      }

      if (profileError) {
        setError(
          "Unable to load your student profile."
        );
        setLoadingProfile(false);
        return;
      }

      setProfile(data);

      setFormData((currentForm) => ({
        ...currentForm,
        college:
          data.college ||
          "MLR Institute of Technology",
      }));

      setLoadingProfile(false);
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!user || !profile) {
      setError(
        "Your student profile could not be loaded. Please sign in again."
      );
      return;
    }

    const pickupLocation =
      formData.pickupLocation.trim();

    const vehicleName =
      formData.vehicleName.trim();

    const gate = formData.gate.trim();

    const departureTime =
      formData.departureTime.trim();

    const costPerSeat = Number(formData.costPerSeat);

    const seatsAvailable = Number(
      formData.seatsAvailable
    );

    if (!pickupLocation) {
      setError("Please enter a pickup location.");
      return;
    }

    if (!gate) {
      setError("Please enter a drop-off gate.");
      return;
    }

    if (!departureTime) {
      setError("Please enter a departure time.");
      return;
    }

    if (!Number.isFinite(costPerSeat) || costPerSeat < 0) {
      setError("Please enter a valid fare.");
      return;
    }

    if (
      !Number.isInteger(seatsAvailable) ||
      seatsAvailable < 1 ||
      seatsAvailable > 6
    ) {
      setError("Seats must be between 1 and 6.");
      return;
    }

    setSubmitting(true);

    const { data, error: insertError } =
      await supabase
        .from("rides")
        .insert({
          driver_id: user.id,
          driver_name:
            profile.full_name || "EchoFace Student",
          college:
            profile.college || formData.college,
          pickup_location: pickupLocation,
          gate,
          vehicle_type: formData.vehicleType,
          vehicle_name: vehicleName || null,
          departure_time: departureTime,
          total_seats: seatsAvailable,
          seats_available: seatsAvailable,
          cost_per_seat: costPerSeat,
          gender_preference:
            formData.genderPreference,
          status: "active",
        })
        .select("*")
        .single();

    if (insertError) {
      setError(
        insertError.message ||
          "Unable to publish the ride."
      );
      setSubmitting(false);
      return;
    }

    if (onAddRide && data) {
      onAddRide(data);
    }

    setFormData({
      ...INITIAL_FORM,
      college:
        profile.college ||
        "MLR Institute of Technology",
    });

    setSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Post a Campus Ride
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Offer an available seat to another student.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-lg px-3 py-2 text-xl leading-none text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {loadingProfile ? (
            <div className="py-12 text-center text-sm font-medium text-slate-500">
              Loading your student profile...
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-500">
                  Driver
                </p>

                <p className="mt-1 text-sm font-bold text-indigo-900">
                  {profile?.full_name ||
                    "EchoFace Student"}
                </p>

                <p className="text-xs text-indigo-600">
                  {profile?.college || formData.college}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  College
                </label>

                <select
                  value={formData.college}
                  onChange={(event) =>
                    updateField(
                      "college",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>
                    MLR Institute of Technology
                  </option>
                  <option>IARE Dundigal</option>
                  <option>BVRIT Narsapur</option>
                  <option>
                    Malla Reddy University
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Vehicle Type
                  </label>

                  <select
                    value={formData.vehicleType}
                    onChange={(event) =>
                      updateField(
                        "vehicleType",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="Bike">
                      Bike
                    </option>
                    <option value="Car">
                      Car
                    </option>
                    <option value="Auto Split">
                      Auto Split
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Vehicle Name / No.
                  </label>

                  <input
                    type="text"
                    value={formData.vehicleName}
                    onChange={(event) =>
                      updateField(
                        "vehicleName",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Pulsar 150"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Pickup Location *
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.pickupLocation}
                    onChange={(event) =>
                      updateField(
                        "pickupLocation",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Gandi Maisamma"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Drop-off Gate *
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.gate}
                    onChange={(event) =>
                      updateField(
                        "gate",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Gate 2"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Departure Time *
                  </label>

                  <input
                    type="time"
                    required
                    value={formData.departureTime}
                    onChange={(event) =>
                      updateField(
                        "departureTime",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Fare (₹) *
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.costPerSeat}
                    onChange={(event) =>
                      updateField(
                        "costPerSeat",
                        event.target.value
                      )
                    }
                    placeholder="e.g. 30"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Seats
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="6"
                    step="1"
                    required
                    value={formData.seatsAvailable}
                    onChange={(event) =>
                      updateField(
                        "seatsAvailable",
                        Number(event.target.value)
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Gender Preference
                </label>

                <select
                  value={formData.genderPreference}
                  onChange={(event) =>
                    updateField(
                      "genderPreference",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="Any">
                    Any Student
                  </option>
                  <option value="Female Only">
                    Female Students Only
                  </option>
                  <option value="Male Only">
                    Male Students Only
                  </option>
                </select>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed sm:w-1/2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting || loadingProfile
                  }
                  className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-1/2"
                >
                  {submitting
                    ? "Publishing..."
                    : "Publish Ride"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}