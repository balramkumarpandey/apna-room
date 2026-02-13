import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarCheck, CheckCircle, MessageCircle } from 'lucide-react'; 
import api from '../api';

const TenantModal = ({ isOpen, onClose, room }) => {
  const [formData, setFormData] = useState({ name: '', phone_number: '' });
  const [status, setStatus] = useState('idle'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // 1. Save Lead to Database (Backend)
      await api.post('/api/inquire/tenant/', {
        ...formData,
        room: room.id
      });

      // Construct the WhatsApp Message
      const myNumber = "9548484981"; // ApnaRoom's WhatsApp Number
      const roomLink = `https://www.apnaroom.co.in/rooms/${room.id}`;
      
      // \n creates a new line in WhatsApp
      const message = `Hi ApnaRoom! 👋
I am *${formData.name}*
My Phone: *${formData.phone_number}*

I want to visit this room:
🏠 *${room.title}*
📍 *${room.colony_name}*

🔗 Link: ${roomLink}`;

      // Open WhatsApp
      // encodeURIComponent ensures special characters (like & or ?) don't break the link
      const whatsappUrl = `https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // 4. Success State
      setStatus('success');
      
      // 5. Auto Close
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', phone_number: '' });
      }, 2000);

    } catch (error) {
      console.error("Error submitting:", error);
      setStatus('error');
      alert("Connection error. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-center text-white">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarCheck size={20} /> Book a Visit
              </h2>
              <p className="text-blue-100 text-xs mt-1">for {room?.title}</p>
            </div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Request Sent!</h3>
                <p className="text-gray-500 mt-2 text-sm">Redirecting to WhatsApp...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Your Name</label>
                  <input 
                    autoFocus
                    required 
                    type="text" 
                    placeholder="e.g. Amit Singh"
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-800"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {/* WhatsApp Number Input */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    <MessageCircle size={14} className="text-green-600 fill-green-600" /> 
                    WhatsApp Number
                  </label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="e.g. 98765 43210"
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-gray-800"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-400 mt-2 flex items-start gap-1">
                    ℹ️ <span className="leading-tight">We will send the <strong>Location Pin</strong> to this number.</span>
                  </p>
                </div>
                
                <button 
                  disabled={status === 'submitting'}
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 flex justify-center gap-2 items-center"
                >
                  {status === 'submitting' ? (
                      <span className="flex items-center gap-2">Processing...</span>
                  ) : (
                      <>Get Location on WhatsApp <MessageCircle size={20} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TenantModal;