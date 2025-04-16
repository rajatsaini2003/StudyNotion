const express = require('express');
const router = express.Router();

const {
    updateProfile, 
    deleteProfile, 
    getAllUserDetails, 
    updateProfilePicture,
    instructorDashboard,
    getEnrolledCourses} = require('../controllers/Profile')
// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
// Delet User Account
router.delete("/deleteProfile",auth,  deleteProfile)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.put('/updateProfilePicture',auth, updateProfilePicture)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router;