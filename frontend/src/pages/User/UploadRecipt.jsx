
import React, { useState, useEffect } from "react";
import {
  UploadCloud, CheckCircle, Camera, Search,
  Cpu, Database, Trash2, X, Zap
} from "lucide-react";
import { scanReceiptAPI, saveWarrantyAPI } from "../../services/allApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadReceipt = () => {
  const [preview, setPreview] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [warrantyYears, setWarrantyYears] = useState("1");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    storeName: "",
    purchaseDate: "",
    totalAmount: "",
    productName: "",
    expiryDate: "",
    serialNumber: "", 
  });

  const calculateExpiry = (purchaseDate, years) => {
    if (!purchaseDate) return "";
    const date = new Date(purchaseDate);
    date.setFullYear(date.getFullYear() + parseInt(years));
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (formData.purchaseDate) {
      const expiry = calculateExpiry(formData.purchaseDate, warrantyYears);
      setFormData((prev) => ({ ...prev, expiryDate: expiry }));
    }
  }, [formData.purchaseDate, warrantyYears]);

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem("token"); // Get token for scanning

    if (!token) {
      toast.error("Please login to scan receipts");
      navigate('/login');
      return;
    }

    if (file) {
      setReceiptFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setIsScanning(true);

      const data = new FormData();
      data.append("receipt", file);

      // FIX: Added Authorization to the scanning header
      const reqHeader = { 
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      };

      try {
        const result = await scanReceiptAPI(data, reqHeader);
        if (result.status === 200) {
          const aiData = result.data;
          setFormData({
            storeName: aiData.storeName || "",
            purchaseDate: aiData.purchaseDate || "",
            totalAmount: aiData.totalAmount || "",
            serialNumber: aiData.serialNumber || "", 
            productName: Array.isArray(aiData.productName)
              ? aiData.productName.join(", ")
              : aiData.productName || "",
            expiryDate: calculateExpiry(aiData.purchaseDate || new Date(), warrantyYears),
          });
          toast.success("AI Scan Complete!");
        }
      } catch (err) {
        console.error("Scanning Error:", err);
        toast.error(err.response?.data?.message || "AI Scan failed, please enter manually.");
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleFinalSave = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      toast.error("Please login to save the warranty");
      navigate('/login');
      return;
    }

    // Basic Validation to prevent 400 Bad Request
    if (!formData.storeName || !formData.purchaseDate || !formData.totalAmount) {
      toast.error("Please fill in Merchant, Date, and Amount");
      return;
    }

    const saveFormData = new FormData();
    saveFormData.append("storeName", formData.storeName);
    saveFormData.append("purchaseDate", formData.purchaseDate);
    saveFormData.append("totalAmount", formData.totalAmount);
    saveFormData.append("warrantyExpiryDate", formData.expiryDate);
    saveFormData.append("serialNumber", formData.serialNumber); 
    // userId is no longer strictly required in Body if backend uses token, 
    // but we keep it here as your backend destructured it from req.body
    saveFormData.append("userId", userData._id);

    // FIX: Properly handle product name string-to-array conversion
    // This ensures 'productName' matches what your backend expects
    if (formData.productName) {
      const productArray = typeof formData.productName === 'string' 
        ? formData.productName.split(",").map(item => item.trim()).filter(i => i !== "")
        : [formData.productName];
      
      productArray.forEach(name => {
        saveFormData.append("productName", name); 
      });
    }

    if (receiptFile) {
      saveFormData.append("receiptImage", receiptFile);
    } else {
      toast.error("Receipt image is required");
      return;
    }

    const reqHeader = {
      "Authorization": `Bearer ${token}`
    };

    try {
      const result = await saveWarrantyAPI(saveFormData, reqHeader);
      // Backend returns 201 for successful creation
      if (result.status === 201 || result.status === 200) {
        toast.success("Warranty Secured in Vault!");
        navigate('/user/dashboard'); 
      }
    } catch (err) {
      console.error("Save error:", err.response?.data);
      // Display the specific validation error from your backend
      const errorMessage = err.response?.data?.details || err.response?.data?.error || "Failed to save to database";
      toast.error(errorMessage);
    }
  };

  const clearForm = () => {
    setPreview(null);
    setReceiptFile(null);
    setFormData({
      storeName: "",
      purchaseDate: "",
      totalAmount: "",
      productName: "",
      expiryDate: "",
      serialNumber: "",
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f1f5f9] p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-100px)] overflow-hidden rounded-3xl lg:rounded-[2.5rem] shadow-2xl bg-white border border-gray-200">
        
        {/* VIEWPORT (LEFT SIDE) */}
        <div className="w-full lg:w-2/5 bg-[#020617] flex flex-col relative h-[350px] lg:h-auto">
          <div className="p-4 lg:p-6 flex justify-between items-center z-20">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${preview ? "bg-green-500" : "bg-red-500 animate-pulse"}`} />
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">
                {preview ? "Image_Loaded" : "Waiting_For_Input"}
              </span>
            </div>
            {preview && (
              <button onClick={clearForm} className="text-white/30 hover:text-white transition-colors">
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center relative overflow-hidden px-6 pb-6 lg:px-8 lg:pb-8">
            {!preview ? (
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <label className="group flex items-center gap-4 bg-white/5 border border-white/10 p-4 lg:p-6 rounded-2xl lg:rounded-3xl hover:bg-blue-600 cursor-pointer transition-all duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                    <Camera className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-bold">Take Photo</p>
                    <p className="text-white/40 text-[10px]">Use device camera</p>
                  </div>
                  <input type="file" accept="image/*" capture="environment" hidden onChange={handleCapture} />
                </label>

                <label className="group flex items-center gap-4 bg-white/5 border border-white/10 p-4 lg:p-6 rounded-2xl lg:rounded-3xl hover:bg-blue-600 cursor-pointer transition-all duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                    <UploadCloud className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-bold">Upload File</p>
                    <p className="text-white/40 text-[10px]">Choose from gallery</p>
                  </div>
                  <input type="file" accept="image/*" hidden onChange={handleCapture} />
                </label>
              </div>
            ) : (
              <div className="relative group flex items-center justify-center h-full w-full">
                <img src={preview} alt="Receipt" className="max-h-full max-w-full object-contain shadow-2xl rounded-sm ring-1 ring-white/20" />
                {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-line" />}
              </div>
            )}
          </div>
        </div>

        {/* FORM (RIGHT SIDE) */}
        <div className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="p-6 lg:p-10 border-b border-gray-100">
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-6 lg:mb-8 tracking-tight">AI Verification</h1>
            <div className="flex items-center gap-3 lg:gap-6 overflow-x-auto pb-2">
              <AnalysisStep icon={<Search size={14} />} label="Scan" active={!!preview} />
              <div className="h-[2px] min-w-[20px] bg-gray-100" />
              <AnalysisStep icon={<Cpu size={14} />} label="Extract" active={!isScanning && !!formData.storeName} />
              <div className="h-[2px] min-w-[20px] bg-gray-100" />
              <AnalysisStep icon={<Database size={14} />} label="Verify" active={!isScanning && !!formData.storeName} />
            </div>
          </div>

          <div className="p-6 lg:p-10 space-y-6 lg:space-y-8">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-10 lg:py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-gray-400 animate-pulse tracking-widest uppercase text-[10px]">Processing...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <ModernInput 
                    label="Merchant" 
                    value={formData.storeName} 
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} 
                  />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Purchase Date</label>
                    <input type="date" value={formData.purchaseDate} onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})} className="w-full p-4 lg:p-5 bg-gray-50 border-2 border-gray-100 rounded-xl lg:rounded-2xl font-bold text-gray-800 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <ModernInput 
                    label="Total Amount" 
                    value={formData.totalAmount} 
                    placeholder="e.g. 1299.00"
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })} 
                  />
                  <ModernInput 
                    label="Serial / IMEI" 
                    value={formData.serialNumber} 
                    placeholder="e.g. SN-88294-PRO"
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Warranty Term</label>
                    <select value={warrantyYears} onChange={(e) => setWarrantyYears(e.target.value)} className="w-full p-4 lg:p-5 bg-white border-2 border-blue-100 rounded-xl lg:rounded-2xl font-bold text-gray-800 outline-none focus:border-blue-500 transition-all text-sm">
                      <option value="1">1 Year Protection</option>
                      <option value="2">2 Years Protection</option>
                      <option value="3">3 Years Protection</option>
                      <option value="5">5 Years Protection</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-1">Warranty Expiry</label>
                    <div className="w-full p-4 lg:p-5 bg-blue-50 border-2 border-blue-100 rounded-xl lg:rounded-2xl font-bold text-blue-700 text-sm">
                      {formData.expiryDate || "Awaiting Date..."}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Name</label>
                  <input className="w-full p-4 lg:p-5 bg-gray-50 border-2 border-gray-100 rounded-xl lg:rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-gray-800 text-sm" value={formData.productName} placeholder="Product identification..." onChange={(e) => setFormData({ ...formData, productName: e.target.value })} />
                </div>
              </>
            )}
          </div>

          <div className="mt-auto p-6 lg:p-10 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 lg:gap-6">
            <button
              onClick={handleFinalSave}
              disabled={!formData.storeName || isScanning}
              className={`flex-[2] relative overflow-hidden group py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl 
                ${!formData.storeName || isScanning 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]"}`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isScanning ? (
                  <span>Analyzing Receipt...</span>
                ) : (
                  <>
                    <Zap size={18} className="fill-current group-hover:animate-pulse" />
                    <span>Protect Asset</span>
                  </>
                )}
              </div>
            </button>

            <button
              onClick={clearForm}
              className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm uppercase tracking-widest transition-all duration-300 active:scale-[0.98]"
            >
              <X size={18} />
              <span>Discard</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          position: absolute;
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

const AnalysisStep = ({ icon, label, active }) => (
  <div className={`flex items-center gap-2 lg:gap-3 transition-all duration-500 shrink-0 ${active ? "opacity-100" : "opacity-20"}`}>
    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl flex items-center justify-center ${active ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}>
      {active ? <CheckCircle size={16} /> : icon}
    </div>
    <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{label}</span>
  </div>
);

const ModernInput = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{label}</label>
    <input 
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full p-4 lg:p-5 bg-gray-50 border-2 border-gray-100 rounded-xl lg:rounded-2xl font-bold text-gray-800 text-sm outline-none focus:border-blue-500 transition-all"
    />
  </div>
);

export default UploadReceipt;