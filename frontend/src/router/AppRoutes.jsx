
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";

// Home main components
import Login from "../pages/Auth/Login";
import Home from "../main/Home";
import Contact from "../main/Contact";
import Features from "../main/Features";
import Terms from "../main/Terms";
import Working from "../main/Working";
import Navbar from "../components/Common/Navbar";
import PageNotFound from "../main/Pnf";

// User Pages
import Dashboard from "../pages/User/Dashboard";
import UploadReceipt from "../pages/User/UploadRecipt";
import MyWarranties from "../pages/User/MyWarranty";
import Profile from "../pages/User/Profile";
import WarrantyDetails from "../pages/User/WarrantyDetails";
import NotificationsPage from "../pages/User/NotificationsPage";

// Seller Pages
import SellerDashboard from "../pages/Seller/SellerDashboard";
import PendingApprovals from "../pages/Seller/PendingApprovals";
import VerifiedReceipts from "../pages/Seller/VerifiedRecipts";

// Admin Pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserManagement from "../pages/Admin/UserManagement";
import SellerManagement from "../pages/Admin/SellerManagement";
import Analytics from "../pages/Admin/Analytics";

// Layouts
import AdminLayout from "../layouts/AdminLyout";
import SellerLayout from "../layouts/SellerLyout";
import UserLayout from "../layouts/UserLyout";
import AdminAddSeller from "../pages/Admin/AdminAddSeller";


// --- PROTECTED ROUTE GATEKEEPER ---
const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");


  console.log("--- AUTH DEBUG ---");
  console.log("Token exists:", !!token);
  console.log("User JSON:", userJson);

  if (!token || !userJson) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userJson);

    const userRole = user?.role?.toLowerCase();
    const requiredRole = allowedRole.toLowerCase();

    console.log("Role found:", userRole, "| Role required:", requiredRole);

    if (userRole !== requiredRole) {
      console.warn(" Role mismatch! Redirecting to home.");
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Parsing error in ProtectedRoute", error);
    return <Navigate to="/login" replace />;
  }
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* PUBLIC ROUTES - Anyone can see these */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/features" element={<Features />} />
          <Route path="/working" element={<Working />} />

          {/* USER MODULE - Protected (Only Role: 'user') */}
          <Route element={<ProtectedRoute allowedRole="user" />}>
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="upload" element={<UploadReceipt />} />
              <Route path="warranties" element={<MyWarranties />} />
              <Route path="warranty-details/:id" element={<WarrantyDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          {/* SELLER MODULE - Protected (Only Role: 'seller') */}
          <Route element={<ProtectedRoute allowedRole="seller" />}>
            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={<SellerDashboard />} />
              <Route path="dashboard" element={<SellerDashboard />} />
              <Route path="pending" element={<PendingApprovals />} />
              <Route path="verified" element={<VerifiedReceipts />} />
            </Route>
          </Route>

          {/* ADMIN MODULE - Protected (Only Role: 'admin') */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="sellers" element={<SellerManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="addseller" element={<AdminAddSeller />} />
            </Route>
          </Route>


          <Route path="*" element={<PageNotFound/>} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
};

export default AppRoutes;