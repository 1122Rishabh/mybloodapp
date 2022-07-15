var mongoose= require('mongoose');
mongoose.connect("mongodb://localhost:27017/blooddata",{ useNewUrlParser:true});
var conn =mongoose.connection;

var employeSchema=new mongoose.Schema({
    firstname : String,
    email:String,
    phonenumber:String,
    createpassword:String,
    repeatpassword:String,
    selectjob:String,
    
});
var employeeModel=mongoose.model('Register',employeSchema);
module.exports=employeeModel;