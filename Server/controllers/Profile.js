const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Course');
const { uploadFileToCloudinary } = require("../utils/fileUpload");

exports.updateProfile = async (req, res) => {
    try {
        // Get data from request
        const { dateOfBirth, about, contactNumber, gender } = req.body;

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
        const profileId = userDetails.additionalDetails;

        // Create update object dynamically (only add fields that are provided)
        const updateData = {};
        if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
        if (about) updateData.about = about;
        if (contactNumber) updateData.contactNumber = contactNumber;
        if (gender) updateData.gender = gender;

        // Update profile only with provided fields
        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedProfile,
        });

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
        console.log(id);
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
        console.log("here............");
        const profilePicture = req.files.displayPicture;
        const userId = req.user.id;
        console.log("userId: " + userId);
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
// exports.getEnrolledCourses = async (req, res) =>{
//     const userId = req.user.id;
//     const userDetails = await User.findOne({_id:userId}).
//                         populate({
//                             path: 'courses',
//                             populate: {path: 'courseContent', select: 'name'}
//                         });
// }
