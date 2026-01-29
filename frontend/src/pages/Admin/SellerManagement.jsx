// import React, { useEffect, useState } from "react";
// import { Trash2, CheckCircle, XCircle, Search, Mail, UserCheck } from "lucide-react";
// import { getAllSellersAPI, verifySellerAPI, deleteSellerAPI } from "../../services/allApi";
// import { toast } from "react-toastify";

// const SellerManagement = () => {
//   const [sellers, setSellers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

//   // Responsive logic to prevent double-viewing
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 1024);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchSellers = async () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const reqHeader = { Authorization: `Bearer ${token}` };
//       try {
//         const result = await getAllSellersAPI(reqHeader);
//         if (result.status === 200) setSellers(result.data);
//       } catch (err) {
//         toast.error("Failed to load seller ecosystem");
//       }
//     }
//   };

//   useEffect(() => { fetchSellers(); }, []);

//   const handleVerifyToggle = async (id, currentStatus) => {
//     const token = localStorage.getItem("token");
//     const reqHeader = { Authorization: `Bearer ${token}` };
//     const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";
//     try {
//       const result = await verifySellerAPI(id, { status: newStatus }, reqHeader);
//       if (result.status === 200) {
//         toast.success(`Seller is now ${newStatus}`);
//         fetchSellers();
//       }
//     } catch (err) { toast.error("Status update failed"); }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to remove this seller? This action cannot be undone.")) {
//       const token = localStorage.getItem("token");
//       const reqHeader = { Authorization: `Bearer ${token}` };
//       try {
//         const result = await deleteSellerAPI(id, reqHeader);
//         if (result.status === 200) {
//           toast.success("Seller removed successfully");
//           fetchSellers();
//         }
//       } catch (err) {
//         toast.error("Failed to delete seller");
//       }
//     }
//   };

//   const filteredSellers = sellers.filter(s =>
//     s.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     s.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen p-6 lg:p-10 pt-28  text-slate-200">
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-800/60 pb-8">
//         <div>
//           <h2 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
//             Seller <span className="text-blue-500">Network</span>
//           </h2>
//           <p className="text-slate-500 text-sm mt-1">Manage and verify retail partners</p>
//         </div>

//         <div className="relative w-full md:w-96">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
//           <input
//             type="text"
//             placeholder="Search store name or email..."
//             className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition-all shadow-inner"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Conditional View Logic */}
//       {isMobile ? (
//         /* --- MOBILE CARD VIEW --- */
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//           {filteredSellers.map((seller) => (
//             <div key={seller._id} className="bg-[#0f172a] p-6 rounded-[2rem] border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
//               <div className="flex justify-between items-start mb-6">
//                 <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold border border-blue-500/20">
//                   {seller.username?.charAt(0).toUpperCase()}
//                 </div>
//                 <span className={`px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-wider ${
//                   seller.status === "Approved" 
//                   ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
//                   : "bg-amber-500/10 text-amber-400 border-amber-500/20"
//                 }`}>
//                   {seller.status}
//                 </span>
//               </div>
              
