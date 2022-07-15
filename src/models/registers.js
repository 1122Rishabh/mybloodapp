const mongoose= require("mongoose");

const Schema = mongoose.Schema;
const employeeSchema=new mongoose.Schema({
    userid:{
        type:Number
     
    },

    firstname:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        // required:true,
        // unique:true
    },
    phonenumber:{
        type:Number,
        // required:true,
        // unique:true
    },
    createpassword:{
        type:String,
        // required:true
    },
    repeatpassword:{
        type:String,
        // required:true,
        // unique:true
    },
    selectjob:{
        type:String
    },
    image:{
    type:String
    }
    
})

const Register= new mongoose.model("Register",employeeSchema)
module.exports=Register