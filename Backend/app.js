const express = require('express');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const productRoute = require('./routes/productRoutes');
const CartRoute = require('./routes/cartRoute')
const orderRoute=require('./routes/order')
const cors = require("cors");

require('dotenv').config();

const app = express();

connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL, 
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json()); 

app.use('/api', userRoutes, productRoute,CartRoute,orderRoute);  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
