const WarrantyCard = () => {
  return (
    <div className="border p-3 rounded shadow hover:shadow-lg transition">
      <h3 className="font-semibold">Product Name</h3>
      <p className="text-sm text-gray-600">Purchase Date: 01/01/2025</p>
      <p className="text-sm text-gray-600">Warranty Ends: 01/01/2026</p>
      <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
        View Receipt
      </button>
    </div>
  );
};

export default WarrantyCard;
