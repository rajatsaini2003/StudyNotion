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
        console.log(categoryDetails);
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