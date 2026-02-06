import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Home, BadgeCheck, Users } from 'lucide-react'; // Added Users icon
import { useNavigate } from 'react-router-dom';


const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // Helper to get Badge Color & Text (Same as RoomDetail)
  const getTenantBadge = (type) => {
    switch (type) {
      case 'BOYS': return { color: 'bg-blue-600 text-white', label: 'Boys Only' };
      case 'GIRLS': return { color: 'bg-pink-600 text-white', label: 'Girls Only' };
      case 'FAMILY': return { color: 'bg-purple-600 text-white', label: 'Family' };
      default: return { color: 'bg-gray-800/80 text-white', label: 'Anyone' };
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
      className="cursor-pointer group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-100 flex flex-col h-full relative"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={displayImage} 
          alt={room.title} 
          loading="lazy" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Price Tag (Bottom Left) */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Rent</span>
          <div className="text-emerald-600 font-bold text-lg">
            {formatPrice(room.price)}<span className="text-sm text-gray-500 font-normal">/mo</span>
          </div>
        </div>

        {/* --- NEW TENANT BADGE (Top Right) --- */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${badge.color}`}>
          <Users size={12} className="fill-current" />
          {badge.label}
        </div>
        {/* ------------------------------------ */}

      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
            <Home size={12} /> {room.room_type.replace('_', ' ')}
          </span>
          {room.is_available && (
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
              <BadgeCheck size={12} /> Verified
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
          <span className="text-sm text-gray-400 font-medium group-hover:text-blue-600 transition-colors">View Details</span>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;