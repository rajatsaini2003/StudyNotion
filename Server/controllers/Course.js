const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const {uploadFileToCloudinary} = require('../utils/fileUpload');

// createCourse handler function
exports.createCourse = async (req, res) => {
    try {
        
        // fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, category, tag, instructions} = req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnailImage;
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn 
            || !price || !category || !instructions || !tag
        ){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // check userId
        const userId = req.user.id;
        const InstructorDetails =  await User.findById(userId);
        console.log("instructor Details: ", InstructorDetails)
        // todo: check if user and instructor id are the same or different
        if(!InstructorDetails) return res.status(401).json({
            success: false,
            message: "Instructor not found"
        });

        // check given category is valid or not
        const categoryDetails = await Category.findOne({_id:category});
        if(!categoryDetails){
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }
        // upload thumbnail to cloudinary
        const thumbnailImage = await uploadFileToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse =  await Course.create({
            courseName:courseName, 
            description:courseDescription,
            instructor:InstructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            tag,
            instructions
        })
        await User.findByIdAndUpdate({
            _id:InstructorDetails._id},
            {
                $spush: {
                    courses: newCourse._id
                }
            },
            {new:true}
        )

        // update the category schema
        await Category.findByIdAndUpdate(categoryDetails._id, {
            $push: {
                course: newCourse._id
            }
        }, {new: true})

        //return response
        return res.status(200).json({
            success: true,
            message: "course created successfully",
            data: newCourse
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "fail to create course",
            error: error.message
        })
        
    }
}

exports.showAllCourse = async (req, res) => {
    try {
        // TODO change the below statement incrementally
        const allCourse = await Course.find({}); 
        
        return res.status(200).json({
            success: true,
            allCourse,
            message: "All courses fetched successfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "fail to fetch all courses",
            error: error.message
        })
    }
}

//get Course Details
exports.getCourseDetails = async (req, res) =>{
    try {
        //get id
        const {courseId} = req.body;
        //find course details
        const courseDetails = await Course.findById(courseId)
                                        .populate(
                                            {
                                                path :"instructor",
                                                populate:{
                                                    path :"additionalDetails"
                                                },
                                            }
                                        )
                                        .populate("category")
                                        .populate("ratingAndReview")
                                        .populate({
                                            path: "courseContent",
                                            populate:{
                                                path:"subSection"
                                            }
                                        }).exec();
        
        //validation
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Course not found with ID: ${courseId}`
            })
        }
        //return res
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data:courseDetails
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get course details",
            error: error.message
        })
    }
}

exports.editCourseDetails = async(req,res) =>{
    try {
        const {courseName, courseDescription, whatYouWillLearn, price, categoryID, tag, courseId} = req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnail; 
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Course ID required"
            });
        }
        if(!courseName && !courseDescription && !whatYouWillLearn 
            && !price && !categoryID && !tag && !thumbnail){
                return res.status(400).json({
                    success: false,
                    message: "Enter atleast one field to update"
                });
        }
        const categoryDetails = await Category.findOne({_id:categoryID});
        if(!categoryDetails){
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }
        let thumbnailImage = undefined;
        if(thumbnail)
            thumbnailImage = await uploadFileToCloudinary(thumbnail, process.env.FOLDER_NAME);
        //find course details
        const updatedCourse = await Course.findOneAndUpdate(
                                    {_id: courseId},
                                    {
                                    courseName:courseName, 
                                    description:courseDescription,
                                    whatYouWillLearn:whatYouWillLearn,
                                    price:price,
                                    category:categoryID,
                                    thumbnail:thumbnailImage.secure_url,
                                    tag:tag
                                    },
                                    {new:true}
                                )
        if(!updatedCourse){
            return res.status(400).json({
                success: false,
                message: "Course not found with given id",
            })
        }
        const updatedCoursedetails = await Course.findOne({
            _id: courseId,
          })
            .populate({
              path: "instructor",
              populate: {
                path: "additionalDetails", 
              },
            })
            .populate("category")
            .populate("ratingAndReview")
            .populate({
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            })
            .exec()
        return res.status(200).json({
            success: true,
            message: "Course details updated successfully",
            data: updatedCoursedetails
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Failed to edit course details",
            error: error.message
        })
    }
}