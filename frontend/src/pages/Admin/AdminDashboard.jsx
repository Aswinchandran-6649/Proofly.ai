import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChartBox from "../../components/Admin/ChartBox";
import { getAdminStatsAPI } from "../../services/allApi";
import { Users, Store, Clock, RefreshCw, ArrowUpRight } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    pending: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setIsRefreshing(true);
    const token = localStorage.getItem("token"); 
    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      try {
        const result = await getAdminStatsAPI(reqHeader);
        if (result.status === 200) {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        // Subtle delay for visual feedback
        setTimeout(() => setIsRefreshing(false), 600);
      }
    }
  };

  const metrics = [
    { 
      label: "Total Users", 
      value: stats.totalUsers, 
      color: "text-cyan-400", 
      glow: "bg-cyan-500/10", 
      icon: <Users size={20} className="text-cyan-400" />,
      description: "Registered customers",
      path: "/admin/users" 
    },
    { 
      label: "Total Sellers", 
      value: stats.totalSellers, 
      color: "text-purple-400", 
      glow: "bg-purple-500/10", 
      icon: <Store size={20} className="text-purple-400" />,
      description: "Active retail partners",
      path: "/admin/sellers" 
    },

  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-12 space-y-10 pt-28 ">
      
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">System Live</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Admin <span className="text-blue-600">Overview</span>
          </h1>
        </div>
        
        <button 
          onClick={fetchDashboardStats}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-6 py-3 rounded-2xl text-sm font-bold transition-all border border-slate-800 shadow-xl disabled:opacity-50"
        >
          <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''} text-blue-500`} />
          {isRefreshing ? "Updating..." : "Refresh Data"}
        </button>
      </header>

      {/* Stats Cards Section - Navigatable */}
{/* Stats Cards Section - Stretching to 50/50 and matching Chart width */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-10">
  {metrics.map((m, i) => (
    <div 
      key={i}
      onClick={() => navigate(m.path)}
      className="bg-[#0f172a] border border-slate-800/60 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/50 cursor-pointer transition-all duration-300 shadow-2xl w-full flex flex-col justify-between min-h-[260px]"
    >
      {/* Background Ambient Glow */}
      <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${m.glow}`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
          {React.cloneElement(m.icon, { size: 28 })}
        </div>
        <div className="flex items-center gap-1 text-slate-500 group-hover:text-blue-400 transition-colors font-bold text-xs uppercase tracking-widest">
          Manage <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mb-3">{m.label}</p>
        <div className="flex items-baseline gap-2">
          <span className={`text-7xl font-black ${m.color} tracking-tighter`}>
            {m.value.toLocaleString()}
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-6 font-medium opacity-80">{m.description}</p>
      </div>
    </div>
  ))}
</section>

      {/* Analytics Section - Full Width Chart */}
      <div className="w-full bg-[#0f172a] border border-slate-800/60 rounded-3xl p-6 shadow-2xl">
          <ChartBox />
      </div>
    </div>
  );
};

export default AdminDashboard;