import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Home, BadgeCheck, Users, Ban } from 'lucide-react'; // Added Ban icon
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // Helper to get Badge Color & Text
  const getTenantBadge = (type) => {
    switch (type) {
      case 'BOYS': return { className: 'bg-blue-600 text-white', label: 'Boys Only' };
      case 'GIRLS': return { className: 'bg-pink-600 text-white', label: 'Girls Only' };
      case 'FAMILY': return { className: 'bg-purple-600 text-white', label: 'Family' };
      default: return { className: 'bg-gray-800 text-white', label: 'Anyone' };
    }
  };

  const badge = getTenantBadge(room.tenant_type);

  // Format price nicely
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const displayImage = room.images && room.images.length > 0 
    ? room.images[0].image 
    : "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <motion.div 
      layout
      onClick={() => navigate(`/rooms/${room.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className={`cursor-pointer group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative ${!room.is_available ? 'opacity-80' : 'hover:shadow-blue-500/10'}`}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={displayImage} 
          alt={room.title} 
          loading="lazy" 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!room.is_available ? 'grayscale-[0.8]' : ''}`}
        />
        
        {/* --- RENTED OUT OVERLAY (New Feature) --- */}
        {!room.is_available && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
             <div className="border-2 border-white/80 text-white px-6 py-2 rounded-lg transform -rotate-12 font-bold text-2xl uppercase tracking-widest shadow-2xl">
                Rented Out
             </div>
          </div>
        )}

        {/* Price Tag (Bottom Left) - Hidden if Rented to reduce clutter, or keep it if you prefer */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 z-10">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Rent</span>
          <div className="text-emerald-600 font-bold text-lg">
            {formatPrice(room.price)}<span className="text-sm text-gray-500 font-normal">/mo</span>
          </div>
        </div>

        {/* Tenant Badge (Top Right) */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide z-10 ${badge.className}`}>
          <Users size={12} className="fill-current" />
          {badge.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Badges Row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
            <Home size={12} /> {room.room_type.replace('_', ' ')}
          </span>
          
          {/* Dynamic Availability Badge */}
          {room.is_available ? (
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
              <BadgeCheck size={12} /> Verified
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
              <Ban size={12} /> Fully Booked
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {room.title}
        </h3>
        
        <div className="flex items-start gap-2 text-gray-500 text-sm mb-6">
          <MapPin size={16} className="mt-1 text-gray-400 shrink-0" />
          <span className="line-clamp-2 leading-relaxed">{room.address}, {room.colony_name}</span>
        </div>

        {/* Bottom Action */}
        <div className="mt-auto pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-400 font-medium group-hover:text-blue-600 transition-colors">
            {room.is_available ? 'View Details' : 'Check Similar Rooms'}
          </span>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${room.is_available ? 'bg-gray-50 text-gray-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-gray-100 text-gray-400'}`}>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;