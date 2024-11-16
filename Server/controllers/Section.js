const Course = require('../models/Course');
const Section = require('../models/Section');

exports.createSection = async (req, res)=>{
    try {
        //data fetch
        const {sectionName, courseId} = req.body;

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        //creat section
        const newSection = await Section.create({sectionName});
        
        //update course with section objectID
        const updatedCourse = await Course.findByIdAndUpdate(
                                                courseId,
                                                {
                                                    $push: {
                                                        courseContent:newSection._id,
                                                    }
                                                },
                                                {new: true},
                                                // populate section and subsection fields
                                            ).populate({
                                                path: 'courseContent', // Populating the 'courseContent' array in 'Course'
                                                populate: {
                                                    path: 'subSection', // Nested populate for 'subSection' in 'Section'
                                                    model: 'SubSection'
                                                }
                                            });

        //return response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            data: updatedCourse
        })
         
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error creating a new section'
        })
    }
}

exports.updateSection = async (req,res) => {
    try {
        //data input
        const {sectionId, sectionName} = req.body;

        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        //update data
        const updatedSection = await Section.findByIdAndUpdate(
                                    sectionId, 
                                    {sectionName}, 
                                    {new: true});

        //return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating a section',
            error: error.message
        })
    }
}

exports.deleteSection = async (req, res) => {
    try {
        //get data from params
        const {sectionId} = req.params;

        // Find and delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);
        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        //update course content in Course collection to remove sectionId from courseContent array
        const updatedCourse = await Course.updateOne(
            { courseContent: sectionId },
            { $pull: { courseContent: sectionId } }
        );
        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "section refrence not found in any course ",
            });
        }
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting a section',
            error: error.message
        })
    }
}