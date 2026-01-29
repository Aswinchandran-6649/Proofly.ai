import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Calendar,
  Hourglass,
} from "lucide-react";
import { fetchWarrantiesAPI } from "../../services/allApi"; 
import { useNavigate } from "react-router-dom";

const MyWarranties = () => {
  const [allWarranties, setAllWarranties] = useState([]);
  const navigate = useNavigate();

  const getUserWarranties = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (userData && token) {
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      try {
        const result = await fetchWarrantiesAPI(userData._id, reqHeader);
        if (result.status === 200) {
          setAllWarranties(result.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      getUserWarranties();
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">My Warranties</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allWarranties.length > 0 ? (
          allWarranties.map((item) => {
            // --- UPDATED DYNAMIC LOGIC ---
            const expiryDate = new Date(item.warrantyExpiryDate);
            const today = new Date();
            // Calculate exact days remaining
            const diffTime = expiryDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let currentStatus = "ACTIVE";
            if (diffDays <= 0) {
              currentStatus = "EXPIRED";
            } else if (diffDays <= 30) {
              currentStatus = "EXPIRING";
            }

            return (
              <WarrantyCard 
                key={item._id} 
                id={item._id}
                product={Array.isArray(item.productName) ? item.productName[0] : item.productName}
                expiry={new Date(item.warrantyExpiryDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
                status={currentStatus} 
                daysLeft={diffDays} // Pass the countdown here
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">No warranties found in your account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const WarrantyCard = ({ id, product, expiry, status, daysLeft }) => {
  const navigate = useNavigate();
  
  const config = {
    ACTIVE: {
      bg: "bg-gradient-to-br from-green-500 to-emerald-600",
      badge: "bg-green-100 text-green-700",
      icon: <ShieldCheck size={14} />,
      label: "Active",
      textColor: "text-green-600"
    },
    EXPIRING: {
      bg: "bg-gradient-to-br from-yellow-400 to-orange-500",
      badge: "bg-yellow-100 text-yellow-800",
      icon: <ShieldAlert size={14} />,
      label: "Expiring Soon",
      textColor: "text-orange-600"
    },
    EXPIRED: {
      bg: "bg-gradient-to-br from-red-500 to-rose-600",
      badge: "bg-red-100 text-red-700",
      icon: <ShieldX size={14} />,
      label: "Expired",
      textColor: "text-red-600"
    },
  };

  const { bg, badge, icon, label, textColor } = config[status];

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className={`h-2 ${bg}`} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product}</h3>
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${badge}`}>
            {icon}
            {label}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar size={16} className="shrink-0" />
            <span>Expires: <span className="font-semibold text-gray-800">{expiry}</span></span>
          </div>

          {/* --- DAYS COUNTDOWN DISPLAY --- */}
          <div className={`flex items-center gap-2 text-sm font-medium ${status === 'EXPIRED' ? 'text-gray-400' : textColor}`}>
            <Hourglass size={16} className="shrink-0" />
            <span>
              {status === "EXPIRED" 
                ? "Protection Ended" 
                : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} remaining`}
            </span>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/user/warranty-details/${id}`)}
          className={`w-full py-2.5 rounded-xl text-white font-bold tracking-wide shadow-md active:scale-95 transition-all ${bg}`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default MyWarranties;

