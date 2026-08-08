import React from 'react';

export default function RideCard({ ride, onBook }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-base">
              {ride.driverName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-bold text-slate-900 text-sm">{ride.driverName}</h3>
                {ride.isVerifiedStudent && (
                  <span className="text-blue-600 text-xs font-semibold" title="Verified Campus Student">✓ Verified</span>
                )}
              </div>
              <p className="text-xs text-slate-500">{ride.vehicleName}</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
            ride.vehicleType === 'Bike' ? 'bg-amber-100 text-amber-800' :
            ride.vehicleType === 'Car' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {ride.vehicleType}
          </span>
        </div>

        <div className="space-y-2 my-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Pickup:</span>
            <span className="font-semibold text-slate-800">{ride.pickupLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Drop-off Gate:</span>
            <span className="font-bold text-indigo-700">{ride.gate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Departure Time:</span>
            <span className="font-semibold text-slate-800">{ride.departureTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Preferences:</span>
            <span className="font-medium text-slate-700">{ride.genderPreference}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <span className="text-lg font-black text-slate-900">₹{ride.costPerSeat}</span>
          <span className="text-xs text-slate-500"> / seat</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-500 font-medium">{ride.seatsAvailable} seat left</span>
          <button 
            onClick={() => onBook(ride)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Book Ride
          </button>
        </div>
      </div>
    </div>
  );
}