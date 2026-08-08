import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const RIDES_STORAGE_KEY = "echoface_rides";
const BOOKINGS_STORAGE_KEY = "echoface_bookings";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [rides, setRides] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedBookings = window.localStorage.getItem(
        BOOKINGS_STORAGE_KEY
      );

      const storedRides = window.localStorage.getItem(
        RIDES_STORAGE_KEY
      );

      const parsedBookings = storedBookings
        ? JSON.parse(storedBookings)
        : [];

      const parsedRides = storedRides
        ? JSON.parse(storedRides)
        : [];

      setBookings(
        Array.isArray(parsedBookings) ? parsedBookings : []
      );

      setRides(Array.isArray(parsedRides) ? parsedRides : []);
    } catch {
      setBookings([]);
      setRides([]);
    }

    setIsLoaded(true);
  }, []);

  const getRideForBooking = (booking) => {
    return rides.find((ride) => ride.id === booking.rideId);
  };

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find(
      (item) => item.id === bookingId
    );

    if (!booking) {
      return;
    }

    const ride = rides.find(
      (item) => item.id === booking.rideId
    );

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    const updatedBookings = bookings.filter(
      (item) => item.id !== bookingId
    );

    let updatedRides = rides;

    if (ride) {
      updatedRides = rides.map((item) =>
        item.id === ride.id
          ? {
              ...item,
              seatsAvailable: item.seatsAvailable + 1,
            }
          : item
      );
    }

    window.localStorage.setItem(
      BOOKINGS_STORAGE_KEY,
      JSON.stringify(updatedBookings)
    );

    window.localStorage.setItem(
      RIDES_STORAGE_KEY,
      JSON.stringify(updatedRides)
    );

    setBookings(updatedBookings);
    setRides(updatedRides);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
            Loading your bookings...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="bg-indigo-900 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            EchoFace
          </p>

          <h1 className="mt-2 text-3xl font-black">
            My Bookings
          </h1>

          <p className="mt-2 max-w-xl text-sm text-indigo-200">
            View your upcoming campus rides and manage your
            reserved seats.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <div className="text-4xl">🎫</div>

            <h2 className="mt-4 text-xl font-black text-slate-800">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              When you book a ride, your reservation will appear
              here.
            </p>

            <a
              href="/"
              className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
            >
              Find a Ride
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  Your Reservations
                </h2>

                <p className="text-xs text-slate-500">
                  {bookings.length}{" "}
                  {bookings.length === 1
                    ? "active booking"
                    : "active bookings"}
                </p>
              </div>
            </div>

            {bookings.map((booking) => {
              const ride = getRideForBooking(booking);

              if (!ride) {
                return (
                  <article
                    key={booking.id}
                    className="rounded-2xl border border-red-200 bg-red-50 p-5"
                  >
                    <h3 className="font-bold text-red-800">
                      Ride unavailable
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                      This ride is no longer available.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleCancelBooking(booking.id)
                      }
                      className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Remove Booking
                    </button>
                  </article>
                );
              }

              return (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                          ✓ BOOKED
                        </span>

                        <span className="text-xs text-slate-500">
                          Booking #{booking.id.slice(-6)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <span className="font-bold text-slate-900">
                          {ride.pickupLocation}
                        </span>

                        <span className="text-xl text-indigo-500">
                          →
                        </span>

                        <span className="font-bold text-indigo-700">
                          {ride.gate}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                        <div>
                          <p className="text-slate-400">
                            Driver
                          </p>
                          <p className="mt-1 font-bold text-slate-700">
                            {ride.driverName}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-400">
                            Departure
                          </p>
                          <p className="mt-1 font-bold text-slate-700">
                            {ride.departureTime}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-400">
                            Vehicle
                          </p>
                          <p className="mt-1 font-bold text-slate-700">
                            {ride.vehicleType}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-400">
                            Fare
                          </p>
                          <p className="mt-1 font-black text-slate-900">
                            ₹{ride.costPerSeat}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-slate-500">
                        Passenger:{" "}
                        <span className="font-semibold text-slate-700">
                          {booking.passengerName}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCancelBooking(booking.id)
                      }
                      className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}