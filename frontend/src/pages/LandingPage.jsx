import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Home, Key, CheckCircle, Heart, Coffee } from 'lucide-react'; // Added Heart & Coffee for warmth

import LandlordModal from '../components/LandlordModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden font-sans text-white">
      
      {/* Decorative Background Blobs - Warm colors added to the blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center p-6 md:px-12">
        <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
          {/* Changed Icon to Home with Heart for emotion */}
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <Home className="w-6 h-6 text-blue-300 fill-blue-300/20" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
            ApnaRoom
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-10 pb-20 text-center min-h-[80vh]">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Hero Text */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-medium mb-4 backdrop-blur-md">
              Ghar Se Door? Par Ghar Jaisa. 🏠
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-white to-blue-100 leading-tight">
              Don't just rent a room. <br />
              Find your <span className="text-blue-400">ApnaRoom</span>.
            </h1>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-blue-200/80 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Moving to a new city is hard; finding a safe space shouldn't be. 
            We connect you with homes that offer warmth, safety, and a place to truly belong.
          </motion.p>

          {/* Action Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto px-4">
            
            {/* Card 1: Tenant (Emotional Angle: Seeking Safety/Comfort) */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/rooms')}
              className="cursor-pointer group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-left transition-all hover:bg-white/10 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300">
                <Coffee className="w-7 h-7 text-blue-200 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">I Want A Room</h3>
              <p className="text-blue-200/70 text-sm mb-6">
                I'm new here and looking for a safe, cozy corner to settle in. Show me places where I can be myself.
              </p>
              <div className="flex items-center text-blue-300 group-hover:text-white transition-colors font-medium">
                Start my search <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>

            {/* Card 2: Landlord (Emotional Angle: Sharing/Trust) */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-left transition-all hover:bg-white/10 hover:border-pink-400/30 hover:shadow-2xl hover:shadow-pink-500/10"
            >
              <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:from-pink-500 group-hover:to-rose-500 transition-all duration-300">
                <Heart className="w-7 h-7 text-pink-200 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">I Have A Room</h3>
              <p className="text-blue-200/70 text-sm mb-6">
                I have extra space and would love to welcome a verified tenant who will treat my house like their own.
              </p>
              <div className="flex items-center text-pink-300 group-hover:text-white transition-colors font-medium">
                List my space <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </main>

      {/* Footer/Trust Indicators */}
      <footer className="absolute bottom-0 w-full p-6 text-center text-blue-300/40 text-sm">
        <div className="flex justify-center gap-6 mb-3">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> Verified Families</span>
          <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-pink-400" /> Zero Brokerage</span>
        </div>
        Made with ❤️ for everyone away from home.
      </footer>

      {/* Landlord Modal */}
      <LandlordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default LandingPage;