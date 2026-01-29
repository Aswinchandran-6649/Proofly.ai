
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  Bell,
  User,
  LayoutDashboard,
  UploadCloud,
  ShieldCheck,
  Menu,
  X,
  
} from "lucide-react";

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // 'relative z-10' ensures the dashboard sits on top of any landing page elements
    <div className="flex h-screen bg-gray-50 overflow-hidden relative z-10">
      {/* SIDEBAR: Static on Desktop, Overlay on Mobile */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex-shrink-0
      `}
      >
        {/* Logo Section */}
        <div className="p-8 text-xl font-bold flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8  rounded-lg flex items-center justify-center">
              {/* <ShieldCheck size={20} className="text-white" /> */}
            </div>
            {/* <span className="tracking-tight">Proofly</span> */}
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          <NavItem
            to="/user/dashboard"
            end
            label="Dashboard"
            icon={<LayoutDashboard size={18} />}
            onClick={() => setIsSidebarOpen(false)}
          />
          <NavItem
            to="/user/upload"
            label="Upload Receipts"
            icon={<UploadCloud size={18} />}
            onClick={() => setIsSidebarOpen(false)}
          />
          <NavItem
            to="/user/warranties"
            label="My Warranties"
            icon={<ShieldCheck size={18} />}
            onClick={() => setIsSidebarOpen(false)}
          />
          <NavItem
            to="/user/profile"
            label="Profile"
            icon={<User size={18} />}
            onClick={() => setIsSidebarOpen(false)}
          />
        </nav>

        {/* Bottom Settings Link */}
        <div className="p-6 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity cursor-default">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white">
                Proofly
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                © 2025 All Rights Reserved
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          {/* Menu button shows only on mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="text-gray-500 font-medium hidden md:block uppercase tracking-wider text-xs">
            User Dashboard
          </div>

        </header>

        {/* This is where your Dashboard, Upload, and Warranties pages will render */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper NavItem Component
const NavItem = ({ to, label, icon, end, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
      ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default UserLayout;