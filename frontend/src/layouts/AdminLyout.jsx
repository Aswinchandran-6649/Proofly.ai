import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, Users, Store, BarChart3, Menu, X, UserPlus, Bell } from "lucide-react";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative z-10">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex-shrink-0
      `}>
        {/* Top Header */}
        <div className="p-8 text-xl font-bold flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="tracking-tight text-lg">Admin Panel</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          <AdminNavItem to="/admin/dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} onClick={() => setIsSidebarOpen(false)} />
          <AdminNavItem to="/admin/users" label="User Management" icon={<Users size={18} />} onClick={() => setIsSidebarOpen(false)} />
          <AdminNavItem to="/admin/sellers" label="Seller Management" icon={<Store size={18} />} onClick={() => setIsSidebarOpen(false)} />
          <AdminNavItem to="/admin/analytics" label="Analytics" icon={<BarChart3 size={18} />} onClick={() => setIsSidebarOpen(false)} />
          <AdminNavItem to="/admin/addseller" label="Add-seller" icon={<UserPlus size={18} />} onClick={() => setIsSidebarOpen(false)} />
        </nav>

        {/* BOTTOM DIV: PROOFLY BRANDING */}
        <div className="p-6 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity cursor-default">
            <div className="w-8 h-8  rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white">Proofly</span>
              <span className="text-[10px] text-gray-500 font-medium">Admin Control</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden">
            <Menu size={24} />
          </button>

          <div className="text-gray-500 font-medium hidden md:block uppercase tracking-wider text-[10px]">
             System Administrator Mode
          </div>


        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable NavItem Component
const AdminNavItem = ({ to, label, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
      ${isActive ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default AdminLayout;

