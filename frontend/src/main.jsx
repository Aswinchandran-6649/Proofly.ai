
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './styles/global.css'
import AppRoutes from './router/AppRoutes'
import AuthProvider from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="807183666684-ocens1a45sao591n8k5kc2nucbpf9s1g.apps.googleusercontent.com">
   <AuthProvider>
        <AppRoutes/>
        <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
