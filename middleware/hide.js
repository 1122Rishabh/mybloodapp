
const isLogin = async(req,res,next)=>{

    try {
        
       if(req.session._id){}
       else{
           res.redirect('/login');
       }
       next();
    } catch (error) {
        console.log(error.message);
    }

}

const isLogout = async(req,res,next)=>{

    try {
        
      if(req.session._id){
         res.redirect('/show');
      }
      next();
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    isLogin,
    isLogout
}