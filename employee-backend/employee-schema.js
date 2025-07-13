const mongoose = require("mongoose");

const tableStructure = new mongoose.Schema({
    f_Image     : { type: String, required: true },
    f_Name      : { type: String, required: true },
    f_Email     : { type: String, required: true, unique:true },
    f_Mobile    : { type: Number, required: true },
    f_Designation: { type: String, required: true },
    f_Gender    : { type: String, required: true },
    f_Course    : { type: String, required: true },
    f_Createdate: { type: String, required: true }
})

module.exports = mongoose.model("t_Employee", tableStructure);

//f_Id,f_Image,f_Name,f_Email,f_Mobile,f_Designation,  f_gender,f_Course,f_Createdate