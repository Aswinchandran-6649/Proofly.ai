import React, { useEffect, useState } from "react";
import { getAllUsersAPI, deleteUserAPI } from "../../services/allApi";
import { Search, Trash2, User, Mail, ShieldCheck, ShieldAlert } from "lucide-react";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // 1. Precise Responsive Listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      try {
        const result = await getAllUsersAPI(reqHeader);
        if (result.status === 200) {
          setAllUsers(result.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
  };

  const handleRemoveUser = async (id) => {
    const result = await Swal.fire({
      title: 'Remove User?',
      text: "This account will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Yes, delete user',
      background: '#0f172a',
      color: '#fff',
      customClass: {
        popup: 'rounded-[2rem] border border-slate-800 shadow-2xl'
      }
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      if (token) {
        const reqHeader = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        };
        try {
          const res = await deleteUserAPI(id, reqHeader);
          if (res.status === 200) {
            fetchUsers();
            Swal.fire({
              title: 'Deleted!',
              icon: 'success',
              background: '#0f172a',
              color: '#fff',
              timer: 1500,
              showConfirmButton: false
            });
          }
        } catch (err) {
          Swal.fire('Error', 'Failed to delete user', 'error');
        }
      }
    }
  };

  // 2. Search Logic
  const filteredUsers = allUsers.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 lg:p-10 pt-28  text-slate-200">
      
      {/* Header & Search Bar Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-800/60 pb-8">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight">
            User <span className="text-blue-500">Registry</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">
            Monitoring {allUsers.length} total active accounts
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#2b3243] border border-slate-400 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600/40 transition-all shadow-inner placeholder:text-slate-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- View Logic --- */}
      {isMobile ? (
        /* 3. MOBILE CARD VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-[#0f172a] p-6 rounded-[2rem] border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold border border-blue-500/20">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <span className="px-3 py-1 text-[9px] uppercase font-black rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 tracking-widest">
                  {user.role}
                </span>
              </div>
              
              <div className="mb-6">
                <h4 className="text-white font-bold text-lg leading-tight group-hover:text-blue-400 transition-colors">{user.username}</h4>
                <p className="text-slate-500 text-xs mt-1 font-medium">{user.email}</p>
              </div>

              <button 
                onClick={() => handleRemoveUser(user._id)}
                className="w-full py-3.5 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all shadow-lg shadow-rose-900/10"
              >
                Terminate Account
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* 4. DESKTOP TABLE VIEW */
        <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800/60 shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/40 border-b border-slate-800">
              <tr>
                <th className="py-6 px-10 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Account Profile</th>
                <th className="py-6 px-10 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Permission Level</th>
                <th className="py-6 px-10 text-slate-500 font-bold uppercase tracking-widest text-[10px] text-right">System Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-slate-800/20 transition-all">
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold border border-blue-500/10 group-hover:border-blue-500/30 transition-all">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold group-hover:text-blue-400 transition-colors">{user.username}</p>
                          <p className="text-slate-500 text-xs font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-10">
                      <span className="px-4 py-1.5 text-[10px] font-black uppercase rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 tracking-tighter">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-6 px-10 text-right">
                      <button 
                        onClick={() => handleRemoveUser(user._id)} 
                        className="p-3 text-slate-500 hover:text-white hover:bg-rose-600 rounded-2xl border border-transparent hover:border-rose-500 transition-all shadow-xl"
                        title="Delete Account"
                      >
                        <Trash2 size={20}/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-600">
                      <ShieldAlert size={48} className="mb-4 opacity-20" />
                      <p className="font-bold text-lg">No Users Found</p>
                      <p className="text-sm">Try a different search term</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
