// import React, { useState, useContext } from "react";
// import { 
//   ShieldCheck, Sun, Moon, Menu, X, User, LogOut, 
//   LayoutDashboard, UploadCloud, FileText, 
//   Users, Store, BarChart3, Clock, CheckCircle 
// } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";

// const SERVER_URL = "http://localhost:5000";

// const Navbar = ({ dark, setDark }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useContext(AuthContext); 

//   // Detect current panel context
//   const isAdmin = location.pathname.startsWith("/admin");
//   const isSeller = location.pathname.startsWith("/seller");
//   const isUser = location.pathname.startsWith("/user") || location.pathname.startsWith("/dashboard");

//   const handleLogout = () => {
//     logout();
//     setIsOpen(false);
//     navigate("/");
//   };

//   return (
//     <nav className={`fixed top-0 w-full z-[100] backdrop-blur-md border-b transition-all duration-300
//       ${dark ? "bg-black/40 border-white/10" : "bg-white/60 border-gray-200"}`}>
      
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//         {/* Logo */}
//         <Link to={"/"} className="flex items-center gap-2 cursor-pointer">
//           <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
//             <ShieldCheck className="text-white" size={24} />
//           </div>
//           <span className={`text-xl font-black ${dark ? "text-white" : "text-gray-900"}`}><span className="text-yellow-400">Pr</span>oofly</span>
//         </Link>

//         {/* Desktop Navigation (Hidden on Dashboard/Admin/Seller) */}
//         {(!isAdmin && !isSeller && !isUser) && (
//           <div className="hidden md:flex items-center gap-8">
//             <Link to="/features" className={`text-sm font-bold ${dark ? "text-gray-400" : "text-gray-500"}`}>Features</Link>
//             <Link to="/working" className={`text-sm font-bold ${dark ? "text-gray-400" : "text-gray-500"}`}>How it works</Link>
//           </div>
//         )}

//         {/* Right Actions */}
//         <div className="hidden md:flex items-center gap-5">
//           <button onClick={() => setDark(!dark)} className={`p-2 rounded-full transition-colors ${dark ? "bg-white/10 text-yellow-300" : "bg-gray-100 text-gray-600"}`}>
//             {dark ? <Sun size={20}/> : <Moon size={20}/>}
//           </button>

//           {user ? (
//             <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
//               <div className="flex items-center gap-3">
//                 {/* Dynamically updated username */}
//                 <span className={`text-sm font-bold hidden lg:block ${dark ? "text-white" : "text-gray-900"}`}>
//                   {user.username}
//                 </span>
//                 {/* Dynamically updated profile picture */}
//                 <img 
//                   src={user.profilePic ? `${SERVER_URL}/uploads/${user.profilePic}` : `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`} 
//                   className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover" 
//                   alt="User" 
//                 />
//               </div>
//               <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition-colors">
//                 <LogOut size={20} />
//               </button>
//             </div>
//           ) : (
//             <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold">Get Started</Link>
//           )}
//         </div>

//         {/* Mobile Toggle */}
//         <button className={`md:hidden p-2 ${dark ? "text-white" : "text-gray-900"}`} onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* DYNAMIC MOBILE MENU (FULLY RESTORED) */}
//       {isOpen && (
//         <div className={`md:hidden absolute w-full p-6 flex flex-col gap-4 shadow-2xl animate-slideDown ${dark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
//           {!user ? (
//             <>
//               <Link to="/features" onClick={() => setIsOpen(false)}>Features</Link>
//               <Link to="/working" onClick={() => setIsOpen(false)}>How it works</Link>
//               <Link to="/login" className="p-3 bg-blue-600 text-white rounded-xl text-center font-bold" onClick={() => setIsOpen(false)}>Login</Link>
//             </>
//           ) : (
//             <div className="flex flex-col gap-2">
              
//               {/* User Identity Section for Mobile */}
//               <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 dark:bg-white/5 rounded-2xl">
//                 <img 
//                   src={user.profilePic ? `${SERVER_URL}/uploads/${user.profilePic}` : `https://ui-avatars.com/api/?name=${user.username}`} 
//                   className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover" 
//                   alt="User" 
//                 />
//                 <div>
//                   <p className="font-bold">{user.username}</p>
//                   <p className="text-[10px] uppercase tracking-widest text-blue-500 font-black">Online</p>
//                 </div>
//               </div>

//               {/* 1. ADMIN MOBILE LINKS */}
//               {isAdmin && (
//                 <>
//                   <p className="text-[10px] font-bold text-red-500 uppercase px-2 tracking-widest">Admin Panel</p>
//                   <MobileNavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsOpen(false)} />
//                   <MobileNavLink to="/admin/users" icon={<Users size={18} />} label="Users" onClick={() => setIsOpen(false)} />
//                   <MobileNavLink to="/admin/sellers" icon={<Store size={18} />} label="Sellers" onClick={() => setIsOpen(false)} />
//                   <MobileNavLink to="/admin/analytics" icon={<BarChart3 size={18} />} label="Analytics" onClick={() => setIsOpen(false)} />
//                 </>
//               )}

