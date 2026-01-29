import { commonAPI } from "./CommonApi";
const SERVER_URL = "http://localhost:5000";

// Register API
export const registerAPI = async (user) => {
    return await commonAPI("POST", `${SERVER_URL}/api/register`, user, "");
};

// Login API
export const loginAPI = async (user) => {
    return await commonAPI("POST", `${SERVER_URL}/api/login`, user, "");
};

export const googleLoginAPI = async (reqBody) => {
    return await commonAPI("POST", `${SERVER_URL}/api/google-login`, reqBody, "");
};

//update user

// services/allApi.js
export const updateProfileAPI = async (reqBody, reqHeader) => {
    return await commonAPI("PUT", `${SERVER_URL}/api/user/edit`, reqBody, reqHeader);
};

////////////////////scan&warranty////////////////////////////////////

// 1. Scan the receipt (The AI Part)
// We use "multipart/form-data" for the header because we are sending an image file
export const scanReceiptAPI = async (formData, reqHeader) => {
    return await commonAPI("POST", `${SERVER_URL}/api/scan-receipt`, formData, reqHeader);
};

// 2. Save to Dashboard (The Database Part)
export const saveWarrantyAPI = async (formData, reqHeader) => {
    return await commonAPI("POST", `${SERVER_URL}/api/save-warranty`, formData, reqHeader);
};

// 3. Get User Warranties (The Dashboard Part)
export const fetchWarrantiesAPI = async (userId, reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/api/warranties/${userId}`, "", reqHeader);
};
// Delete a warranty
export const deleteWarrantyAPI = async (id, header) => {
  return await commonAPI("DELETE", `${SERVER_URL}/api/warranty/delete/${id}`, {}, header);
};

// Update/Archive a warranty
export const updateWarrantyAPI = async (id, data, header) => {
  return await commonAPI("PUT", `${SERVER_URL}/api/warranty/update/${id}`, data, header);
};

// Extend a warranty
export const extendWarrantyAPI = async (id, data, header) => {
  return await commonAPI("PUT", `${SERVER_URL}/api/warranty/extend/${id}`, data, header);
};

// src/services/allApi.js
export const getSingleWarrantyAPI = async (id, header) => {
    return await commonAPI("GET", `${SERVER_URL}/api/warranty/${id}`, "", header);
};

/////////////////// Notifications API ///////////////////////////////////////

// 1. Get all notifications for a user
export const fetchNotificationsAPI = async (userId, reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/api/notifications/${userId}`, "", reqHeader);
};

// 2. Mark all as read (removes the red dot)
export const markAsReadAPI = async (userId, reqHeader) => {
    return await commonAPI("PUT", `${SERVER_URL}/api/notifications/read/${userId}`, {}, reqHeader);
};

// 3. Clear all notifications (Delete)
export const clearNotificationsAPI = async (userId, reqHeader) => {
    return await commonAPI("DELETE", `${SERVER_URL}/api/notifications/clear/${userId}`, {}, reqHeader);
};

// --- ADMIN API SERVICES --- //

// Get Dashboard Stats
export const getAdminStatsAPI = async (header) => {
    return await commonAPI("GET", `${SERVER_URL}/api/admin/stats`, "", header);
};

// Get All Users for Management
export const getAllUsersAPI = async (header) => {
    return await commonAPI("GET", `${SERVER_URL}/api/admin/users`, "", header);
};

// Delete a User
export const deleteUserAPI = async (id, header) => {
    return await commonAPI("DELETE", `${SERVER_URL}/api/admin/user/delete/${id}`, {}, header);
};

export const getUserGrowthAPI = async (header) => {
    return await commonAPI("GET", `${SERVER_URL}/api/admin/user-growth`, "", header);
};
// 1. Get All Sellers for the Management Table
export const getAllSellersAPI = async (header) => {
    return await commonAPI("GET", `${SERVER_URL}/api/admin/all-sellers`, "", header);
};

// 2. Approve/Reject Seller (Matches your verifySeller controller)
export const verifySellerAPI = async (id, data, header) => {
    // data should be { isVerified: true } or { isVerified: false }
    return await commonAPI("PUT", `${SERVER_URL}/api/admin/update-seller/${id}`, data, header);
};

// 3. Delete a Seller Account
export const deleteSellerAPI = async (id, header) => {
    return await commonAPI("DELETE", `${SERVER_URL}/api/admin/delete-seller/${id}`, {}, header);
};
//////////////////////seller api////////////////////////////

// 1. Fetch All Warranties (Filtered by Store Name for Sellers)
// We pass the storeName as a query parameter: ?storeName=XYZ
export const getSellerWarrantiesAPI = async (storeName, header) => {
    // We use encodeURIComponent to handle store names with spaces (e.g., "Sony Center")
    return await commonAPI("GET", `${SERVER_URL}/api/seller/dashboard-stats?storeName=${encodeURIComponent(storeName)}`, "", header);
};

// 2. Update Warranty Status (Approve/Reject)
// This sends the new status and the optional rejection reason to the backend
export const updateWarrantyStatusAPI = async (id, statusData, reqHeader) => {
    return await commonAPI("PUT", `${SERVER_URL}/api/warranty/status/${id}`, statusData, reqHeader);
};
//verify-scanner-api
export const verifyWarrantyAPI = async (warrantyId, header) => {
    return await commonAPI("GET", `${SERVER_URL}/api/seller/verify-warranty/${warrantyId}`, "", header);
};