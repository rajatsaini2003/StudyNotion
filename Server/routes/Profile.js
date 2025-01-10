const express = require('express');
const router = express.Router();

const {updateProfile, deleteProfile, getAllUserDetails} = require('../controllers/Profile')
// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
// Delet User Account
router.delete("/deleteProfile",auth,  deleteProfile)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
module.exports = router;