//               <div className="mb-6">
//                 <h4 className="text-white font-bold text-lg leading-tight">{seller.username}</h4>
//                 <p className="text-slate-500 text-xs mt-1">{seller.email}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <button 
//                   onClick={() => handleVerifyToggle(seller._id, seller.status)}
//                   className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
//                     seller.status === "Approved" 
//                     ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
//                     : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
//                   }`}
//                 >
//                   {seller.status === "Approved" ? "Revoke" : "Approve"}
//                 </button>
//                 <button 
//                   onClick={() => handleDelete(seller._id)}
//                   className="py-3 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         /* --- DESKTOP TABLE VIEW --- */
//         <div className="bg-[#0f172a] rounded-[2rem] border border-slate-800/60 shadow-2xl overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-slate-900/40 border-b border-slate-800">
//               <tr>
//                 <th className="py-5 px-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Store Identity</th>
//                 <th className="py-5 px-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Verification</th>
//                 <th className="py-5 px-8 text-slate-500 font-bold uppercase tracking-widest text-[10px] text-right">Control</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-800/40">
//               {filteredSellers.map((seller) => (
//                 <tr key={seller._id} className="group hover:bg-slate-800/20 transition-all">
//                   <td className="py-6 px-8">
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold border border-blue-500/10">
//                         {seller.username?.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <p className="text-white font-bold group-hover:text-blue-400 transition-colors">{seller.username}</p>
//                         <p className="text-slate-500 text-xs font-medium">{seller.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-6 px-8">
//                     <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-full border tracking-tighter ${
//                       seller.status === "Approved" 
//                       ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
//                       : "bg-amber-500/10 text-amber-400 border-amber-500/20"
//                     }`}>
//                       {seller.status}
//                     </span>
//                   </td>
//                   <td className="py-6 px-8">
//                     <div className="flex justify-end gap-3">
//                       <button 
//                         onClick={() => handleVerifyToggle(seller._id, seller.status)} 
//                         className={`p-2.5 rounded-xl border transition-all ${
//                           seller.status === "Approved" 
//                           ? "text-rose-400 border-rose-500/20 hover:bg-rose-500/10" 
//                           : "text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10"
//                         }`}
//                         title={seller.status === "Approved" ? "Revoke Access" : "Grant Approval"}
//                       >
//                         {seller.status === "Approved" ? <XCircle size={18}/> : <CheckCircle size={18}/>}
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(seller._id)} 
//                         className="p-2.5 text-slate-500 hover:text-white hover:bg-rose-600/20 hover:border-rose-500/30 rounded-xl border border-transparent transition-all"
//                         title="Remove Seller"
//                       >
//                         <Trash2 size={18}/>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {filteredSellers.length === 0 && (
//         <div className="py-24 flex flex-col items-center justify-center text-slate-600">
//           <div className="bg-slate-900/50 p-6 rounded-full mb-4">
//             <Search size={40} className="opacity-20" />
//           </div>
//           <p className="font-bold text-lg tracking-tight">No partners found</p>
//           <p className="text-sm">Try adjusting your search criteria</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SellerManagement;
import React, { useEffect, useState } from "react";
import { Trash2, Search, Store, ShieldCheck, Mail } from "lucide-react";
import { getAllSellersAPI, deleteSellerAPI } from "../../services/allApi";
import { toast } from "react-toastify";

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSellers = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const reqHeader = { Authorization: `Bearer ${token}` };
      try {
        const result = await getAllSellersAPI(reqHeader);
        if (result.status === 200) setSellers(result.data);
      } catch (err) {
        toast.error("Failed to load seller ecosystem");
      }
    }
  };

  useEffect(() => { fetchSellers(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this retail partner? All associated data will be archived.")) {
      const token = localStorage.getItem("token");
      const reqHeader = { Authorization: `Bearer ${token}` };
      try {
        const result = await deleteSellerAPI(id, reqHeader);
        if (result.status === 200) {
          toast.success("Seller removed from network");
          fetchSellers();
        }
      } catch (err) {
        toast.error("Failed to delete seller");
      }
    }
  };

  const filteredSellers = sellers.filter(s =>
    s.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 lg:p-10 pt-28 text-slate-200">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-800/60 pb-8">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
            Retail <span className="text-blue-500">Partners</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">Authorized sellers within the Proofly ecosystem</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search partners..."
            className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition-all shadow-inner"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isMobile ? (
        /* --- MOBILE CARD VIEW --- */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredSellers.map((seller) => (
            <div key={seller._id} className="bg-[#0f172a] p-6 rounded-[2rem] border border-slate-800 shadow-xl hover:border-blue-500/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Store size={24} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={12} /> Verified
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-white font-bold text-lg leading-tight">{seller.username}</h4>
                <div className="flex items-center gap-2 text-slate-500 text-xs mt-2">
                  <Mail size={14} /> {seller.email}
                </div>
              </div>

              <button 
                onClick={() => handleDelete(seller._id)}
                className="w-full py-3 bg-slate-800/50 text-rose-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
              >
                Terminate Partnership
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* --- DESKTOP TABLE VIEW --- */
        <div className="bg-[#0f172a] rounded-[2rem] border border-slate-800/60 shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/40 border-b border-slate-800">
              <tr>
                <th className="py-5 px-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Partner Identity</th>
                <th className="py-5 px-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Network Status</th>
                <th className="py-5 px-8 text-slate-500 font-bold uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredSellers.map((seller) => (
                <tr key={seller._id} className="group hover:bg-slate-800/20 transition-all">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/10">
                        <Store size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold group-hover:text-blue-400 transition-colors">{seller.username}</p>
                        <p className="text-slate-500 text-xs font-medium">{seller.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 tracking-tighter">
                      <ShieldCheck size={14} /> Active Partner
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDelete(seller._id)} 
                        className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-white hover:bg-rose-600 rounded-xl border border-slate-800 hover:border-rose-600 transition-all text-[10px] font-bold uppercase tracking-widest"
                      >
                        <Trash2 size={16}/> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredSellers.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-slate-600">
          <Search size={40} className="opacity-20 mb-4" />
          <p className="font-bold text-lg tracking-tight text-slate-400">No Authorized Sellers</p>
          <p className="text-sm">Partners will appear here once registered by Admin</p>
        </div>
      )}
    </div>
  );
};

export default SellerManagement;