//               {/* 2. SELLER MOBILE LINKS */}
//               {isSeller && (
//                 <>
//                   <p className="text-[10px] font-bold text-green-500 uppercase px-2 tracking-widest">Seller Panel</p>
//                   <MobileNavLink to="/seller/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsOpen(false)} />
//                   <MobileNavLink to="/seller/pending" icon={<Clock size={18} />} label="Pending" onClick={() => setIsOpen(false)} />
//                   <MobileNavLink to="/seller/verified" icon={<CheckCircle size={18} />} label="Verified" onClick={() => setIsOpen(false)} />
//                 </>
//               )}

//               {/* 3. USER MOBILE LINKS */}
//               {isUser && (
//                 <>
//                   <p className="text-[10px] font-bold text-blue-500 uppercase px-2 tracking-widest">User Menu</p>
//                   <MobileNavLink to="/user/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsOpen(false)} />
//                   <MobileNavLink to="/user/upload" icon={<UploadCloud size={18} />} label="Upload Receipts" onClick={() => setIsOpen(false)} />
//                   <MobileNavLink to="/user/warranties" icon={<FileText size={18} />} label="My Warranties" onClick={() => setIsOpen(false)} />
//                   <MobileNavLink to="/user/profile" icon={<User size={18} />} label="Profile" onClick={() => setIsOpen(false)} />
//                 </>
//               )}

//               <hr className="my-2 border-gray-200 dark:border-white/10" />
//               <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors">
//                 <LogOut size={18} /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// const MobileNavLink = ({ to, icon, label, onClick }) => (
//   <Link to={to} onClick={onClick} className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-white/5 rounded-xl font-semibold transition-colors">
//     {icon} {label}
//   </Link>
// );

