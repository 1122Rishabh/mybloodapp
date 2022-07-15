const express =require("express");
var empModel = empModel.find({});
var router = express.Router();
const port= process.env.PORT || 5000

router.get('/hhf',function(req,res,next){
    employeeee.exec(function(err,data){
        if(err)throw err;
        res.render('hhf',{records:data});
    });
});