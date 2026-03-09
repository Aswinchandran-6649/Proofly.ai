# Proofly – AI Powered Digital Warranty & Receipt Management System

Proofly is a full-stack MERN application that allows users to upload purchase receipts and manage product warranties digitally.  
The system uses AI to analyze receipt images and extract important details automatically.

---

## 🚀 Features

• Upload and store purchase receipts  
• AI-powered receipt analysis using Gemini AI  
• Automatic extraction of product details and purchase information  
• Role-based authentication (User / Admin)  
• Secure file upload and storage  
• Responsive dashboard for warranty tracking

---

## 🧠 How It Works

1. User uploads a receipt image
2. The image is sent to Gemini AI
3. Gemini analyzes the receipt and extracts structured data such as:
   - Product name
   - Purchase date
   - Price
   - Warranty details
4. Extracted data is stored in MongoDB
5. Users can view and manage warranties in their dashboard

Flow:

Upload Receipt → Gemini AI Processing → Database → Dashboard

---

## 🛠 Tech Stack

Frontend  
React.js  
Tailwind CSS  

Backend  
Node.js  
Express.js  

Database  
MongoDB  
Mongoose  

Other Tools  
JWT Authentication  
Multer (File Uploads)  
Gemini AI API
