
import React, { useEffect, useState } from "react";
import { Eye, CheckCircle, XCircle, ShieldCheck, Camera, User, Fingerprint, Calendar, ArrowLeft, DollarSign, Search, Copy, Check, X } from "lucide-react";
import { getSellerWarrantiesAPI, updateWarrantyStatusAPI } from "../../services/allApi";
import { SERVER_URL } from "../../services/serverUrl"; 
import { toast } from "react-toastify";
import { Html5QrcodeScanner } from "html5-qrcode";

const PendingApprovals = () => {
  const [pendingList, setPendingList] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [copiedId, setCopiedId] = useState(null);

  const fetchWarranties = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const sellerShopName = user?.storeName || user?.username;

    if (token && sellerShopName) {
      const reqHeader = { "Authorization": `Bearer ${token}` };
      try {
        const result = await getSellerWarrantiesAPI(sellerShopName, reqHeader);
        if (result.status === 200) {
          const filtered = result.data.filter(w => w.status === "Pending");
          setPendingList(filtered);
        }
      } catch (err) {
        toast.error("Failed to fetch approvals");
      }
    }
  };

  useEffect(() => { fetchWarranties(); }, []);

  // 2. Filter Logic (Checks Username and User ID) - YOUR EXACT LOGIC
  const filteredList = pendingList.filter((item) => {
    const userId = (item.userId?._id || item.userId || "").toLowerCase();
    const username = (item.userId?.username || item.username || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return userId.includes(search) || username.includes(search);
  });

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("ID copied to clipboard");
  };

  // SCANNER LOGIC - Optimized for raw ID and URL compatibility
  useEffect(() => {
    let scanner = null;
    if (isScannerOpen) {
      // Delay ensures the <div id="reader"> is rendered before scanner starts
      const timeoutId = setTimeout(() => {
        // Increased box size slightly for better mobile scanning
        scanner = new Html5QrcodeScanner("reader", { 
          fps: 10, 
          qrbox: { width: 250, height: 250 } 
        });
        
        const onScanSuccess = (decodedText) => {
          // 1. Extract the ID: If it's a URL, take the last part; otherwise, take the text
          const scannedId = decodedText.trim().includes('/') 
            ? decodedText.split('/').pop() 
            : decodedText.trim();

          // 2. Find the match in the local pending list
          const matchedPending = pendingList.find(item => 
            item._id === scannedId || 
            item.serialNumber === scannedId ||
            (item._id && decodedText.includes(item._id))
          );

          if (matchedPending) {
            // 3. Clear scanner and open the Review Modal
            scanner.clear().then(() => {
              setIsScannerOpen(false);
              setViewItem(matchedPending);
              toast.success("Warranty match found!");
            }).catch(err => {
              console.error("Scanner clear error:", err);
              // Fallback if clear fails
              setIsScannerOpen(false);
              setViewItem(matchedPending);
            });
          } else { 
            toast.error("Warranty ID not found in pending list."); 
          }
        };

        scanner.render(onScanSuccess, (error) => {
          // Optional: handle scan errors silently to avoid console spam
        });
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        if (scanner) {
          scanner.clear().catch(err => console.log("Scanner cleanup safety"));
        }
      };
    }
  }, [isScannerOpen, pendingList]);

  const handleStatusUpdate = async (id, status) => {
    let reason = "";
    if (status === "Rejected") {
      reason = window.prompt("Reason for rejection:");
      if (!reason?.trim()) return;
    }
    const token = localStorage.getItem("token");
    const reqHeader = { "Authorization": `Bearer ${token}` };
    try {
      const result = await updateWarrantyStatusAPI(id, { status, rejectionReason: reason }, reqHeader);
      if (result.status === 200) {
        toast.success(`Warranty ${status}`);
        setViewItem(null);
        fetchWarranties();
      }
    } catch (err) { toast.error("Update failed"); }
  };

  return (
    // Added pt-28 to create space for your Navbar
    <div className="min-h-screen bg-gray-50 p-4 lg:p-10 pt-28">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><ShieldCheck size={28} /></div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Verification Queue</h2>
                <p className="text-sm text-gray-500">{pendingList.length} total pending items</p>
            </div>
          </div>
          <button onClick={() => setIsScannerOpen(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg transition-all">
            <Camera size={18} /> Scan Receipt
          </button>
        </div>

        {/* SCANNER OVERLAY - Adjusted for spacing and closing */}
        {isScannerOpen && (
          <div className="fixed inset-0 bg-gray-900/90 z-[10000] flex justify-center p-4 overflow-y-auto backdrop-blur-sm">
            <div className="w-full max-w-md mt-24 mb-10 h-fit bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/20">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <span className="font-black text-xs uppercase tracking-widest text-gray-400">Scanner Active</span>
                    <button onClick={() => setIsScannerOpen(false)} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {/* THIS DIV IS REQUIRED FOR THE SCANNER TO WORK */}
                    <div id="reader" className="rounded-2xl overflow-hidden border-2 border-dashed border-indigo-100"></div>
                    
                    <button 
                        onClick={() => setIsScannerOpen(false)}
                        className="w-full mt-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                        Cancel Scanning
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* 3. Search Bar UI */}
        <div className="mb-6 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by User ID or Username..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md bg-white border border-gray-200 py-3.5 pl-12 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        {/* List Section */}
        <div className="space-y-3">
          {filteredList.length > 0 ? (
            filteredList.map((item) => (
              <div key={item._id} className="bg-white px-6 py-5 rounded-2xl border border-gray-200 flex flex-wrap lg:flex-nowrap items-center gap-8 hover:border-indigo-300 transition-all shadow-sm">
                <div className="flex-1 min-w-[220px]">
                  <p className="text-[10px] text-indigo-500 font-black uppercase mb-1">Product</p>
                  <h3 className="font-bold text-gray-900 text-base leading-tight">
                    {Array.isArray(item.productName) ? item.productName.join(", ") : item.productName}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1">SN: {item.serialNumber || "No Serial"}</p>
                </div>

                <div className="w-56">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Customer Details</p>
                  <div className="flex flex-col group/id">
                    <span className="text-sm font-bold text-gray-800">{item.userId?.username || item.username || "Guest"}</span>
                    <button 
                      onClick={() => handleCopy(item.userId?._id || item.userId)}
                      className="text-[10px] text-gray-400 font-mono flex items-center gap-1 hover:text-indigo-600 transition-colors"
                    >
                      ID: {(item.userId?._id || item.userId || "N/A").slice(0, 12)}...
                      {copiedId === (item.userId?._id || item.userId) ? <Check size={10} /> : <Copy size={10} />}
                    </button>
                  </div>
                </div>

                <div className="w-32">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Expires</p>
                  <p className="text-sm font-bold text-gray-700">{new Date(item.warrantyExpiryDate).toLocaleDateString()}</p>
                </div>

                <button onClick={() => setViewItem(item)} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all flex items-center gap-2">
                  <Eye size={14} /> Review
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <XCircle size={56} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No results found</h3>
              <p className="text-gray-300 text-sm">Try searching for a different ID or name.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL SECTION - Added pt-28 for Navbar spacing */}
      {viewItem && (
        <div className="fixed inset-0 bg-gray-900/70 z-[9999] flex justify-center p-4 overflow-y-auto backdrop-blur-md pt-28 pb-10">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-fit max-h-none animate-in fade-in zoom-in duration-200">
            <div className="md:w-2/5 p-8 lg:p-12">
                <button onClick={() => setViewItem(null)} className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-indigo-600 transition-colors"><ArrowLeft size={20} /> Close</button>
                <h2 className="text-3xl font-black text-gray-900 mb-8">Claim Review</h2>
                <div className="space-y-6">
                    {/* <DetailRow icon={<User size={20}/>} label="Customer" val={viewItem.userId?.username} sub={viewItem.userId?._id} /> */}
                    <DetailRow 
        icon={<User size={20}/>} 
        label="Customer" 
        // Checks for populated object name OR top-level username string
        val={viewItem.userId?.username || viewItem.username ||viewItem.userId} 
        // Checks for populated object ID OR the userId string itself
        sub={viewItem.userId?._id || viewItem.userId} 
    />
                    <DetailRow icon={<Fingerprint size={20}/>} label="Serial Number" val={viewItem.serialNumber} />
                    <DetailRow icon={<Calendar size={20}/>} label="Expiry" val={new Date(viewItem.warrantyExpiryDate).toLocaleDateString()} />
                    <DetailRow icon={<DollarSign size={20}/>} label="Total" val={`$${viewItem.totalAmount}`} isPrice />
                </div>
                <div className="flex gap-3 mt-12 pt-8 border-t border-gray-100">
                    <button onClick={() => handleStatusUpdate(viewItem._id, "Approved")} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all">Approve</button>
                    <button onClick={() => handleStatusUpdate(viewItem._id, "Rejected")} className="flex-1 bg-white border-2 border-red-50 text-red-500 py-4 rounded-2xl font-black hover:bg-red-50 transition-all">Reject</button>
                </div>
            </div>
            <div className="md:w-3/5 bg-slate-50 p-8 flex items-center justify-center border-l border-gray-100 min-h-[400px]">
                <img src={`${SERVER_URL}/uploads/${viewItem.receiptImage}`} alt="receipt" className="max-h-[60vh] rounded-2xl shadow-2xl border-8 border-white object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for Modal
const DetailRow = ({ icon, label, val, sub, isPrice }) => (
    <div className="flex gap-4 items-start">
        <div className="bg-slate-50 p-3 rounded-2xl text-indigo-500">{icon}</div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <p className={`font-bold ${isPrice ? 'text-emerald-600 text-xl' : 'text-gray-800'}`}>{val || "N/A"}</p>
            {sub && <p className="text-[10px] text-gray-400 font-mono truncate">{sub}</p>}
        </div>
    </div>
);

export default PendingApprovals;