const express = require("express");
const router = express.Router();
module.exports = router;

const Myadmin = require("./login-schema")

router.post("/",async(req,res)=>{
    let input = {f_userName:req.body.userName, f_pwd:req.body.userPassword};

    let info = await Myadmin.find(input);

    if(info.length == 0){
        res.status(200).json({"message":"Invalid or Not Exists", "status":"FAIL"});
    }else{
        let returnData = {  
            id:info[0]._id,
            fullname:info[0].f_userName,
            message:"Success ! Redirecting...",
            status:"PASS",
        };
        res.status(200).json(returnData);
    }
});