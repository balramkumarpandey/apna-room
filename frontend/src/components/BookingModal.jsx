import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, CreditCard, Upload, Copy, Smartphone, Check, ShieldCheck, MapPin, MessageCircle } from 'lucide-react';
import api from '../api';

// --- CONFIGURATION ---
const MY_UPI_ID = "kpbalram810-1@okicici";
const MY_NAME = "ApnaRoom Business"; 
const QR_IMAGE_URL = "/my-qr-code.jpg"; 
const ADMIN_WHATSAPP = "9548484981";

const BookingModal = ({ isOpen, onClose, room }) => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('qr'); 
  const [formData, setFormData] = useState({ name: '', phone_number: '' });
  const [screenshot, setScreenshot] = useState(null);
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);

  // --- STRICT ₹99 FEE ---
  const visitFee = 99;

  // Mobile App Deep Link (Strictly set to 99)
  const upiDeepLink = `upi://pay?pa=${MY_UPI_ID}&pn=${encodeURIComponent(MY_NAME)}&am=${visitFee}&cu=INR`;

  const handleCopy = () => {
    navigator.clipboard.writeText(MY_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot) {
      alert("Please upload the payment screenshot.");
      return;
    }
    setStatus('submitting');
    
    try {
      // 1. Send data and screenshot to your backend
      const data = new FormData();
      data.append('name', `VISIT BOOKING: ${formData.name}`);
      data.append('phone_number', formData.phone_number);
      data.append('room', room.id);
      data.append('payment_screenshot', screenshot);

      await api.post('/api/inquire/tenant/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Construct the WhatsApp Message to notify YOU (The Admin)
      const roomLink = `https://www.apnaroom.co.in/rooms/${room.id}`;
      const message = `🚨 *NEW ₹99 VISIT BOOKING* 🚨
      
Hi ApnaRoom! I have paid ₹99.
Name: *${formData.name}*
Phone: *${formData.phone_number}*

🏠 *Room:* ${room.title}
📍 *Location:* ${room.colony_name}
🔗 ${roomLink}

Please send me the exact location and landlord details!`;

      // Open WhatsApp to send the message to Admin
      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Show Success State
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStep(1);
        setStatus('idle');
        setFormData({ name: '', phone_number: '' });
        setScreenshot(null);
      }, 4000);

    } catch (error) {
      console.error("Error submitting:", error);
      setStatus('error');
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-emerald-700 p-5 flex justify-between items-center text-white shrink-0">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-300" /> Book Room Visit
                </h2>
                <p className="text-emerald-100 text-xs mt-0.5">Get landlord details instantly</p>
              </div>
              <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition"><X size={20}/></button>
            </div>

            <div className="p-6 overflow-y-auto">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Payment Submitted!</h3>
                  <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
                    Redirecting you to WhatsApp to receive your landlord details and exact location.
                  </p>
                </div>
              ) : (
                <>
                  {/* PAYMENT */}
                  {step === 1 && (
                    <div className="space-y-6">

                      {/* --- TRUST BADGE --- */}
                      <div className="text-center border-b border-slate-100 pb-5">
                        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-bold border border-green-200 mb-3 shadow-sm uppercase tracking-wide">
                          <ShieldCheck size={16} className="text-green-600" /> 
                          100% Refund Guarantee
                        </div>
                        <p className="text-slate-600 text-sm px-2 leading-relaxed">
                          Pay a small token of <strong>₹99</strong> to get the owner's direct number and exact location. If you visit and don't like the room, it is <strong>fully refunded</strong>.
                        </p>
                      </div>
                      
                      {/* --- AMOUNT HIGHLIGHT --- */}
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total to Pay</p>
                        <h2 className="text-5xl font-extrabold text-slate-800">₹99</h2>
                      </div>

                      {/* Payment Tabs */}
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button 
                          onClick={() => setActiveTab('qr')}
                          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'qr' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Scan QR
                        </button>
                        <button 
                          onClick={() => setActiveTab('upi')}
                          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'upi' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          UPI ID
                        </button>
                      </div>

                      {/* QR View */}
                      {activeTab === 'qr' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-2">
                          <div className="p-3 bg-white border-2 border-dashed border-slate-300 rounded-xl mb-2">
                            <img src={QR_IMAGE_URL} alt="Payment QR" className="w-48 h-48 object-contain mix-blend-multiply" />
                          </div>
                          <p className="text-xs font-medium text-slate-400">Scan with GPay / PhonePe / Paytm</p>
                        </motion.div>
                      )}

                      {/* UPI View */}
                      {activeTab === 'upi' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-2">
                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between group cursor-pointer" onClick={handleCopy}>
                            <div className="overflow-hidden">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Copy UPI ID</p>
                              <p className="text-slate-800 font-mono font-medium truncate text-sm">{MY_UPI_ID}</p>
                            </div>
                            <div className={`p-2 rounded-lg transition ${copied ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 group-hover:text-blue-500 border border-slate-200'}`}>
                              {copied ? <Check size={18} /> : <Copy size={18} />}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <a href={upiDeepLink} className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold border border-indigo-100 hover:bg-indigo-100 transition text-sm shadow-sm">
                              <Smartphone size={16} /> Pay via App
                            </a>
                            <a href={upiDeepLink} className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100 hover:bg-blue-100 transition text-sm shadow-sm">
                              GPay / PhonePe
                            </a>
                          </div>
                        </motion.div>
                      )}

                      <button 
                        onClick={() => setStep(2)}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-xl shadow-slate-200/50 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                      >
                        I have paid ₹99
                      </button>
                    </div>
                  )}

                  {/* UPLOAD PROOF */}
                  {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="flex items-center gap-3 mb-6 text-emerald-900 bg-emerald-50 p-4 rounded-xl text-sm font-medium border border-emerald-200 shadow-inner">
                        <CheckCircle size={24} className="shrink-0 text-emerald-600" />
                        <div>
                            <span className="block font-bold text-base">Payment Done!</span>
                            <span className="text-emerald-700 text-xs">Upload the screenshot to instantly get the landlord's number on WhatsApp.</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Name</label>
                        <input required type="text" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-medium"
                          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Ex: Rahul Sharma"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          WhatsApp Number <MessageCircle size={14} className="text-emerald-500"/>
                        </label>
                        <input required type="tel" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-medium"
                          value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                          placeholder="Ex: 98765 43210"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">₹99 Payment Screenshot</label>
                        <div className="relative group">
                          <input 
                            required 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition cursor-pointer font-medium"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            {screenshot ? <CheckCircle size={20} className="text-emerald-500" /> : <Upload size={20} />}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition active:scale-[0.98]">
                          Back
                        </button>
                        <button disabled={status === 'submitting'} type="submit" className="flex-[2] py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center gap-2">
                          {status === 'submitting' ? 'Verifying...' : <>Get Details on WA <MessageCircle size={18} /></>}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;