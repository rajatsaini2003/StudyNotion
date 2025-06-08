const Course = require('../models/Course');
const RatingAndReview = require('../models/RatingAndReview');
const mongoose = require("mongoose")
//createRating
exports.createRating = async (req, res) =>{
    try {
        //get user id
        const userId = req.user.id;

        //fetch data from req body
        const {rating, review, courseId} = req.body;

        //  check if user is enrolled or not
        const courseDetails = await Course.findOne(
                        {_id:courseId,
                        studentEnrolled:{$eleMatch :{$eq:userId}},
                       });
        if(!courseDetails){
            return res.status(401).json({
                success: false,
                message: "Student is not enrolled in this course"
            });
        }

        //check if user already reviewed the course
        const existingReview = await RatingAndReview.findOne({
                                            user: userId,
                                            course:courseId
                                        })

                                        if(existingReview){
                                            return res.status(401).json({
                                                success: false,
                                                message: "User has already reviewed this course"
                                            });
                                        }
                                        
        //create rating and review
        const ratingAndReview= await RatingAndReview.create({
            rating: rating,
            review: review,
            user: userId,
        })

        //update course with this rating and review 
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
                                                        {
                                                            $push:{ratingAndReview:ratingAndReview._id}
                                                        },
                                                        {new:true}
                                                    )
        
        //console.log(updatedCourse);                           
        //return response
        return res.status(200).json({
            success: true,
            message: "Rating and review created successfully",
            data: ratingAndReview
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "fail to create rating and review",
            error: error.message
        })
    }
}

//getAverageRating
exports.getAverageRating = async (req,res)=>{
    try {
        //get courseId
        const {courseId} = req.body;
        
        //calculate avg Rating
        const avgRating = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating:{$avg: '$rating'}
                }
            }
        ])

        //return avg rating
        if(avgRating.length > 0){
            return res.status(200).json({
                success: true,
                message: "Average rating fetched successfully",
                data: avgRating[0].averageRating
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "No rating found for this course"
            })
        }

        //return res
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get average rating",
            error: error.message
        })
    }
}

//getAllRating
exports.getAllRating = async (req,res) => {
    //get sorted by rating
    try {
        const allReviews = await RatingAndReview.find(
            ).sort({rating: -1})
            .populate({path: "User",
            select: "firstName lastName email image"})
            .populate({path: "Course",
            select: "courseName"})
            .exec();
            
        return res.status(200).json({
            success: true,
            message:"all reviews fetched successfully",
            data:allReviews,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}


