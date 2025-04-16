const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Course');
const CourseProgress = require("../models/CourseProgress");
const { uploadFileToCloudinary } = require("../utils/fileUpload");
const { convertSecondsToDuration } = require("../utils/secToDuration");

exports.updateProfile = async (req, res) => {
    try {
        // Get data from request
        const {lastName,firstName, dateOfBirth, about, contactNumber, gender } = req.body;

        // Get user ID
        const id = req.user.id;

        // Find user and get profile ID
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        //const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;

        const updatedProfile = await Profile.findByIdAndUpdate(profileId, {dateOfBirth, gender, about, contactNumber}, {new:true});
        const updatedUserDetails = await User.findByIdAndUpdate(id,{lastName,firstName},{new:true}).populate("additionalDetails").exec();
        updatedUserDetails.password = undefined;
        //console.log(updatedUserDetails);
        return res.status(200).json({
            success:true,
            message:'Profile updated successfully',
            updatedUserDetails
        })   

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};


exports.deleteProfile = async (req, res) => {
    try {
        //get data
        const id = req.user.id;
        //console.log(id);
        //validation
        const userDetails = await User.findById(id);
        // if(!userDetails){
        //     return res.status(404).json({
        //         success: false,
        //         message: "User not found"
        //     });
        // }

        //delete profile
        const deletedProfile = await Profile.findByIdAndDelete(userDetails.additionalDetails);
        if(!deletedProfile){
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        //delete user
        const deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        //Unenroll user from courses
        const courses = userDetails.courses;
        for(let courseId of courses){
            await Course.updateOne(
                { _id: courseId },
                { $pull: { studentsEnrolled: id } }
            )
        }

        //return response
        return res.status(200).json({
            success: true,
            message: "User profile and account deleted successfully",
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete profile",
            error: error.message
        })
    }
}
exports.getAllUserDetails = async (req, res) => {
    try {
        //get id
        const id = req.user.id;

        // validate 
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        userDetails.password = undefined;
        //return res
        return res.status(200).json({
            success: true,
            userDetails
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get user details",
            error: error.message
        })
    }
    
}

exports.updateProfilePicture = async (req,res) =>{
    try {
        //console.log("here............");
        const profilePicture = req.files.displayPicture;
        const userId = req.user.id;
        //console.log("userId: " + userId);
        const image = await uploadFileToCloudinary(
            profilePicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        //console.log(image);
        const updateProfile = await User.findByIdAndUpdate(
            {_id:userId},
            {image:image.secure_url},
            {new : true}
        )
        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data:updateProfile.image
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile picture",
            error: error.message
        })
    }
}
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
      .populate({
        path: "courses",
        populate: {
        path: "courseContent",
        populate: {
          path: "subSection",
        },
        },
      })
      .exec()

      userDetails = userDetails.toObject()
	  var SubsectionLength = 0
	  for (var i = 0; i < userDetails.courses.length; i++) {
		let totalDurationInSeconds = 0
		SubsectionLength = 0
		for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
		  totalDurationInSeconds += userDetails.courses[i].courseContent[
			j
		  ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
		  userDetails.courses[i].totalDuration = convertSecondsToDuration(
			totalDurationInSeconds
		  )
		  SubsectionLength +=
			userDetails.courses[i].courseContent[j].subSection.length
		}
		let courseProgressCount = await CourseProgress.findOne({
		  courseID: userDetails.courses[i]._id,
		  userId: userId,
		})
		courseProgressCount = courseProgressCount?.completedVideos.length
		if (SubsectionLength === 0) {
		  userDetails.courses[i].progressPercentage = 100
		} else {
		  // To make it up to 2 decimal point
		  const multiplier = Math.pow(10, 2)
		  userDetails.courses[i].progressPercentage =
			Math.round(
			  (courseProgressCount / SubsectionLength) * 100 * multiplier
			) / multiplier
		}
	  }

      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.instructorDashboard = async(req, res) => {
	try{
		const courseDetails = await Course.find({instructor:req.user.id});

		const courseData  = courseDetails.map((course)=> {
			const totalStudentsEnrolled = course.studentsEnrolled.length
			const totalAmountGenerated = totalStudentsEnrolled * course.price

			//create an new object with the additional fields
			const courseDataWithStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudentsEnrolled,
				totalAmountGenerated,
			}
			return courseDataWithStats
		})

		res.status(200).json({courses:courseData});

	}
	catch(error) {
		console.error(error);
		res.status(500).json({message:"Internal Server Error"});
	}
}