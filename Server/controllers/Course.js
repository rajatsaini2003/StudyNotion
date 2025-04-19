const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const {uploadFileToCloudinary} = require('../utils/fileUpload');
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
require('dotenv').config();
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")


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

exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadFileToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          course[key] = updates[key]
          // if (key === "tag" || key === "instructions") {
          //   course[key] = JSON.parse(updates[key])
          // } else {
          //   course[key] = updates[key]
          // }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails", 
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  // Get a list of Course for a given Instructor
  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 }).populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
      

      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }