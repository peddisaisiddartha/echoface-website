import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase";

export default function MyRides() {
  const router = useRouter();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");
  const [bookingMessages, setBookingMessages] = useState({});
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [messageInputs, setMessageInputs] = useState({});
  const [sendingMessageId, setSendingMessageId] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadRides = async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (userError || !user) {
        router.replace("/auth/login");
        return;
      }

      const { data, error: ridesError } =
  await supabase
    .from("rides")
    .select("*")
    .eq("driver_id", user.id)
    .order("created_at", {
      ascending: false,
    });

if (ridesError) {
  setError(
    ridesError.message ||
      "Unable to load your rides."
  );
  setLoading(false);
  return;
}

const loadedRides = data || [];

const rideIds = loadedRides.map((ride) => ride.id);

if (rideIds.length > 0) {
  const { data: confirmedBookings, error: bookingsError } =
    await supabase
      .from("bookings")
      .select("id, ride_id, passenger_id, status")
      .in("ride_id", rideIds)
      .eq("status", "confirmed");

  if (bookingsError) {
    setError(
      bookingsError.message ||
        "Unable to load confirmed bookings."
    );
    setLoading(false);
    return;
  }

  setConfirmedBookings(confirmedBookings || []);

  const bookingIds = (confirmedBookings || []).map(
    (booking) => booking.id
  );

  if (bookingIds.length > 0) {
    const {
      data: messages,
      error: messagesError,
    } = await supabase
      .from("booking_messages")
      .select(
        "id, booking_id, sender_id, message, created_at"
      )
      .in("booking_id", bookingIds)
      .order("created_at", {
        ascending: true,
      });

    if (messagesError) {
      setError(
        messagesError.message ||
          "Unable to load booking messages."
      );
      setLoading(false);
      return;
    }

    const groupedMessages = {};

    (messages || []).forEach((message) => {
      if (!groupedMessages[message.booking_id]) {
        groupedMessages[message.booking_id] = [];
      }

      groupedMessages[message.booking_id].push(message);
    });

    setBookingMessages(groupedMessages);
  }
}

      setRides(loadedRides);
      setLoading(false);
      return;

      if (!mounted) {
        return;
      }

      if (ridesError) {
        setError(
          ridesError.message ||
            "Unable to load your rides."
        );
        setLoading(false);
        return;
      }

      setRides(data || []);
      setLoading(false);
    };

    loadRides();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleCancelRide = async (rideId) => {
    setCancellingId(rideId);
    setError("");

    const { error: cancelError } =
      await supabase.rpc("cancel_ride", {
        p_ride_id: rideId,
      });

    if (cancelError) {
      setError(
        cancelError.message ||
          "Unable to cancel this ride."
      );
      setCancellingId(null);
      return;
    }

    setRides((currentRides) =>
      currentRides.map((ride) =>
        ride.id === rideId
          ? {
              ...ride,
              status: "cancelled",
            }
          : ride
      )
    );

    setCancellingId(null);
  };


    const sendMessage = async (bookingId) => {
    const message = (
      messageInputs[bookingId] || ""
    ).trim();

    if (!message) {
      return;
    }

    setSendingMessageId(bookingId);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError(
        "You must be signed in to send a message."
      );
      setSendingMessageId(null);
      return;
    }

    const { error: messageError } =
      await supabase
        .from("booking_messages")
        .insert({
          booking_id: bookingId,
          sender_id: user.id,
          message,
        });

    if (messageError) {
      setError(
        messageError.message ||
          "Unable to send your message."
      );
      setSendingMessageId(null);
      return;
    }

    setBookingMessages((current) => ({
      ...current,
      [bookingId]: [
        ...(current[bookingId] || []),
        {
          id: `local-${Date.now()}`,
          booking_id: bookingId,
          sender_id: user.id,
          message,
          created_at: new Date().toISOString(),
        },
      ],
    }));

    setMessageInputs((current) => ({
      ...current,
      [bookingId]: "",
    }));

    setSendingMessageId(null);
  };

  const activeRides = rides.filter(
    (ride) =>
      ride.status === "active" ||
      ride.status === "full"
  );

  const previousRides = rides.filter(
    (ride) =>
      ride.status !== "active" &&
      ride.status !== "full"
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-sm font-medium text-slate-500">
          Loading your rides...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
          >
            ← Back to rides
          </Link>

          <div className="mt-5">
            <h1 className="text-2xl font-black text-slate-900">
              My Rides
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage the rides you've posted for other
              students.
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800">
              Active Rides
            </h2>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {activeRides.length}
            </span>
          </div>

          {activeRides.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm font-medium text-slate-600">
                You haven't posted any active rides.
              </p>

              <Link
                href="/"
                className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Post a Ride
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRides.map((ride) => (
                <div
                  key={ride.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-900">
                          {ride.pickup_location}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            ride.status === "full"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {ride.status === "full"
                            ? "FULL"
                            : "ACTIVE"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {ride.vehicle_type}
                        {ride.vehicle_name
                          ? ` • ${ride.vehicle_name}`
                          : ""}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-lg font-black text-slate-900">
                        ₹{ride.cost_per_seat}
                      </span>

                      <p className="text-xs text-slate-500">
                        per seat
                      </p>
                    </div>
                  </div>

                  <div className="my-5 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500">
                        Pickup
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {ride.pickup_location}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Drop-off
                      </p>

                      <p className="mt-1 font-bold text-indigo-700">
                        {ride.gate}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Departure
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {ride.departure_time}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Seats Available
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {ride.seats_available} /{" "}
                        {ride.total_seats}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Gender Preference
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {ride.gender_preference}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Fare
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        ₹{ride.cost_per_seat} / seat
                      </p>
                    </div>
                  </div>


                  <div className="mb-4 space-y-3">
                    {confirmedBookings
                      .filter((booking) => booking.ride_id === ride.id)
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="rounded-xl border border-indigo-100 bg-indigo-50 p-4"
                        >
                          <p className="text-sm font-black text-indigo-900">
                            Passenger Contact
                          </p>

                          <p className="mt-1 text-xs text-indigo-700">
                            Confirmed passenger
                          </p>

                          {(bookingMessages[booking.id] || []).length > 0 && (
                            <div className="mt-3 space-y-2">
                              {bookingMessages[booking.id].map((message) => (
                                <div
                                  key={message.id}
                                  className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700"
                                >
                                  {message.message}
                                </div>
                              ))}
                            </div>
                          )}
                          <textarea
                            value={messageInputs[booking.id] || ""}
                            onChange={(event) =>
                              setMessageInputs((current) => ({
                                ...current,
                                [booking.id]: event.target.value,
                              }))
                            }
                            placeholder="Reply to the passenger..."
                            rows={2}
                            maxLength={1000}
                            className="mt-3 w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          />

                          <button
                              type="button"
                              onClick={() => sendMessage(booking.id)}
                                disabled={
                                sendingMessageId === booking.id ||
                                !(messageInputs[booking.id] || "").trim()
                              }
                              className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                              {sendingMessageId === booking.id
                                ? "Sending..."
                                : "Reply"}
                          </button>
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-end border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleCancelRide(ride.id)
                      }
                      disabled={
                        cancellingId === ride.id
                      }
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancellingId === ride.id
                        ? "Cancelling..."
                        : "Cancel Ride"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {previousRides.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-black text-slate-800">
              Ride History
            </h2>

            <div className="space-y-3">
              {previousRides.map((ride) => (
                <div
                  key={ride.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-800">
                        {ride.pickup_location}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {ride.gate} •{" "}
                        {ride.departure_time}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                      {ride.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}