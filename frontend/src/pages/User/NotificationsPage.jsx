
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Trash2, BellOff, ArrowLeft, Bell, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchNotificationsAPI, clearNotificationsAPI, markAsReadAPI } from "../../services/allApi";

const NotificationsPage = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        const activeUser = user || JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (activeUser?._id && token) {
            const reqHeader = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            try {
                const res = await fetchNotificationsAPI(activeUser._id, reqHeader);
                
                if (res.status >= 200 && res.status < 300) {
                    // Sort by latest first
                    const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setNotifications(sorted);

                    // Mark as read after state is set
                    await markAsReadAPI(activeUser._id, reqHeader);
                    
                    // Trigger Navbar refresh (matching your Navbar's event listener)
                    window.dispatchEvent(new Event("refreshNotifications"));
                }
            } catch (err) {
                console.error("Error loading notifications:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [user]);

    const handleClearAll = async () => {
        if (window.confirm("Delete all notifications?")) {
            const token = localStorage.getItem("token");
            const reqHeader = { "Authorization": `Bearer ${token}` };
            try {
                await clearNotificationsAPI(user._id, reqHeader);
                setNotifications([]);
                window.dispatchEvent(new Event("refreshNotifications"));
            } catch (err) { console.error(err); }
        }
    };

    // Helper to determine icon and color based on message content
    const getNotificationStyle = (message) => {
        const msg = message.toLowerCase();
        if (msg.includes("approved")) {
            return {
                icon: <CheckCircle size={20} />,
                color: "border-green-500/20",
                accent: "bg-green-500",
                iconBg: "bg-green-500/10 text-green-500"
            };
        } else if (msg.includes("rejected")) {
            return {
                icon: <XCircle size={20} />,
                color: "border-red-500/20",
                accent: "bg-red-500",
                iconBg: "bg-red-500/10 text-red-500"
            };
        } else {
            // Default: Expiry or General Alerts
            return {
                icon: <AlertTriangle size={20} />,
                color: "border-rose-500/20",
                accent: "bg-rose-500",
                iconBg: "bg-rose-500/10 text-rose-500"
            };
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f18] pt-28 pb-12 px-6 text-white">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <Link to="/user/dashboard" className="flex items-center gap-2 text-blue-400 text-sm mb-2 hover:text-blue-300 transition-colors">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-black flex items-center gap-3">
                            <Bell className="text-blue-500" /> Notifications
                        </h1>
                    </div>
                    
                    {notifications.length > 0 && (
                        <button onClick={handleClearAll} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold bg-red-500/10 px-5 py-2.5 rounded-xl border border-red-500/20 transition-all">
                            <Trash2 size={16} /> Clear All
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5">
                        <BellOff size={40} className="text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-300">No active alerts</h2>
                        <p className="text-gray-500 mt-2">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {notifications.map((note) => {
                            const style = getNotificationStyle(note.message);
                            return (
                                <div key={note._id} className={`relative overflow-hidden p-6 bg-white/5 border ${style.color} rounded-2xl hover:bg-white/[0.08] transition-all group`}>
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.accent}`}></div>
                                    <div className="flex gap-4">
                                        <div className={`p-2 rounded-lg h-fit ${style.iconBg}`}>
                                            {style.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-200 font-medium text-lg leading-relaxed">
                                                {note.message}
                                            </p>
                                            <div className="mt-4 flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-gray-500">
                                                <span>{new Date(note.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                {!note.isRead && (
                                                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[9px]">New</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;