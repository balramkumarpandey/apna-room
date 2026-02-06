import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarCheck, CheckCircle } from 'lucide-react';
import api from '../api';

const TenantModal = ({ isOpen, onClose, room }) => {
  const [formData, setFormData] = useState({ name: '', phone_number: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      // Send data including the Room ID
      await api.post('/api/inquire/tenant/', {
        ...formData,
        room: room.id
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', phone_number: '' });
      }, 3000);
    } catch (error) {
      console.error("Error submitting:", error);
      setStatus('error');
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
                  <p className="text-gray-500">We will call you shortly to schedule the tour.</p>
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
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex justify-center gap-2"
                  >
                    {status === 'submitting' ? 'Booking...' : <>Confirm Booking <CalendarCheck size={20} /></>}
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