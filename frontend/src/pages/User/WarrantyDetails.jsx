
import React, { useEffect, useState } from "react";
import QRCode from 'qrcode'; 
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calendar, Store, Tag, ShieldCheck, 
  Trash2, Download, ShieldPlus, Clock, CreditCard, ExternalLink, AlertCircle
} from "lucide-react";
import { getSingleWarrantyAPI, deleteWarrantyAPI, extendWarrantyAPI } from "../../services/allApi";
import { toast } from "react-toastify";
import ExtensionModal from "../../pages/User/ExtensionModal"; 
import { jsPDF } from "jspdf"; 
import autoTable from "jspdf-autotable";

const SERVER_URL = "http://localhost:5000"; 

const WarrantyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warranty, setWarranty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getDaysRemaining = (expiryDate) => {
    const diff = new Date(expiryDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const fetchDetails = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const reqHeader = { "Authorization": `Bearer ${token}` };
      try {
        const result = await getSingleWarrantyAPI(id, reqHeader);
        if (result.status === 200) setWarranty(result.data);
      } catch (err) { 
        toast.error("Failed to load details"); 
      }
    }
  };

  useEffect(() => { fetchDetails(); }, [id]);

  const getBase64Image = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  };


 const handleDownloadPDF = async () => {
    try {
      const doc = new jsPDF();
      
      // The QR code remains the Warranty ID for the scanner
      const qrData = warranty._id; 

      // Header Design
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("PROOFLY.ai", 14, 25);
      doc.setFontSize(10);
      doc.text("OFFICIAL WARRANTY CERTIFICATE", 210 - 14, 25, { align: "right" });

      const productNameStr = Array.isArray(warranty?.productName) 
        ? warranty.productName.join(", ") 
        : warranty?.productName || "Product";

      // Warranty Data Table - Added "User ID" for fast searching
      autoTable(doc, {
        startY: 50,
        head: [['Field', 'Information']],
        body: [
          // NEW ROW: Highlighting the User ID for the seller's search bar
          ["CUSTOMER USER ID", warranty.userId?._id || warranty.userId || "N/A"], 
          ["Product Name", productNameStr],
          ["Retailer", warranty.storeName],
          ["Warranty Status", (warranty.status || "Pending").toUpperCase()],
          ["Purchase Date", new Date(warranty.purchaseDate).toLocaleDateString()],
          ["Expiry Date", new Date(warranty.warrantyExpiryDate).toLocaleDateString()],
          ["Serial / IMEI", warranty.serialNumber || "SN-NOT-PROVIDED"],
          ["Total Paid", `$${warranty.totalAmount}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], fontSize: 11 },
        // Custom styling for the User ID row to make it stand out
        didParseCell: function (data) {
          if (data.row.index === 0 && data.section === 'body') {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = [37, 99, 235]; // Match header blue
          }
        }
      });

      let currentY = doc.lastAutoTable.finalY + 15;

      // QR Code Generation
      const qrCodeData = await QRCode.toDataURL(qrData);
      doc.addImage(qrCodeData, 'PNG', 155, currentY, 40, 40);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text("Scan to Verify ID", 175, currentY + 45, { align: "center" });

      // Embed Receipt Image
      if (warranty.receiptImage) {
        try {
          const imageUrl = `${SERVER_URL}/uploads/${warranty.receiptImage}`;
          const base64Img = await getBase64Image(imageUrl);
          doc.setFontSize(12);
          doc.setTextColor(0);
          doc.text("Original Receipt Copy:", 14, currentY);
          doc.addImage(base64Img, 'JPEG', 14, currentY + 5, 100, 0); 
        } catch (e) {
          console.error("Receipt image failed", e);
        }
      }

      doc.save(`Proofly_Certificate_${warranty._id.slice(-6)}.pdf`);
      toast.success("PDF Downloaded with Searchable ID");
    } catch (error) {
      console.error(error);
      toast.error("PDF generation failed");
    }
  };

  const handleExtensionConfirm = async (months, price) => {
    const token = localStorage.getItem("token");
    const reqHeader = { "Authorization": `Bearer ${token}` };
    const paymentId = "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    try {
      const result = await extendWarrantyAPI(id, { 
        extensionMonths: months, 
        paymentId: paymentId, 
        amountPaid: price 
      }, reqHeader);

      if (result.status === 200) {
        toast.success(`Extended by ${months} months!`);
        setWarranty(result.data);
        setIsModalOpen(false);
      }
    } catch (err) { 
      toast.error("Extension failed"); 
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this warranty permanently?")) {
      const token = localStorage.getItem("token");
      const result = await deleteWarrantyAPI(id, { "Authorization": `Bearer ${token}` });
      if (result.status === 200) {
        toast.success("Deleted");
        navigate("/user/warranties");
      }
    }
  };

  if (!warranty) return <div className="p-20 text-center text-gray-500 text-xl font-bold">Loading Vault...</div>;

  const daysLeft = getDaysRemaining(warranty.warrantyExpiryDate);

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 mt-10">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-semibold group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Vault
        </button>
        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium text-sm">
          <Trash2 size={16} /> Delete Record
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {/* STATUS BADGES */}
                {warranty.status === "Approved" ? (
                  <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified by Seller
                  </span>
                ) : warranty.status === "Rejected" ? (
                  <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle size={12} /> Claim Rejected
                  </span>
                ) : (
                  <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                    Pending Verification
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                {Array.isArray(warranty.productName) ? warranty.productName[0] : warranty.productName}
              </h1>
              <p className="text-slate-400 mt-3 font-mono text-xs tracking-widest uppercase opacity-70">Vault ID: {warranty._id}</p>
            </div>
            <div className={`px-8 py-4 rounded-[1.5rem] flex flex-col items-center border-2 backdrop-blur-md ${daysLeft > 30 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
              <span className="text-[10px] uppercase font-black tracking-tighter opacity-60 mb-1">Coverage Remaining</span>
              <span className="text-2xl font-black leading-none">{daysLeft > 0 ? `${daysLeft} Days` : 'Expired'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            {/* REJECTION MESSAGE SECTION */}
            {warranty.status === "Rejected" && warranty.rejectionReason && (
              <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex gap-4 items-start">
                <AlertCircle className="text-red-500 shrink-0" size={24} />
                <div>
                  <h4 className="text-red-900 font-bold text-sm uppercase tracking-tight">Seller Feedback</h4>
                  <p className="text-red-700 text-sm mt-1">{warranty.rejectionReason}</p>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-blue-500"></div> Product Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                <DetailItem icon={<Store className="text-blue-500" />} label="Retailer / Store" value={warranty.storeName} />
                <DetailItem icon={<Tag className="text-emerald-500" />} label="Amount Paid" value={`$${warranty.totalAmount.toLocaleString()}`} />
                <DetailItem icon={<ShieldCheck className="text-indigo-500" />} label="Serial / IMEI" value={warranty.serialNumber || "SN-88294-PRO"} />
                <DetailItem icon={<Calendar className="text-purple-500" />} label="Purchase Date" value={new Date(warranty.purchaseDate).toLocaleDateString('en-US', { dateStyle: 'long' })} />
                <DetailItem icon={<Clock className="text-orange-500" />} label="Warranty Expiry" value={new Date(warranty.warrantyExpiryDate).toLocaleDateString('en-US', { dateStyle: 'long' })} />
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex flex-wrap gap-4">
               {/* CONDITIONALLY DISABLED EXTENSION BUTTON */}
               <button 
                onClick={() => setIsModalOpen(true)} 
                disabled={warranty.status !== "Approved"}
                className={`flex-1 min-w-[200px] px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl 
                  ${warranty.status === "Approved" 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"}`}
               >
                  <ShieldPlus size={20} /> 
                  {warranty.status === "Approved" ? "Extend Warranty" : "Approval Required to Extend"}
               </button>
               
               <button onClick={handleDownloadPDF} className="flex-1 min-w-[200px] bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
                  <Download size={20} /> Download Warranty (PDF)
               </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200/50 h-full flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Scan</h3>
                {warranty.receiptImage && (
                  <a href={`${SERVER_URL}/uploads/${warranty.receiptImage}`} target="_blank" rel="noreferrer" className="bg-white p-2 rounded-lg shadow-sm text-blue-600 hover:text-blue-700 transition-colors">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <div className="relative aspect-[3/4] bg-white rounded-2xl border border-slate-200 overflow-hidden group">
                {warranty.receiptImage ? (
                  <img src={`${SERVER_URL}/uploads/${warranty.receiptImage}`} alt="Receipt" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                    <ShieldCheck size={48} className="mb-4 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">No Scan Found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExtensionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productName={Array.isArray(warranty.productName) ? warranty.productName[0] : warranty.productName} 
        onConfirm={handleExtensionConfirm} 
      />
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex gap-5 items-center group">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
      {icon}
    </div>
    <div className="flex flex-col">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900 leading-tight">{value}</p>
    </div>
  </div>
);

export default WarrantyDetails;