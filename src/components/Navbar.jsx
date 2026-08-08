import React from "react";
import Link from "next/link";

export default function Navbar({
  onOpenPostModal,
  onOpenProfileModal,
  profile,
}) {
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

        <div className="flex items-center space-x-1 sm:space-x-3">
          <Link
            href="/my-rides"
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600 sm:px-3 md:text-sm"
          >
            My Rides
          </Link>

          <Link
            href="/my-bookings"
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600 sm:px-3 md:text-sm"
          >
            My Bookings
          </Link>

          <button
            type="button"
            onClick={onOpenProfileModal}
            className="hidden items-center gap-2 rounded-lg border border-indigo-400 bg-indigo-600 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-indigo-800 sm:flex md:text-sm"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-black text-emerald-950">
              {profile?.name
                ? profile.name.charAt(0).toUpperCase()
                : "?"}
            </span>

            <span>
              {profile?.name
                ? profile.name.split(" ")[0]
                : "Student"}
            </span>

            {profile?.isVerified && (
              <span className="text-emerald-300">
                ✓
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenPostModal}
            className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-sm transition-transform hover:bg-amber-500 active:scale-95 sm:px-4 md:text-sm"
          >
            + Post Ride
          </button>
        </div>
      </div>
    </header>
  );
}