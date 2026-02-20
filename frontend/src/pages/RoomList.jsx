import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import RoomCard from '../components/RoomCard';
import RoomSkeleton from '../components/RoomSkeleton';
import { X, Search, SlidersHorizontal, Sparkles, MapPin, Info } from 'lucide-react';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [colonies, setColonies] = useState([]);
  
  // Separate Input State from Search Query
  const [inputText, setInputText] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

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

  // Fetch Colony List (Runs once)
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

  // Fast Debounce for Typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputText);
    }, 400); // Wait 400ms after user stops typing
    return () => clearTimeout(timer);
  }, [inputText]);

  // Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (debouncedQuery) params.append('search', debouncedQuery);
        if (filters.colony_name) params.append('colony_name', filters.colony_name);
        if (filters.room_type) params.append('room_type', filters.room_type);
        if (filters.tenant_type) params.append('tenant_type', filters.tenant_type);
        if (filters.ordering) params.append('ordering', filters.ordering);

        const response = await api.get(`/api/rooms/?${params.toString()}`);
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [filters, debouncedQuery]);

  //  Memoize the rendered list
  const renderedRooms = useMemo(() => {
    return rooms.map((room) => (
      <motion.div
        key={room.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <RoomCard room={room} />
      </motion.div>
    ));
  }, [rooms]);

  // Prevents the clear button from re-rendering unnecessarily
  const handleClearFilters = useCallback(() => {
    setFilters({ colony_name: '', room_type: '', tenant_type: '', ordering: '' });
    setInputText('');
    setDebouncedQuery('');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* --- HERO SEARCH SECTION --- */}
      <div className="bg-white border-b pt-10 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100 shadow-sm"
            >
                <Sparkles size={14} /> Find your perfect space
            </motion.div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Where do you want to <span className="text-blue-600">Live?</span>
            </h2>

            {/* Interactive Search Bar */}
            <div className="relative group max-w-2xl mx-auto pt-4">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                    <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                </div>
                <input 
                    type="text"
                    placeholder="Search by colony, title, rent, or 'Boys/Girls'..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full pl-14 pr-16 py-5 bg-slate-100 border-2 border-transparent rounded-[2rem] text-lg font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-lg shadow-slate-200/50 outline-none placeholder:text-slate-400"
                />
                {inputText && (
                    <button 
                        onClick={() => { setInputText(''); setDebouncedQuery(''); }}
                        className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} className="bg-slate-200 rounded-full p-0.5" />
                    </button>
                )}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex gap-10 relative">
        
        {/* --- FILTER BOX --- */}
        <aside className={`
          fixed inset-x-0 bottom-0 z-50 
          w-full h-[85vh] lg:h-auto lg:w-80 
          bg-white lg:bg-transparent 
          rounded-t-[2.5rem] lg:rounded-none
          shadow-[0_-10px_40px_rgba(0,0,0,0.15)] lg:shadow-none
          transform transition-transform duration-300 ease-out
          lg:sticky lg:top-24 lg:translate-y-0
          ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <div className="h-full flex flex-col lg:block">
            
            {/* Mobile Drag Handle */}
            <div className="lg:hidden flex justify-center pt-3 pb-1" onClick={() => setShowMobileFilters(false)}>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-7 lg:rounded-[2rem] lg:bg-white lg:border lg:border-white/50 lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-8 lg:hidden">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Filters</h2>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Location Dropdown */}
                <div className="mb-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Quick Location</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    value={filters.colony_name}
                    onChange={(e) => setFilters(prev => ({ ...prev, colony_name: e.target.value }))}
                    >
                    <option value="">All Areas</option>
                    {colonies.map((colony) => (
                        <option key={colony.id} value={colony.name}>{colony.name}</option>
                    ))}
                    </select>
                </div>
                </div>

                {/* Tenant Type Filters */}
                <div className="mb-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Who's moving in?</label>
                <div className="grid grid-cols-2 gap-2">
                    {tenantTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setFilters(prev => ({ ...prev, tenant_type: type.id }))}
                        className={`
                        px-3 py-2.5 rounded-xl text-xs font-black transition-all duration-200 border-2
                        ${filters.tenant_type === type.id 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:bg-blue-50'
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Preferred Layout</label>
                <div className="grid grid-cols-1 gap-2">
                    {roomTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setFilters(prev => ({ ...prev, room_type: type.id }))}
                        className={`
                        px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all duration-200 border-2 flex justify-between items-center
                        ${filters.room_type === type.id 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                        }
                        `}
                    >
                        {type.label}
                        {filters.room_type === type.id && <Info size={14} />}
                    </button>
                    ))}
                </div>
                </div>

                {/* Sort Dropdown */}
                <div className="mb-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Sort Options</label>
                <select 
                    className="w-full p-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 cursor-pointer transition-all"
                    value={filters.ordering}
                    onChange={(e) => setFilters(prev => ({ ...prev, ordering: e.target.value }))}
                >
                    <option value="">Newest Listings</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                </select>
                </div>
                
                <button 
                    onClick={handleClearFilters}
                    className="w-full py-3 text-xs font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest mb-4"
                >
                    Clear All Filters
                </button>
            </div>

            {/* Mobile Only: Show Results Button */}
            <div className="lg:hidden p-4 border-t bg-white">
                <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/30"
                >
                    Show {rooms.length} Results
                </button>
            </div>
          </div>
        </aside>

        {/* Room Grid Area */}
        <main className="flex-1 min-w-0">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {loading ? 'Searching...' : `${rooms.length} results found`}
            </p>
            <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-lg shadow-slate-900/20"
            >
                <SlidersHorizontal size={14} /> Filter
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => <RoomSkeleton key={n} />)}
            </div>
          ) : rooms.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-inner"
            >
              <div className="bg-slate-100 p-6 rounded-full mb-6">
                <Search size={48} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">No rooms match your search</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">Try searching for something else like "Vikas Colony" or "Boys".</p>
              <button 
                onClick={handleClearFilters}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-black text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode='popLayout'>
                {renderedRooms}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {showMobileFilters && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/60 z-[40] lg:hidden backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
};

export default RoomList;