import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';
import api from '../api';

const LandlordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', phone_number: '', address: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      // Send data to Django Backend
      await api.post('/api/inquire/landlord/', formData);
      setStatus('success');
      // Reset form after 2 seconds and close
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', phone_number: '', address: '' });
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
          {/* Dark Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">List Your Property</h2>
              <button onClick={onClose} className="hover:bg-emerald-700 p-1 rounded-full transition">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-8 text-emerald-600">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Details Sent!</h3>
                  <p className="text-gray-500">We will contact you shortly to verify your room.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-gray-600 text-sm mb-4">
                    Enter your details below. We will call you to visit and take photos of your room.
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input 
                      autoFocus
                      required
                      type="text"
                      className="w-full p-3 border border-gray-300 text-gray-900 bg-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. Raj Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      className="w-full p-3 border border-gray-300 text-gray-900 bg-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. 98765 43210"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                    <textarea 
                      required
                      rows="3"
                      className="w-full p-3 border border-gray-300 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. House No. 12, Civil Lines, Near Park..."
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                  )}

                  <button 
                    disabled={status === 'submitting'}
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {status === 'submitting' ? 'Sending...' : <>Submit Details <Send size={18} /></>}
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

export default LandlordModal;