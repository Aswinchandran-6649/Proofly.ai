import React, { useEffect, useState } from "react";
import { CheckCircle, CircleX, ReceiptText, Search, User, Calendar, Fingerprint, Copy, Check } from "lucide-react";
import { getSellerWarrantiesAPI } from "../../services/allApi";
import { toast } from "react-toastify";

const VerifiedReceipts = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const sellerShopName = user?.storeName || user?.username;

    if (token && sellerShopName) {
      const reqHeader = { "Authorization": `Bearer ${token}` };
      try {
        const result = await getSellerWarrantiesAPI(sellerShopName, reqHeader);
        if (result.status === 200) {
          const processed = result.data.filter(w => w.status !== "Pending");
          setHistoryList(processed);
        }
      } catch (err) {
        toast.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("User ID copied");
  };

  // SEARCH LOGIC: Now specifically checks User ID string
  const displayList = historyList.filter(item => {
    const matchesTab = activeTab === "All" || item.status === activeTab;
    
    const pName = Array.isArray(item.productName) ? item.productName.join(" ") : (item.productName || "");
    const uId = (item.userId?._id || item.userId || "").toLowerCase();
    const uName = (item.userId?.username || item.username || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return matchesTab && (pName.toLowerCase().includes(search) || uId.includes(search) || uName.includes(search));
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12 pt-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Receipt History</h2>
            <p className="text-slate-500 font-medium">Search by Product Name, User Name, or User ID</p>
          </div>

          <div className="flex gap-4 w-full xl:w-auto">
            <StatCard label="Approved" count={historyList.filter(d => d.status === "Approved").length} color="green" />
            <StatCard label="Rejected" count={historyList.filter(d => d.status === "Rejected").length} color="red" />
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 mb-10 flex flex-col lg:flex-row gap-4 items-center border border-slate-100">
            <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-full lg:w-auto">
                {["All", "Approved", "Rejected"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-[1.2rem] text-sm font-bold transition-all ${
                            activeTab === tab ? "bg-white text-indigo-600 shadow-md" : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="relative flex-1 w-full lg:pr-4">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Paste User ID here to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-none py-4 pl-14 pr-6 text-base focus:ring-0 placeholder:text-slate-400"
                />
            </div>
        </div>

        {/* Grid List */}
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse"></div>)}
            </div>
        ) : displayList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayList.map((item) => (
                <HistoryCard 
                    key={item._id} 
                    item={item} 
                    onCopy={handleCopy} 
                    isCopied={copiedId === (item.userId?._id || item.userId)} 
                />
              ))}
            </div>
        ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <ReceiptText size={64} className="mx-auto text-slate-200 mb-6" />
              <h3 className="text-2xl font-bold text-slate-400">No matching records</h3>
            </div>
          )}
      </div>
    </div>
  );
};

// Updated Card with User ID
const HistoryCard = ({ item, onCopy, isCopied }) => {
    const isApproved = item.status === "Approved";
    const currentUserId = item.userId?._id || item.userId || "N/A";
    
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${isApproved ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                        {isApproved ? <CheckCircle size={28} /> : <CircleX size={28} />}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        isApproved ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                        {item.status}
                    </span>
                </div>

                <h3 className="font-bold text-slate-800 text-xl mb-4 line-clamp-1">
                    {Array.isArray(item.productName) ? item.productName.join(", ") : item.productName}
                </h3>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                    {/* User Name */}
                    <div className="flex items-center gap-3">
                        <User size={16} className="text-slate-300" />
                        <p className="text-xs font-bold text-slate-700">{item.userId?.username || item.username || "Guest"}</p>
                    </div>

                    {/* USER ID SECTION - Bold and Searchable */}
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 group/id">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Fingerprint size={14} className="text-indigo-400 shrink-0" />
                            <p className="text-[10px] font-mono text-slate-500 truncate">ID: {currentUserId}</p>
                        </div>
                        <button 
                            onClick={() => onCopy(currentUserId)}
                            className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                        >
                            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                        <Calendar size={14} />
                        <p className="text-[11px] font-medium">{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {!isApproved && item.rejectionReason && (
                <div className="mt-5 p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                    <p className="text-[11px] text-red-600 italic">"{item.rejectionReason}"</p>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, count, color }) => (
    <div className={`flex-1 xl:flex-none min-w-[140px] bg-white p-4 rounded-2xl border-b-4 ${color === 'green' ? 'border-green-500' : 'border-red-500'} shadow-sm`}>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className={`text-2xl font-black ${color === 'green' ? 'text-green-600' : 'text-red-600'}`}>{count}</p>
    </div>
);

export default VerifiedReceipts;
