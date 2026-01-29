import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ShieldCheck, ArrowRight, Zap, 
  Smartphone, LayoutDashboard, Sun, Moon, Menu, X 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const roleColors = {
  user: "from-indigo-500 via-purple-500 to-blue-500",
  seller: "from-emerald-500 via-teal-500 to-green-500",
  admin: "from-rose-500 via-red-500 to-orange-500",
};

export const Navbar = ({ dark, setDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b 
      ${dark ? "bg-black/20 border-white/10" : "bg-white/40 border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg shadow-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
            Proofly
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate("/features")} className={`text-sm font-medium hover:text-blue-500 transition-colors ${dark ? "text-gray-300" : "text-gray-600"}`}>Features</button>
          <button onClick={() => navigate("/working")} className={`text-sm font-medium hover:text-blue-500 transition-colors ${dark ? "text-gray-300" : "text-gray-600"}`}>How it woks</button>

 
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setDark(!dark)} className={`p-2 rounded-full transition-colors ${dark ? "bg-white/10 text-yellow-300" : "bg-gray-100 text-gray-600"}`}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => navigate("/login")}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-105 active:scale-95
            bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30`}>
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className={dark ? "text-white" : "text-black"} /> : <Menu className={dark ? "text-white" : "text-black"} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden absolute w-full p-6 border-b flex flex-col gap-4 shadow-xl backdrop-blur-xl ${dark ? "bg-gray-900/90 border-white/10 text-white" : "bg-white/90 border-gray-200 text-black"}`}>
          <button onClick={() => navigate("/features")} className="text-left text-lg font-medium">Features</button>
          <button onClick={() => navigate("/working")} className="text-left text-lg font-medium">Working</button>
          <button onClick={() => navigate("/Contact")} className="text-left text-lg font-medium">Contact</button>
          <button onClick={() => navigate("/terms")} className="text-left text-lg font-medium">Terms&condition</button>
          <button onClick={() => navigate("/login")} className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold">Login</button>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ dark }) => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div style={{ y: y1, x: -50 }} className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px] mix-blend-screen" />
      <motion.div style={{ y: y2, x: 50 }} className="absolute top-40 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md cursor-pointer"
          onClick={() => navigate("/login")}
        >
          
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8 ${dark ? "text-white" : "text-gray-900"}`}
        >
          Your Purchase, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">
             Forever Verified.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto ${dark ? "text-gray-400" : "text-gray-600"}`}
        >
Proofly builds a secure digital bridge between you and verified retailers for instant, immutable warranty protection.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button 
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1">
            Create Free Account
          </button>
          <button 
            onClick={() => navigate("/login")}
            >
           
          </button>
        </motion.div>
      </div>
    </section>
    
  );
};





const CTA = ({ dark }) => {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-6">
      <div className={`max-w-5xl mx-auto rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden
        ${dark ? "bg-gray-900 border border-white/10" : "bg-indigo-900"}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Go Paperless?</h2>
          <button 
            onClick={() => navigate("/login")}
            className="bg-white text-indigo-900 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 mx-auto">
            Get Started Now <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export const Footer = ({ dark }) => {
  const navigate = useNavigate();
  return (
    <footer className={`py-12 px-6 border-t ${dark ? "bg-black border-white/10 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <ShieldCheck className="text-blue-500" />
          <span className={`font-bold text-lg ${dark ? "text-white" : "text-gray-900"}`}>Proofly</span>
        </div>
        <div className="flex gap-8 text-sm font-medium">
          <button onClick={() => navigate("/terms")} className="hover:text-blue-500 transition-colors">Privacy</button>
          <button onClick={() => navigate("/terms")} className="hover:text-blue-500 transition-colors">Terms</button>
          <button onClick={() => navigate("/contact")} className="hover:text-blue-500 transition-colors">Contact</button>
        </div>
        <p className="text-sm">© 2025 Proofly Inc.</p>
      </div>
    </footer>
  );
};

const Home = () => {
  const [dark, setDark] = useState(true);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${dark ? "bg-black" : "bg-white"}`}>
      <Navbar dark={dark} setDark={setDark} />
      <Hero dark={dark} />
      <CTA dark={dark} />
      <Footer dark={dark} />
    </div>
  );
};

export default Home;