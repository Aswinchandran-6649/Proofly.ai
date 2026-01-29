import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileSearch, ArrowLeft, Home } from 'lucide-react';

const PageNotFound = ({ dark }) => {
  const navigate = useNavigate();

  return (
    <section className={`min-h-screen flex items-center justify-center px-6 overflow-hidden relative ${dark ? "bg-[#050505] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-0" />
      
      <div className="max-w-2xl w-full text-center relative z-10">
        
        {/* Animated Icon */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 mb-8"
        >
          <FileSearch size={48} className="text-blue-500" />
        </motion.div>

        {/* 404 Text */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-9xl font-black tracking-tighter mb-4 opacity-10"
        >
          404
        </motion.h1>

        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-black tracking-tight mb-6"
        >
          Lost in the <span className="text-blue-600">Vault?</span>
        </motion.h2>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 font-medium text-lg mb-10 max-w-md mx-auto leading-relaxed"
        >
          The page you are looking for doesn't exist or has been moved to a more secure location.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all border ${
              dark ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" : "bg-white border-slate-200 hover:bg-slate-100 text-slate-900"
            }`}
          >
            <ArrowLeft size={18} /> Go Back
          </button>

          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Home size={18} /> Return Home
          </button>
        </motion.div>
      </div>

      {/* Decorative Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">
        Proofly Secure Ecosystem
      </div>
    </section>
  );
};

export default PageNotFound;