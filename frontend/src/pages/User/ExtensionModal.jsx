import React, { useState } from 'react';
import { X, CreditCard, ShieldPlus, Loader2 } from 'lucide-react';

const ExtensionModal = ({ isOpen, onClose, onConfirm, productName }) => {
  const [months, setMonths] = useState(12);
  const [loading, setLoading] = useState(false); // New loading state
  
  const price = months === 12 ? 49 : 29;

  if (!isOpen) return null;

  const handlePayClick = async () => {
    setLoading(true);
    try {
      // Call the onConfirm function passed from WarrantyDetails
      await onConfirm(months, price);
    } finally {
      setLoading(false);
    }
  };

  // Handle product name display if it's an array
  const displayName = Array.isArray(productName) ? productName[0] : productName;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldPlus className="text-blue-600" /> Extend Warranty
          </h2>
          <button 
            onClick={onClose} 
            disabled={loading} // Disable close while processing
            className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-30"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-600 text-sm">
            Select an extension plan for <span className="font-bold text-gray-900">{displayName}</span>
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              disabled={loading}
              onClick={() => setMonths(6)}
              className={`p-4 rounded-2xl border-2 transition-all ${months === 6 ? 'border-blue-600 bg-blue-50' : 'border-gray-100'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="block font-bold text-lg">6 Months</span>
              <span className="text-sm text-gray-500">$29.00</span>
            </button>
            <button 
              disabled={loading}
              onClick={() => setMonths(12)}
              className={`p-4 rounded-2xl border-2 transition-all ${months === 12 ? 'border-blue-600 bg-blue-50' : 'border-gray-100'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="block font-bold text-lg">1 Year</span>
              <span className="text-sm text-gray-500">$49.00</span>
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Service Fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 text-slate-800">
              <span>Total Amount</span>
              <span className="text-blue-600">${price}.00</span>
            </div>
          </div>

          <button 
            onClick={handlePayClick}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Pay & Extend Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionModal;