const Course = require('../models/Course');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
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

exports.deleteSection = async (req,res) => {
    try {
        
        const {sectionId, courseId} = req.body;

        if (!sectionId) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const sectionDetails = await Section.findById(sectionId);
        
        // //Section ke ander ke subsections delete kiye hai 
        sectionDetails.subSection.forEach( async (ssid)=>{
            await SubSection.findByIdAndDelete(ssid);
        })
        console.log('Subsections within the section deleted')
        //NOTE: Due to cascading deletion, Mongoose automatically triggers the built-in middleware to perform a cascading delete for all the referenced 
        //SubSection documents. DOUBTFUL!

        //From course, courseContent the section gets automatically deleted due to cascading delete feature
        await Section.findByIdAndDelete(sectionId);
        console.log('Section deleted')

        const updatedCourse = await Course.findById(courseId)
          .populate({
              path:"courseContent",
              populate: {
                  path:"subSection"
              }});
        return res.status(200).json({
            success:true,
            message:'Section deleted successfully',
            updatedCourse
        })   
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete Section',
            error: error.message,
        })
    }
}