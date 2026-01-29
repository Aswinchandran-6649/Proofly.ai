import React, { useState } from "react";
import { registerAPI } from "../../services/allApi"
import { toast } from "react-toastify";

const AdminAddSeller = ({ onSellerCreated }) => {
  const [sellerData, setSellerData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
  e.preventDefault();
  const { username, email, password } = sellerData;

  if (!username || !email || !password) {
    toast.info("Please fill the form completely");
    return; 
  }

  try {

    const result = await registerAPI({ ...sellerData, role: "seller" });


    if (result.status === 200 || result.status === 201) {
      toast.success(`Seller ${username} registered successfully!`);
      setSellerData({ username: "", email: "", password: "" });
      if (onSellerCreated) onSellerCreated();
    } 
  } catch (err) {

    console.log("Registration Error:", err);

 
    if (err.response && err.response.data) {
      toast.error(err.response.data); 
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

  return (
    <div className="bg-[#111827] p-6 rounded-2xl border border-white/10 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4">Register New Seller</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Seller Name"
          value={sellerData.username}
          className="bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
          onChange={(e) => setSellerData({ ...sellerData, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Seller Email"
          value={sellerData.email}
          className="bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
          onChange={(e) => setSellerData({ ...sellerData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Initial Password"
          value={sellerData.password}
          className="bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
          onChange={(e) => setSellerData({ ...sellerData, password: e.target.value })}
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">
          Create Seller Account
        </button>
      </form>
    </div>
  );
};

export default AdminAddSeller;