import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, LayoutDashboard, Store, Link } from "lucide-react";
import { getSellerWarrantiesAPI } from "../../services/allApi";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate()
  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    const sellerShopName = user?.storeName || user?.username;

    if (token && sellerShopName) {
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      try {
        const result = await getSellerWarrantiesAPI(sellerShopName, reqHeader);
        if (result.status === 200) {
          const myData = result.data;
          setCounts({
            pending: myData.filter(w => w.status === "Pending").length,
            approved: myData.filter(w => w.status === "Approved").length,
            rejected: myData.filter(w => w.status === "Rejected").length,
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const stats = [
    { label: "Awaiting Action", sub: "Pending verification", value: counts.pending, color: "text-amber-600 bg-amber-50", icon: Clock },
    { label: "Total Approved", sub: "Successfully verified", value: counts.approved, color: "text-emerald-600 bg-emerald-50", icon: CheckCircle },
    { label: "Total Rejected", sub: "Declined requests", value: counts.rejected, color: "text-rose-600 bg-rose-50", icon: XCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-12">
      {/* Centered Container for Big Screens */}
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <LayoutDashboard size={20} className="text-indigo-600" />
               <h1 className="text-3xl font-black text-gray-900 tracking-tight">Store Overview</h1>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
                <Store size={16} />
                <p className="text-sm font-medium">
                   Managing: <span className="text-gray-900 font-bold">{user?.username
 || "Your Store"}</span>
                </p>
            </div>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 border border-gray-100 group">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-6 transition-colors ${s.color}`}>
                  <Icon size={28} />
                </div>
                
                <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{s.label}</p>
                    <p className="text-sm text-gray-400 font-medium group-hover:text-gray-500">{s.sub}</p>
                </div>
                
                <div className="mt-6 flex items-baseline gap-2">
                    <p className="text-5xl font-black text-gray-900">{s.value}</p>
                    <span className="text-gray-300 text-sm font-bold uppercase">claims</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Footer/Hint */}
        <div className="mt-12 p-8 rounded-[2rem] bg-indigo-900 text-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-200">
           <div className="text-center md:text-left">
              <h3 className="text-xl font-bold">Ready to process claims?</h3>
              <p className="text-indigo-300 text-sm">Head over to the Verification Queue to start scanning.</p>
           </div>

             <button onClick={()=>navigate('/seller/pending')} className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                Open Verification Queue
             </button>

        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
