const mongoose = require("mongoose");

const tableStructure = new mongoose.Schema({
    f_userName  : { type:String, required:true },
    f_email     : { type:String, required:true },
    f_pwd       : { type:String, required:true },
    f_sno       : { type:String, required:true },
})

module.exports = mongoose.model("t_login", tableStructure);