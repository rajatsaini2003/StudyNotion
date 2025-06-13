const express = require("express");
const app = express();

const database = require("./config/database");
const cookieParser = require("cookie-parser")
const cors = require("cors");;
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const {cloudinaryConnect} = require('./config/cloudinary')

const contactRoutes = require('./routes/ContactUs')
const userRoutes= require('./routes/User');
const paymentRoutes= require('./routes/Payment');
const courseRoutes= require('./routes/Course');
const profileRoutes= require('./routes/Profile')
dotenv.config();
const PORT = process.env.PORT || 4000;

//database connection
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:`http://localhost:3000https://study-notion-kappa-two.vercel.app/`,
        credentials: true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:'/tmp',
    })
)
// cloudinary connect
cloudinaryConnect();

//routes
app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/reach',contactRoutes);
app.use('/api/v1/profile',profileRoutes);
app.use('/api/v1/course',courseRoutes);
app.use('/api/v1/payment',paymentRoutes);

//def routes

app.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:"your server is UP!....."
    })
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);  
})