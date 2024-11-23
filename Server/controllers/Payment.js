const {instance} = require('../config/Razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollment');
const { default: mongoose } = require('mongoose');

exports.capturePayment = async (req, res) => {
    //get courseId and userID
    const {course_id} = req.body;
    const userID = req.user.id;

    //validation
    if(!course_id){
        return res.status(400).json({
            success: false,
            message: "Please provide Course ID "
        });
    }

    //valid Course
    //valid Course Details
    let course;
    try {
        course = await Course.findById(course_id);
        if(!course){
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID"
            });
        }
    //user already paid for same course
        const uid = new mongoose.Types.ObjectId(userID);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success: false,
                message: "You have already paid for this course"
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(502).json({
            success: false,
            message: "Something went wrong while fetching course details : " + error.message
        });
    }


    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency: currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            course_id: course_id,
            user_id: userID
        }
    }
    try {
        // intitate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return response
        return res.status(200).json({
            success: true,
            message: "Payment Initiated successfully",
            courseNmae: course.courseName,
            thumbnail:course.thumbnail,
            orderId : paymentResponse.id,
            currency:paymentResponse.currency,
            amount : paymentResponse.amount
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to initiate payment : " + error.message
        });
        
    }
    
}

//verify signature of razorpay and server

exports.verifySignature = async (req, res) => {

    const webHookSecret = "12345678";

    const signature = req.headers['x-razorpay-signature'];
    
}