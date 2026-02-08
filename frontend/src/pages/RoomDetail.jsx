import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, PlayCircle, Phone, Users, CreditCard, Share2, ShieldCheck, User, HelpCircle } from 'lucide-react';
import TenantModal from '../components/TenantModal';
import BookingModal from '../components/BookingModal';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/api/rooms/${id}/`);
        setRoom(response.data);
        if (response.data.images.length > 0) {
          setActiveImage(response.data.images[0].image);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const getTenantBadge = (type) => {
    switch (type) {
      case 'BOYS': return { color: 'bg-blue-600 text-white', label: 'Boys Only' };
      case 'GIRLS': return { color: 'bg-pink-600 text-white', label: 'Girls Only' };
      case 'FAMILY': return { color: 'bg-purple-600 text-white', label: 'Family' };
      default: return { color: 'bg-gray-800 text-white', label: 'Anyone' };
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!room) return <div className="text-center py-20 bg-slate-50">Room not found</div>;

  // --- SHARE FUNCTION ---
  const handleShare = async () => {
    const shareData = {
      title: room.title,
      text: `Check out this room in ${room.colony_name} on ApnaRoom!`,
      url: window.location.href, // Gets the current page URL
    };

    try {
      //  Try Native Share (Mobile/Tablets)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for Desktop: Copy to Clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard! 📋");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const tenantBadge = getTenantBadge(room.tenant_type);
  const bookingAmount = room.price / 4;

  // --- REUSABLE TRUST BADGE COMPONENT ---
  const TrustBadge = () => (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3 shadow-sm mt-4">
      <div className="bg-white p-1.5 rounded-full border border-green-100 shadow-sm h-fit shrink-0">
        <ShieldCheck className="text-green-600" size={18} />
      </div>
      <div>
        <h4 className="text-green-800 font-bold text-xs uppercase tracking-wide mb-1">
          100% Money Safe Guarantee
        </h4>
        <p className="text-green-700 text-xs leading-relaxed">
          Your payment is held in <strong>Escrow</strong>. We only release it to the landlord <strong>after</strong> you confirm your move-in.
        </p>
      </div>
    </div>
  );

  // --- RENT BREAKDOWN CARD ---
  const RentBreakdown = () => (
    <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-4 mt-4">
        <div className="flex items-start gap-3">
            <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
            <div>
                <h4 className="font-bold text-emerald-900 text-sm">No Brokerage / Zero Commission</h4>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                    The <strong>₹{bookingAmount.toLocaleString()}</strong> you pay now is <span className="underline">strictly part of your 1st month rent</span>.
                </p>
                <div className="mt-3 text-xs text-emerald-600 flex flex-col gap-2">
                    
                    {/* --- TOOLTIP ADDED HERE --- */}
                    <div className="flex justify-between items-center relative z-10">
                        <span className="flex items-center gap-1.5 cursor-help group">
                            Pay Now to Book (25%)
                            <HelpCircle size={14} className="text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                            
                            {/* The Tooltip Popup */}
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-slate-800 text-white text-[10px] p-2.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-2 group-hover:translate-y-0 z-50">
                                <p className="leading-relaxed">
                                    <strong>Risk-Free:</strong> If you visit and don't like the room, we will find you another one or refund your money.
                                </p>
                                {/* Little arrow pointing down */}
                                <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800"></div>
                            </div>
                        </span>
                        <span className="font-bold text-emerald-700">₹{bookingAmount.toLocaleString()}</span>
                    </div>
                    {/* ---------------------------------- */}

                    <div className="flex justify-between border-t border-emerald-200/60 pt-2">
                        <span>Pay Landlord on Move-in:</span>
                        <span className="font-bold">Remaining 75%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-32 lg:pb-10 font-sans selection:bg-blue-100">
      
      {/* Navbar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 lg:px-8 h-16 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-black font-medium transition-all hover:-translate-x-1">
          <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
        </button>
        <span className="font-bold text-lg truncate max-w-[200px] lg:max-w-none text-slate-800">{room.title}</span>
        <button 
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-slate-100 text-blue-600 transition-colors active:scale-90"
          title="Share this room"
        >
            <Share2 size={20} />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN (Visuals & Mobile Info) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Image */}
          <div className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50">
            <div className="bg-slate-100 w-full h-72 lg:h-[500px] rounded-2xl overflow-hidden relative flex items-center justify-center group">
              <AnimatePresence mode='wait'>
                {activeImage ? (
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.05 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={activeImage} 
                    className="max-w-full max-h-full object-contain z-10" 
                    alt="Room View"
                  />
                ) : (
                  <div className="text-slate-400">No Image Available</div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Thumbnails */}
          {room.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
              {room.images.map((img) => (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={img.id}
                  onClick={() => setActiveImage(img.image)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-sm transition-all ${activeImage === img.image ? 'border-blue-600 ring-4 ring-blue-100' : 'border-white opacity-70 grayscale hover:grayscale-0'}`}
                >
                  <img src={img.image} className="w-full h-full object-cover" alt="thumbnail" />
                </motion.button>
              ))}
            </div>
          )}

          {/* --- MOBILE INFO SECTION (lg:hidden) --- */}
          <div className="lg:hidden space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200">
                  {room.room_type.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${tenantBadge.color}`}>
                  <Users size={12} /> {tenantBadge.label}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">{room.title}</h1>
              <div className="flex items-center text-slate-500 mt-2 font-medium">
                <MapPin size={18} className="mr-1 text-blue-500" />
                {room.colony_name}
              </div>
            </div>
            
            {/* Price Card Mobile */}
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Total Monthly Rent</p>
                <div className="text-3xl font-extrabold text-blue-600">
                  ₹{room.price.toLocaleString()} 
                </div>
                
                {/* Mobile Rent Breakdown */}
                <RentBreakdown />
                
                {/* --- MOBILE TRUST BADGE PLACEMENT --- */}
                <TrustBadge />
            </div>
          </div>

          {/* Video Section */}
          {room.video && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-6 border-t border-slate-200 lg:border-none"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <PlayCircle className="text-red-500" /> Video Tour
              </h3>
              <div className="rounded-3xl overflow-hidden shadow-xl bg-black aspect-video w-full max-w-3xl ring-4 ring-slate-100">
                <video controls className="w-full h-full">
                  <source src={room.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          )}

          {/* Description */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">About this place</h3>
            <p className="text-slate-600 leading-relaxed text-base lg:text-lg">
              {room.description || "No description provided."}
            </p>
            
            <div className="mt-8 bg-slate-100 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <MapPin size={18} /> Location Details
                </h4>
                <p className="text-slate-500 text-sm">
                   Located in {room.colony_name}. The exact house address will be shared after booking a visit.
                </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Desktop Sticky Sidebar) */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-28">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
              
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {room.room_type.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${tenantBadge.color}`}>
                    <Users size={12} /> {tenantBadge.label}
                  </span>
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-snug">{room.title}</h1>
                <div className="flex items-center text-slate-500 font-medium">
                  <MapPin size={16} className="mr-1 text-blue-500" />
                  {room.colony_name}
                </div>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Total Monthly Rent</p>
                  <div className="text-4xl font-extrabold text-blue-600">
                    ₹{room.price.toLocaleString()} 
                    <span className="text-lg text-slate-400 font-medium">/mo</span>
                  </div>
              </div>

              {/* Desktop Rent Breakdown */}
              <RentBreakdown />

              <div className="space-y-3 mt-6">
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                >
                  <CreditCard size={20} className="group-hover:rotate-12 transition-transform"/> Pay 25% to Book
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={20} /> Book a Visit
                </motion.button>

                {/* --- DESKTOP TRUST BADGE PLACEMENT --- */}
                <TrustBadge />
                
              </div>

              <p className="text-center text-xs text-slate-400 mt-4">
                Free cancellation within 24 hours of booking.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 lg:hidden z-40 flex items-center gap-3 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <motion.button 
           whileTap={{ scale: 0.95 }}
           onClick={() => setIsModalOpen(true)}
           className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold border border-slate-200 flex items-center justify-center gap-2"
        >
           <Phone size={18} /> Visit
        </motion.button>
        <motion.button 
           whileTap={{ scale: 0.95 }}
           onClick={() => setIsBookingOpen(true)}
           className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
           <CreditCard size={18} /> Book Now
        </motion.button>
      </div>

      <TenantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} room={room} />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} room={room} />
    </div>
  );
};

export default RoomDetail;