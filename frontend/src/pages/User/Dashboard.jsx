import React, { useEffect, useState } from "react";
import {
  Clock,
  Package,
  AlertTriangle,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchWarrantiesAPI } from "../../services/allApi";

const Dashboard = () => {
  const [allWarranties, setAllWarranties] = useState([]);
  const navigate = useNavigate();

  const getUserWarranties = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (userData && token) {
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      alert("Session expired. Please login again.");
      navigate("/login");
    } else {
      getUserWarranties();
    }
  }, []);

  // --- DYNAMIC CALCULATIONS ---
  const totalProducts = allWarranties.length;
  const totalSpend = allWarranties.reduce(
    (acc, curr) => acc + (Number(curr.totalAmount) || 0),
    0
  );

  // Logic to find items expiring within the next 30 days
  const expiringSoonCount = allWarranties.filter((item) => {
    const expiryDate = new Date(item.warrantyExpiryDate);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Overview
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your digital assets and warranty protections.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/user/upload")} // Adjust route as needed
            className="px-5 py-2.5 bg-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </div>
      </div>

      {/* KPI Cards (Now using Dynamic Values) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <KPI
          title="Total Products"
          value={totalProducts.toString().padStart(2, "0")}
          icon={<Package size={26} />}
          theme="blue"
        />
        <KPI
          title="Expiring Soon"
          value={expiringSoonCount.toString().padStart(2, "0")}
          icon={<AlertTriangle size={26} />}
          theme="rose"
        />
        <KPI
          title="Total Spend"
          value={`$${totalSpend.toLocaleString()}`}
          icon={<CreditCard size={26} />}
          theme="emerald"
        />
      </div>

      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-6">
          Active Warranties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allWarranties.length > 0 ? (
            allWarranties.map((item) => {
              // Calculate status for each warranty
              const expiry = new Date(item.warrantyExpiryDate);
              const today = new Date();
              let status = "safe";
              if (expiry < today) status = "danger";
              else if ((expiry - today) / (1000 * 60 * 60 * 24) < 30)
                status = "near";

              // Inside allWarranties.map((item) => { ... })
              return (
                <Warranty
                  key={item._id}
                  title={
                    Array.isArray(item.productName)
                      ? item.productName[0]
                      : item.productName
                  }
                  date={new Date(item.warrantyExpiryDate).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                  purchaseDate={item.purchaseDate} // Pass this for the calculation
                  status={status}
                />
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                No Warranties Found
              </p>
              <p className="text-gray-500 mt-2">
                Upload a receipt to start tracking your assets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ... Keep your KPI and Warranty sub-components exactly as they were ...

const KPI = ({ title, value, icon, theme }) => {
  const styles = {
    blue: "from-blue-500 to-indigo-600 shadow-blue-100 text-blue-600 bg-blue-50",
    rose: "from-rose-500 to-orange-600 shadow-rose-100 text-rose-600 bg-rose-50",
    emerald:
      "from-emerald-400 to-teal-600 shadow-emerald-100 text-emerald-600 bg-emerald-50",
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative overflow-hidden bg-white p-8 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 group"
    >
      {/* Decorative Background Circle */}
      <div
        className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity bg-current ${
          styles[theme].split(" ")[3]
        }`}
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${styles[theme]
            .split(" ")
            .slice(0, 2)
            .join(" ")} flex items-center justify-center text-white shadow-xl`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {title}
          </p>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-4xl font-black text-gray-900">{value}</h3>
            <div
              className={`p-1.5 rounded-lg ${styles[theme].split(" ")[4]} ${
                styles[theme].split(" ")[3]
              }`}
            >
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Warranty = ({ title, date, status, purchaseDate }) => {
  const map = {
    safe: { color: "bg-blue-500", text: "text-blue-600", label: "Healthy" },
    near: { color: "bg-orange-400", text: "text-orange-600", label: "Warning" },
    danger: { color: "bg-rose-500", text: "text-rose-600", label: "Expired" },
  };

  const style = map[status];

  // --- DYNAMIC PERCENTAGE CALCULATION ---
  const calculateLifeLeft = () => {
    const expiry = new Date(date);
    const today = new Date();

    if (expiry < today) return 0; // Expired

    // If we have purchase date, we calculate real %
    // Otherwise, we show a default visual based on status
    if (purchaseDate) {
      const start = new Date(purchaseDate);
      const totalLife = expiry - start;
      const livedLife = today - start;
      const remaining = Math.max(0, 100 - (livedLife / totalLife) * 100);
      return Math.round(remaining);
    }

    // Fallback visual percentages if purchaseDate isn't available
    if (status === "safe") return 80;
    if (status === "near") return 25;
    return 0;
  };

  const lifeLeft = calculateLifeLeft();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
          <Package size={20} className="text-gray-400" />
        </div>
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
            style.text
          } ${style.color
            .replace("bg-", "border-")
            .replace("500", "200")
            .replace("400", "200")}`}
        >
          {style.label}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
        {title}
      </h3>
      <p className="text-sm text-gray-400 font-medium mb-8 flex items-center gap-2">
        <Clock size={14} /> {status === "danger" ? "Expired on" : "Expires"}{" "}
        {date}
      </p>

      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-gray-400">
          <span>Warranty Life</span>
          <span className={style.text}>{lifeLeft}% left</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${lifeLeft}%` }}
            className={`h-full rounded-full shadow-sm ${style.color}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
