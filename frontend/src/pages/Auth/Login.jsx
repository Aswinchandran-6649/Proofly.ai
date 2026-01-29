
import React, { useState, useContext, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Moon, Sun, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginAPI, registerAPI, googleLoginAPI } from "../../services/allApi";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(true);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Added only this: Clear input fields when switching between Login and Register
  useEffect(() => {
    setUserData({
      username: "",
      email: "",
      password: "",
    });
    setShowPassword(false);
  }, [isLogin]);

  // Fixed Theme (Standardized for a clean professional look)
  const theme = {
    bgGradient: "from-slate-900 via-slate-800 to-slate-900",
    button: "from-blue-600 to-indigo-700",
    text: "text-blue-500",
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Role is usually handled server-side for Google Login or defaults to 'user'
        const result = await googleLoginAPI({ 
          token: tokenResponse.access_token 
        });

        if (result.status === 200) {
          const { user: verifiedUser, token } = result.data;
          login(verifiedUser, token); 
          toast.success(`Welcome, ${verifiedUser.username}`);
          
          // Navigation based on Database Role
          if (verifiedUser.role === "admin") navigate("/admin/dashboard");
          else if (verifiedUser.role === "seller") navigate("/seller/dashboard");
          else navigate("/user/dashboard");
        }
      } catch (err) {
        toast.error("Google authentication failed.");
      }
    }
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    const { username, email, password } = userData;

    if (isLogin) {
      if (!email || !password) return toast.warning("Please fill all fields!");
      
      try {
        const result = await loginAPI({ email, password });

        if (result && result.status === 200) {
          const { user: verifiedUser, token } = result.data;
          login(verifiedUser, token);
          toast.success("Login Successful");
          
          
          const userRole = verifiedUser.role;
          if (userRole === "admin") navigate("/admin/dashboard");
          else if (userRole === "seller") navigate("/seller/dashboard");
          else navigate("/user/dashboard");
        } else {
          toast.error(result.data?.message || "Invalid Credentials");
        }
      } catch (error) {
        toast.error("An error occurred during login.");
      }
    } else {
      if (!username || !email || !password) return toast.warning("Please fill all fields!");
      
      try {
        // Defaults role to "user" for public registrations
        const result = await registerAPI({ username, email, password, role: "user" });
        
        if (result && (result.status === 201 || result.status === 200)) {
          toast.success("Registration successful! Please login.");
          setIsLogin(true);
        } else {
          toast.error(result.data?.message || "Registration failed.");
        }
      } catch (error) {
        toast.error("An error occurred during registration.");
      }
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center px-4 overflow-hidden transition-colors duration-700 ${dark ? "text-white" : "text-gray-800"}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${dark ? theme.bgGradient : "from-gray-100 to-gray-200"} transition-all duration-700`} />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`relative z-10 w-full max-w-5xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden border border-white/20 backdrop-blur-xl ${dark ? "bg-black/40" : "bg-white/60"}`}>
        
        {/* Left Side Branding */}
        <div className={`hidden md:flex w-5/12 p-12 flex-col justify-between relative text-white bg-gradient-to-br ${theme.button}`}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck size={32} />
              <span className="text-xl font-bold tracking-wide">Proofly</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">Secure <br/> <span className="text-white/70 italic">Everything.</span></h1>
            <p className="text-lg text-white/80 font-light">One portal for all your warranty protections.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            {/* <button onClick={() => setDark(!dark)} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20">
              {dark ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} />}
            </button> */}
          </div>

          {/* Login/Register Tabs */}
          <div className="flex mb-8 p-1 rounded-xl bg-white/5">
            {["Login", "Register"].map((tab) => (
              <button key={tab} onClick={() => setIsLogin(tab === "Login")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold relative transition-all ${ (isLogin && tab === "Login") || (!isLogin && tab === "Register") ? "text-white shadow-lg" : "text-gray-400 hover:text-gray-200"}`}>
                {(isLogin && tab === "Login") || (!isLogin && tab === "Register") ? <motion.div layoutId="tab-bg" className="absolute inset-0 rounded-lg bg-blue-600/20 border border-blue-500/30" /> : null}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="relative flex items-center border-2 rounded-xl bg-black/20 border-white/5 focus-within:border-blue-500/50 transition-all">
                <ShieldCheck size={20} className={`absolute left-4 ${theme.text}`} />
                <input type="text" placeholder="Full Name" value={userData.username} onChange={(e) => setUserData({...userData, username: e.target.value})} className="w-full py-4 pl-12 pr-4 bg-transparent outline-none" />
              </div>
            )}
            <div className="relative flex items-center border-2 rounded-xl bg-black/20 border-white/5 focus-within:border-blue-500/50 transition-all">
              <Mail size={20} className={`absolute left-4 ${theme.text}`} />
              <input type="email" placeholder="Email Address" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} className="w-full py-4 pl-12 pr-4 bg-transparent outline-none" />
            </div>
            <div className="relative flex items-center border-2 rounded-xl bg-black/20 border-white/5 focus-within:border-blue-500/50 transition-all">
              <Lock size={20} className={`absolute left-4 ${theme.text}`} />
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} className="w-full py-4 pl-12 pr-12 bg-transparent outline-none" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-400 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <button type="submit" className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${theme.button} flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20`}>
              {isLogin ? "Sign In" : "Register"} <ArrowRight size={18} />
            </button>
          </form>

          {/* GOOGLE SECTION */}
          <div className="flex items-center gap-4 my-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
          </div>

          <button 
            type="button" 
            onClick={() => googleLogin()}
            className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white active:scale-[0.98]"
          >
            <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />
            <span>Continue with Google</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;