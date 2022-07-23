const mongoose= require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const jwt=require("jsonwebtoken");
require("dotenv").config;

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

    selectbloodgroup:{
        type:String,
    },
    
    address:{
     type:String

    },
    image:{
    type:String
    },
    tokens:[{
        token:{
            type:String,
            
        }
    }]
    
})
employeeSchema.methods.generateAuthToken=async function(){
    try{
        console.log(this._id)
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch(error){
    res.send("the error part"+error);
    console.log("the error part"+error);
    }
}
// employeeSchema.plugin(passportLocalMongoose);
// module.exports = mongoose.model("User",employeeSchema);
const Register= new mongoose.model("Register",employeeSchema);
module.exports=Register;