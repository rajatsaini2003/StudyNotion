const Category = require('../models/Category')

//create Category handler function

exports.createCategory = async (req, res) => {
    try {
        const {name, description}= req.body;
        if(! name || ! description){
            return res.status(400).json({
                success: false,
                message: "Name and description are required"
            })
        }
        //create entry in the database
        const categoryDetails = await Category.create({
            name : name,
            description : description
        });
        //console.log(categoryDetails);
        //return response successful
        res.status(200).json({
            success: true,
            message: "Category created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
//get all categories
exports.showAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({}, {name:true, description:true});
        res.status(200).json({
            success: true,
            allCategory,
            message: "All Category fetched successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//category detail page 
exports.categoryPageDetails = async (req, res) => {
    try {
        const {categoryId} = req.body;

        //get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
                                            .populate("course")
                                            .exec();
        //console.log(selectedCategory);
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        //handle the case when there are no course
        if(selectedCategory.course.length === 0){
            //console.log("No Course found for selected category");
            return res.status(200).json({
                success: true,
                message: "No Course found for selected category"
            });
        }
        const selectedCourse = selectedCategory.course;

        //get course for other categories
        const otherCategories = await Category.find({_id: {$ne:categoryId}})
           .populate("course").exec();
        let differentCourse = [];
        for( const category of otherCategories){
            differentCourse.push(...category.course);
        }
        //get top selling course across all category
        const allCategory = await Category.find().populate("course");
        const allCourse = allCategory.flatMap((category) => category.course);
        const mostSelling = allCourse.sort((a, b) => b.sold - a.sold)
                                     .slice(0, 10);
        return res.status(200).json({
            success: true,
            selectedCourse,
            differentCourse,
            mostSelling,
            message: "All Course fetched successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}