import React, { useState, useEffect, useContext } from "react";
import { Mail, Phone, User, Lock, Camera, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { updateProfileAPI } from "../../services/allApi";
import { AuthContext } from "../../context/AuthContext"; // Import Context

const SERVER_URL = "http://localhost:5000";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext); // Get global user and update function
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({
    username: "", 
    email: "", 
    phone: "", 
    password: "", 
    confirmPassword: "", 
    profilePic: ""
  });
  const [preview, setPreview] = useState("");

  useEffect(() => {
    // Pull fresh data from context/localStorage on load or mode switch
    const storedUser = localStorage.getItem("user"); 
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData({
        username: parsedUser.username || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "", 
        password: "",
        confirmPassword: "",
        profilePic: parsedUser.profilePic || ""
      });
      setPreview(parsedUser.profilePic ? `${SERVER_URL}/uploads/${parsedUser.profilePic}` : "https://i.pravatar.cc/150");
    }
  }, [isEdit]);

  const handleUpdate = async () => {
    const { username, phone, password, confirmPassword, profilePic } = userData;
    
    if(!username) return toast.warning("Username is required");

    if(password) {
        if(password.length < 6) return toast.warning("Password must be at least 6 characters");
        if(password !== confirmPassword) return toast.error("Passwords do not match!");
    }

    // Confirmation Modal
    const confirmSave = window.confirm("Are you sure you want to save these changes?");
    if (!confirmSave) return;

    const reqBody = new FormData();
    reqBody.append("username", username);
    reqBody.append("phone", phone);
    if(password) reqBody.append("password", password);
    
    if (profilePic && typeof profilePic !== "string") {
        reqBody.append("profilePic", profilePic);
    }

    const token = localStorage.getItem("token");
    const reqHeader = {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    };

    try {
        const result = await updateProfileAPI(reqBody, reqHeader);
        if (result.status === 200) {
          toast.success("Profile Updated Successfully");
          
          // CRITICAL: Update global context so Navbar changes immediately
          updateUser(result.data); 
          
          setIsEdit(false);
        } else {
          toast.error("Update failed.");
        }
    } catch (error) {
        console.error(error);
        toast.error("An error occurred");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Profile Vault</h1>
        <button 
          onClick={() => setIsEdit(!isEdit)}
          className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${isEdit ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}
        >
          {isEdit ? <><X size={18}/> Cancel</> : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 flex flex-col items-center gap-4 relative">
            <div className="relative group">
                <img src={preview} alt="Profile" className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-800 shadow-2xl" />
                {isEdit && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl cursor-pointer opacity-0 group-hover:opacity-100 transition">
                        <Camera className="text-white" />
                        <input type="file" className="hidden" onChange={e => {
                            setUserData({...userData, profilePic: e.target.files[0]});
                            setPreview(URL.createObjectURL(e.target.files[0]));
                        }} />
                    </label>
                )}
            </div>
            <div className="text-center text-white">
                <h2 className="text-xl font-bold">{userData.username}</h2>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">Verified Member</p>
            </div>
        </div>

        <div className="p-8 space-y-4">
          <ProfileInput icon={<User/>} label="Username" value={userData.username} disabled={!isEdit} onChange={val => setUserData({...userData, username: val})} />
          <ProfileInput icon={<Mail/>} label="Email" value={userData.email} disabled={true} />
          <ProfileInput icon={<Phone/>} label="Phone" value={userData.phone} disabled={!isEdit} onChange={val => setUserData({...userData, phone: val})} />
          
          {isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <ProfileInput 
                    icon={<Lock/>} 
                    label="New Password" 
                    placeholder="••••••" 
                    type="password" 
                    value={userData.password} 
                    onChange={val => setUserData({...userData, password: val})} 
                />
                <ProfileInput 
                    icon={<Lock/>} 
                    label="Confirm Password" 
                    placeholder="••••••" 
                    type="password" 
                    value={userData.confirmPassword} 
                    onChange={val => setUserData({...userData, confirmPassword: val})} 
                />
            </div>
          )}

          {isEdit && (
            <button onClick={handleUpdate} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-4">
              <Save size={20}/> Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileInput = ({ icon, label, value, disabled, onChange, type = "text", placeholder }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className={`flex items-center gap-3 p-4 rounded-2xl border transition ${disabled ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-white border-slate-200 focus-within:border-blue-500 shadow-sm'}`}>
      <div className="text-blue-500">{icon}</div>
      <input type={type} value={value || ""} placeholder={placeholder} disabled={disabled} onChange={e => onChange(e.target.value)} className="bg-transparent w-full outline-none font-bold text-slate-700" />
    </div>
  </div>
);

export default Profile;

