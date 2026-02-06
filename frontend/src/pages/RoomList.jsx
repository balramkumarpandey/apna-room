import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import RoomCard from '../components/RoomCard';
import RoomSkeleton from '../components/RoomSkeleton';
import { X, Search, SlidersHorizontal } from 'lucide-react';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [colonies, setColonies] = useState([]);

  const [filters, setFilters] = useState({
    colony_name: '',
    room_type: '',
    tenant_type: '', 
    ordering: ''
  });

  const roomTypes = [
    { id: '', label: 'All' },
    { id: '1_RK', label: '1 Room Set' },
    { id: '2_RK', label: '2 Room Set' },
    { id: '1_BHK', label: '1 BHK' },
    { id: '2_BHK', label: '2 BHK' },
  ];

  const tenantTypes = [
    { id: '', label: 'Anyone' },
    { id: 'BOYS', label: 'Boys' },
    { id: 'GIRLS', label: 'Girls' },
    { id: 'FAMILY', label: 'Family' },
  ];

  // Fetch Colony List
  useEffect(() => {
    const fetchColonies = async () => {
      try {
        const response = await api.get('/api/colonies/');
        setColonies(response.data);
      } catch (error) {
        console.error("Error fetching colonies:", error);
      }
    };
    fetchColonies();
  }, []);

  // Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.colony_name) params.append('search', filters.colony_name);
        if (filters.room_type) params.append('room_type', filters.room_type);
        if (filters.tenant_type) params.append('tenant_type', filters.tenant_type);
        if (filters.ordering) params.append('ordering', filters.ordering);

        await new Promise(r => setTimeout(r, 600)); 

        const response = await api.get(`/api/rooms/?${params.toString()}`);
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchRooms(), 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Sticky Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-blue-600">
            Available Rooms
          </h1>
          
          <button 
            className="lg:hidden p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            {showMobileFilters ? <X size={20} /> : <SlidersHorizontal size={20} />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex gap-10 relative">
        
        {/* Sidebar Filters */}
        <aside className={`
          fixed lg:sticky lg:top-24 left-0 h-screen lg:h-auto w-80 bg-white lg:bg-transparent z-40 lg:z-0
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl lg:shadow-none p-6 lg:p-0
          ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="lg:bg-white lg:p-6 lg:rounded-3xl lg:shadow-lg lg:border lg:border-white/50 h-full overflow-y-auto lg:h-auto">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}><X /></button>
            </div>

            {/* Dropdown Section (FIXED) */}
            <div className="mb-8 relative">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Location</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium text-gray-700 appearance-none cursor-pointer"
                  value={filters.colony_name}
                  onChange={(e) => setFilters(prev => ({ ...prev, colony_name: e.target.value }))}
                >
                  <option value="">All Colonies</option>
                  {/* --- THE FIX IS HERE --- */}
                  {colonies.map((colony) => (
                    <option key={colony.id} value={colony.name}>{colony.name}</option>
                  ))}
                  {/* ----------------------- */}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Tenant Type Filters */}
            <div className="mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Who is this for?</label>
              <div className="flex flex-wrap gap-2">
                {tenantTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFilters(prev => ({ ...prev, tenant_type: type.id }))}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border
                      ${filters.tenant_type === type.id 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/30 scale-105' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }
                    `}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Type Filters */}
            <div className="mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Room Type</label>
              <div className="flex flex-wrap gap-2">
                {roomTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFilters(prev => ({ ...prev, room_type: type.id }))}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border
                      ${filters.room_type === type.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30 scale-105' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }
                    `}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="mb-8 lg:mb-0">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Sort By</label>
              <select 
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500/20 font-medium text-gray-700 cursor-pointer hover:bg-white transition-colors"
                value={filters.ordering}
                onChange={(e) => setFilters(prev => ({ ...prev, ordering: e.target.value }))}
              >
                <option value="">Newest Added</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {showMobileFilters && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
        )}

        {/* Room Grid */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => <RoomSkeleton key={n} />)}
            </div>
          ) : rooms.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300"
            >
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No rooms found</h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-6">Try adjusting your filters.</p>
              <button 
                onClick={() => setFilters({ colony_name: '', room_type: '', tenant_type: '', ordering: '' })}
                className="text-blue-600 font-bold hover:underline"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RoomList;