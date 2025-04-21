const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadFileToCloudinary } = require('../utils/fileUpload');

//create a new SubSection
exports.createSubSection = async (req,res) =>{
    try {
        const {sectionId,title, timeDuration, description } = req.body;

        const video  = req.files.video;

        if(!sectionId || !title || !description || !video) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const uploadDetails = await uploadFileToCloudinary(video, process.env.FOLDER_NAME);

        const newSubSection = await SubSection.create({
            title,
            timeDuration: `${uploadDetails.duration}`,
            description,
            videoUrl:uploadDetails.secure_url
        })

        const updatedSection = await Section.findByIdAndUpdate(sectionId, { $push: {subSection: newSubSection._id}},{new:true}).populate("subSection");

        return res.status(200).json({
            success:true,
            message:'SubSection created successfully',
            updatedSection
        })   
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create SubSection',
            error: error.message,
        })
    }
}

//update subSection

exports.updateSubSection = async (req, res) => {
    try {
        // Fetch data from the request body
        const { subSectionId, title, timeDuration, description } = req.body;

        // Fetch video information (from file if provided)
        const video = req.file ? req.file.videoFile : null;

        // Validation
        if (!subSectionId || !title || !video || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Update the subsection with new details
        const updateData = {
            title,
            timeDuration,
            description,
        };

        // Upload video to Cloudinary if a new video is uploaded and add it to the updateData
        if (video) {
            const uploadDetails = await uploadFileToCloudinary(
                video,
                process.env.FOLDER_NAME
            );
            updateData.videoURL = uploadDetails.secure_url; // get the video URL
        }

        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId, // find the subsection by id
            updateData, // Update with the new data
            { new: true }
        );

        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            data: updatedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update the subsection",
            error: error.message,
        });
    }
};


// delete subSection
exports.deleteSubSection = async (req, res) => {
    try {
        // Fetch subsection id from request params
        const {subSectionId} = req.params;
        
        // Validation
        if(!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Subsection id is required",
            });
        }

        // Find the subsection by id and remove it from the section
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found",
            });
        }

        const updateSection = await Section.updateOne(
            { subSections: subSectionId },
            { $pull: { subSections: subSectionId } } // remove subsection id from section
        )
        if(!updateSection) {
            return res.status(500).json({
                success: false,
                message: " subsection refrence doesn't found in any section",
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
            data: deletedSubSection,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete the subsection",
            error: error.message,
        });
    }
}