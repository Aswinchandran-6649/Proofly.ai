const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const route = require('./Routes/router'); // Your router file
const connectDB = require('./db/dbConnection');
const startExpirationCheck = require('./services/expirationService');

dotenv.config();
const app = express();
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://proofly-ai.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());
//expiration checking 
startExpirationCheck();
// Point all /api requests to your router file
app.use('/api', route);
app.use('/uploads', express.static('./uploads'));
app.get('/', (req, res) => res.send('Proofly API Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
