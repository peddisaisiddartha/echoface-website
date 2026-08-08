import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import RideCard from '../components/RideCard';
import PostRideModal from '../components/PostRideModal';
import { INITIAL_RIDES } from '../utils/mockData';

export default function Home() {
  const [rides, setRides] = useState(INITIAL_RIDES);
  const [selectedCollege, setSelectedCollege] = useState('MLR Institute of Technology');
  const [filterVehicle, setFilterVehicle] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRide = (newRide) => {
    setRides([newRide, ...rides]);
  };

  const handleBookRide = (ride) => {
    alert(`Booking request sent to ${ride.driverName} for drop-off at ${ride.gate}!`);
  };

  const filteredRides = rides.filter(ride => {
    const matchesVehicle = filterVehicle === 'All' || ride.vehicleType === filterVehicle;
    const matchesLocation = ride.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ride.gate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVehicle && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar onOpenPostModal={() => setIsModalOpen(true)} />

      <section className="bg-indigo-900 text-white py-12 px-4 shadow-inner">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">Direct Rides Right to Your Campus Gate</h1>
          <p className="text-indigo-200 text-sm md:text-base max-w-xl mx-auto">
            Skip congested transfers. Find peer students heading directly to your college gate in bikes, cars, or shared autos.
          </p>

          <div className="bg-white text-slate-800 p-4 rounded-2xl shadow-xl max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 text-left mb-1">YOUR COLLEGE</label>
              <select 
                value={selectedCollege} 
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-sm font-semibold focus:outline-indigo-600"
              >
                <option>MLR Institute of Technology</option>
                <option>IARE Dundigal</option>
                <option>BVRIT Narsapur</option>
                <option>Malla Reddy University</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 text-left mb-1">PICKUP POINT / GATE</label>
              <input 
                type="text"
                placeholder="e.g. Gandi Maisamma, Gate 2" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 text-left mb-1">VEHICLE TYPE</label>
              <select 
                value={filterVehicle} 
                onChange={(e) => setFilterVehicle(e.target.value)}
                className="w-full bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-sm font-semibold focus:outline-indigo-600"
              >
                <option value="All">All Modes (Bike, Car, Auto)</option>
                <option value="Bike">Bike Pool</option>
                <option value="Car">Car Pool</option>
                <option value="Auto Split">Shared Auto</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Available Commutes</h2>
            <p className="text-xs text-slate-500">Showing rides targeting <span className="font-semibold text-indigo-700">{selectedCollege}</span></p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
            {filteredRides.length} Active Rides
          </span>
        </div>

        {filteredRides.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
            No rides match your filter. Be the first to post a ride!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} onBook={handleBookRide} />
            ))}
          </div>
        )}
      </main>

      <PostRideModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddRide={handleAddRide} 
      />
    </div>
  );
}