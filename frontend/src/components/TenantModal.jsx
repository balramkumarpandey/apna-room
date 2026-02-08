import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarCheck, CheckCircle } from 'lucide-react';
import api from '../api';

const TenantModal = ({ isOpen, onClose, room }) => {
  const [formData, setFormData] = useState({ name: '', phone_number: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // 1. Save to Database
      // We must send 'room: room.id' so the backend knows which room it is
      await api.post('/api/inquire/tenant/', {
        ...formData,
        room: room.id
      });

      // 2. Auto-Open WhatsApp with Room Link
      // (Added '91' for India country code to ensure the link works universally)
      const myNumber = "9195484981"; 
      const roomLink = `https://www.apnaroom.co.in/rooms/${room.id}`;
      
      const message = `Hi ApnaRoom! 👋
I am *${formData.name}*.
I just booked a visit for: *${room.title}* in ${room.colony_name}.

🔗 Room Link: ${roomLink}

Please send me the location!`;

      // Create and Open WhatsApp URL
      const whatsappUrl = `https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // 3. Show Success Message
      setStatus('success');
      
      // 4. Close Modal after 2 seconds
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', phone_number: '' });
      }, 2000);

    } catch (error) {
      console.error("Error submitting:", error);
      setStatus('error');
      alert("Something went wrong. Please check your connection.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold">Book a Visit</h2>
                <p className="text-blue-100 text-sm">for {room?.title}</p>
              </div>
              <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full"><X /></button>
            </div>

            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-8 text-green-600">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Request Sent!</h3>
                  <p className="text-gray-500 mt-2">Check your WhatsApp to continue.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                    <input 
                      autoFocus
                      required type="text" placeholder="e.g. Amit Singh"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                    <input 
                      required type="tel" placeholder="e.g. 98765 43210"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    />
                  </div>
                  
                  <button 
                    disabled={status === 'submitting'}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex justify-center gap-2 items-center"
                  >
                    {status === 'submitting' ? 'Opening WhatsApp...' : <>Confirm Booking <CalendarCheck size={20} /></>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TenantModal;