const jwt = require("jsonwebtoken");
const Register = require("../src/models/registers");
const auth1 = async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.SECRET);
        console.log(verifyUser); 

        const user = await Register.findOne({_id:verifyUser._id});
        console.log(user.firstname);
     
        req.token=token;
        req.user=user;
        next();
    }catch(error){
        res.status(401).send(error);
    }
    // try {
       
    //    if(req.session._id){}
    //    else{
    //        res.redirect('/secret');
    //    }
    //    next();
    // } catch (error) {
    //     console.log(error.message);
    // }
    


}
const auth= async(req,res,next)=>{
    try {
       
      if(req.session._id){
         res.redirect('/show');
      }
      next();
    } catch (error) {
        console.log(error.message);
    }
}


// module.exports = {
//     auth,
//     auth1

// }

module.exports = auth;
module.exports = auth1;