// export default Navbar;
import React, { useState, useContext, useEffect } from "react";
import { 
  ShieldCheck, Menu, X, User, LogOut, 
  LayoutDashboard, UploadCloud, FileText, 
  Users, Store, Clock, CheckCircle,
  Bell,
  XCircle ,UserPlus
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const SERVER_URL = "http://localhost:5000";

const Navbar = ({ dark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  const [showNotifications, setShowNotifications] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext); 

  const isAdmin = location.pathname.startsWith("/admin");
  const isSeller = location.pathname.startsWith("/seller");
  const isUser = location.pathname.startsWith("/user") || location.pathname.startsWith("/dashboard");

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (user?._id && token && !isAdmin && !isSeller) {
        try {
          const reqHeader = {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          };
          const res = await axios.get(`${SERVER_URL}/api/notifications/${user._id}`, reqHeader);
          setNotifications(res.data);
        } catch (err) {
          console.error("Error fetching notifications", err);
        }
    }
  };

  const handleToggleNotifications = async () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);

    if (nextState && unreadCount > 0) {
      try {
        const token = localStorage.getItem("token");
        const reqHeader = {
            headers: { "Authorization": `Bearer ${token}` }
        };
        await axios.put(`${SERVER_URL}/api/notifications/read/${user._id}`, {}, reqHeader);
        fetchNotifications();
      } catch (err) {
        console.error("Error marking notifications as read", err);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    window.addEventListener("refreshNotifications", fetchNotifications);
    const interval = setInterval(() => {
        if (!isAdmin && !isSeller) fetchNotifications();
    }, 60000);

    return () => {
        clearInterval(interval);
        window.removeEventListener("refreshNotifications", fetchNotifications);
    };
  }, [user, location.pathname]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] backdrop-blur-md border-b transition-all duration-300
      ${dark ? "bg-black/80 border-white/10" : "bg-[#0a0f18]/95 border-white/10 shadow-lg"}`}>
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="flex items-center gap-2 cursor-pointer">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-white"><span className="text-yellow-400">Pr</span>oofly</span>
        </Link>

        {/* Desktop Navigation Links */}
        {(!isAdmin && !isSeller && !isUser) && (
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link to="/working" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">How it works</Link>
          </div>
        )}

        {/* Right Actions Container */}
        <div className="flex items-center gap-3 md:gap-6">
          {user ? (
            <>
              {/* --- NOTIFICATION BELL --- */}
              {(!isAdmin && !isSeller) && (
                <div className="relative pt-1">
                  <button 
                    onClick={handleToggleNotifications} 
                    className="relative cursor-pointer group focus:outline-none p-2"
                  >
                    <Bell size={22} className={unreadCount > 0 ? "text-blue-400" : "text-gray-300"} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#0a0f18] animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* DROPDOWN MENU */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-72 md:w-80 bg-[#111827] border border-white/10 rounded-xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-white font-bold text-sm">Notifications</h3>
                        <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Recent</span>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="mx-auto text-gray-700 mb-2" size={24} />
                            <p className="text-gray-500 text-xs italic">No new notifications</p>
                          </div>
                        ) : (
                          notifications.map((note) => (
                            <div key={note._id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 ${!note.isRead ? 'bg-blue-500/5' : ''}`}>
                              <div className="mt-0.5 flex-shrink-0">
                                {note.message?.toLowerCase().includes("approved") ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : note.message?.toLowerCase().includes("rejected") ? (
                                  <XCircle size={16} className="text-red-500" />
                                ) : (
                                  <Clock size={16} className="text-blue-400" />
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <p className="text-gray-200 text-[11px] leading-relaxed font-medium">{note.message}</p>
                                <span className="text-[9px] text-gray-500 mt-2 block font-bold uppercase">
                                  {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <Link 
                        to="/user/notifications" 
                        onClick={() => setShowNotifications(false)}
                        className="block p-3 text-center text-[10px] text-blue-400 font-black uppercase tracking-tighter hover:bg-white/5 transition-colors border-t border-white/10"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Desktop User Profile */}
              <div className="hidden md:flex items-center gap-5">
                <div className="flex items-center gap-3 pr-5 border-r border-white/10">
                  <span className="text-sm font-bold hidden lg:block text-white uppercase tracking-tight">
                    {user.username}
                  </span>
                  <img 
                    src={
                      (isAdmin || isSeller) 
                        ? `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`
                        : (user.profilePic ? `${SERVER_URL}/uploads/${user.profilePic}` : `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`)
                    } 
                    className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover shadow-md" 
                    alt="User" 
                  />
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors font-bold text-sm group"
                >
                  <span className="hidden sm:block">Logout</span>
                  <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="hidden md:block px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
              Get Started
            </Link>
          )}

          <button className="md:hidden p-2 text-white ml-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute w-full p-6 flex flex-col gap-4 shadow-2xl animate-slideDown bg-[#0a0f18] text-white border-t border-white/5">
          {!user ? (
            <>
              <Link to="/features" className="py-2" onClick={() => setIsOpen(false)}>Features</Link>
              <Link to="/working" className="py-2" onClick={() => setIsOpen(false)}>How it works</Link>
              <Link to="/login" className="p-3 bg-blue-600 text-white rounded-xl text-center font-bold" onClick={() => setIsOpen(false)}>Login</Link>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 mb-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <img 
                  src={
                    (isAdmin || isSeller)
                      ? `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`
                      : (user.profilePic ? `${SERVER_URL}/uploads/${user.profilePic}` : `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`)
                  } 
                  className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover" 
                  alt="User" 
                />
                <div className="flex-1">
                  <p className="font-bold text-white text-lg leading-none mb-1">{user.username}</p>
                  <p className="text-[10px] uppercase tracking-widest text-blue-400 font-black">Portal Online</p>
                </div>
              </div>

              {isAdmin && (
                <div className="mb-2">
                  <p className="text-[10px] font-bold text-red-500 uppercase px-2 tracking-widest opacity-60 mb-1">Admin Panel</p>
                  <MobileNavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/admin/users" icon={<Users size={18} />} label="Users" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/admin/sellers" icon={<Store size={18} />} label="Sellers" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/admin/addseller" icon={<UserPlus size={18} />} label="Add-sellers" onClick={() => setIsOpen(false)} />
                </div>
              )}

              {isSeller && (
                <div className="mb-2">
                  <p className="text-[10px] font-bold text-green-500 uppercase px-2 tracking-widest opacity-60 mb-1">Seller Panel</p>
                  <MobileNavLink to="/seller/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/seller/pending" icon={<Clock size={18} />} label="Pending" onClick={() => setIsOpen(false)} />
                </div>
              )}

              {isUser && (
                <div className="mb-2">
                  <p className="text-[10px] font-bold text-blue-400 uppercase px-2 tracking-widest opacity-60 mb-1">User Menu</p>
                  <MobileNavLink to="/user/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/user/upload" icon={<UploadCloud size={18} />} label="Upload Receipts" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/user/warranties" icon={<FileText size={18} />} label="My Warranties" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/user/profile" icon={<User size={18} />} label="Profile" onClick={() => setIsOpen(false)} />
                </div>
              )}

              <hr className="my-2 border-white/10" />
              <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-red-400 font-bold hover:bg-red-400/10 rounded-xl transition-all text-left w-full">
                <LogOut size={18} /> Logout Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

const MobileNavLink = ({ to, icon, label, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl font-semibold transition-colors text-gray-200">
    <span className="text-blue-400">{icon}</span> {label}
  </Link>
);

export default Navbar;