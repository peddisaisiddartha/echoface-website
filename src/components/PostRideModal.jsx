import React, { useState } from 'react';

export default function PostRideModal({ isOpen, onClose, onAddRide }) {
  const [formData, setFormData] = useState({
    driverName: '',
    college: 'MLR Institute of Technology',
    gate: 'Gate 1 (Main Campus)',
    vehicleType: 'Bike',
    vehicleName: '',
    departureTime: '',
    pickupLocation: '',
    seatsAvailable: 1,
    costPerSeat: '',
    genderPreference: 'Any'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.driverName || !formData.pickupLocation || !formData.costPerSeat) {
      alert('Please fill in all required fields.');
      return;
    }
    onAddRide({
      ...formData,
      id: Date.now().toString(),
      isVerifiedStudent: true,
      costPerSeat: Number(formData.costPerSeat)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">Post a Campus Ride</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
            <input 
              type="text" 
              required 
              value={formData.driverName}
              onChange={(e) => setFormData({...formData, driverName: e.target.value})}
              placeholder="e.g. Rahul Sharma" 
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vehicle Type</label>
              <select 
                value={formData.vehicleType}
                onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600 bg-white"
              >
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Auto Split">Auto Split</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vehicle Name/No.</label>
              <input 
                type="text" 
                value={formData.vehicleName}
                onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                placeholder="e.g. Pulsar 150" 
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pickup Location *</label>
              <input 
                type="text" 
                required 
                value={formData.pickupLocation}
                onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                placeholder="e.g. Gandi Maisamma" 
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Drop-off Gate</label>
              <input 
                type="text" 
                value={formData.gate}
                onChange={(e) => setFormData({...formData, gate: e.target.value})}
                placeholder="e.g. Gate 2" 
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Departure Time</label>
              <input 
                type="text" 
                value={formData.departureTime}
                onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                placeholder="e.g. 08:30 AM" 
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Fare (₹) *</label>
              <input 
                type="number" 
                required 
                value={formData.costPerSeat}
                onChange={(e) => setFormData({...formData, costPerSeat: e.target.value})}
                placeholder="e.g. 30" 
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Seats</label>
              <input 
                type="number" 
                min="1" 
                max="6" 
                value={formData.seatsAvailable}
                onChange={(e) => setFormData({...formData, seatsAvailable: Number(e.target.value)})}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Gender Preference</label>
            <select 
              value={formData.genderPreference}
              onChange={(e) => setFormData({...formData, genderPreference: e.target.value})}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600 bg-white"
            >
              <option value="Any">Any Student</option>
              <option value="Female Only">Female Students Only</option>
              <option value="Male Only">Male Students Only</option>
            </select>
          </div>

          <div className="pt-3 flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-colors"
            >
              Publish Ride
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}