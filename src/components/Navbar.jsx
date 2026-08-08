import React from 'react';

export default function Navbar({ onOpenPostModal }) {
  return (
    <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-wider">CAMPUS<span className="text-amber-400">POOL</span></span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-indigo-600 hover:bg-indigo-800 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium border border-indigo-400">
            Verify Student ID
          </button>
          <button 
            onClick={onOpenPostModal}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold shadow-sm transition-transform active:scale-95"
          >
            + Post a Ride
          </button>
        </div>
      </div>
    </header>
  );
}