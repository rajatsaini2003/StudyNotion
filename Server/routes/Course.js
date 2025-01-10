const express = require('express');
const router = express.Router();

// course Controllers Import
const {
    createCourse,
    showAllCourse,
    getCourseDetails
} = require('../controllers/Course');

// Category Controllers Import
const {
    createCategory,
    showAllCategory,
    categoryPageDetails
} = require('../controllers/Category');

// Sections Controllers Import
const {
    createSection,
    updateSection,
    deleteSection,
  } = require("../controllers/Section")
  
// Sub-Sections Controllers Import
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
  } = require("../controllers/Subsection")
  
  // Rating Controllers Import
  const {
    createRating,
    getAverageRating,
    getAllRating,
  } = require("../controllers/RatingAndReview")
  
// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");
// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Get all Registered Courses
router.get("/getAllCourses", showAllCourse)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router;