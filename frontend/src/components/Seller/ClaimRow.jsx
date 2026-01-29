import React from "react";

const ClaimRow = ({ claim }) => {
  return (
    <div className="flex justify-between items-center border p-3 rounded-md bg-white shadow-sm">
      <div>
        <p className="font-semibold">{claim.product || "Product"}</p>
        <p className="text-gray-600 text-sm">User: {claim.user || "Customer Name"}</p>
      </div>

      <div className="flex gap-3">
        <button className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
        <button className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
      </div>
    </div>
  );
};

export default ClaimRow;

