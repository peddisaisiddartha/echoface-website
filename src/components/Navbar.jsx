import React from "react";
import Link from "next/link";

export default function Navbar({ onOpenPostModal }) {
  return (
    <header className="sticky top-0 z-40 bg-indigo-700 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center space-x-2"
        >
          <span className="text-2xl font-black tracking-wider">
            ECHO
            <span className="text-amber-400">FACE</span>
          </span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            href="/my-bookings"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600 md:text-sm"
          >
            My Bookings
          </Link>

          <button
            type="button"
            className="hidden rounded-lg border border-indigo-400 bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-800 sm:block md:text-sm"
          >
            Verify Student ID
          </button>

          <button
            type="button"
            onClick={onOpenPostModal}
            className="rounded-lg bg-amber-400 px-4 py-1.5 text-xs font-bold text-slate-950 shadow-sm transition-transform hover:bg-amber-500 active:scale-95 md:text-sm"
          >
            + Post a Ride
          </button>
        </div>
      </div>
    </header>
  );
}