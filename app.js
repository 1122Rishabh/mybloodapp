require('dotenv').config();
const express =require("express");
const app = express();
const path = require("path")
const hbs = require("hbs");
const ejs=require("ejs");
const user_route = express();
const router=express.Router()
const multer =require("multer");
const jwt=require("jsonwebtoken");
const bodyParser = require('body-parser');
const fs = require('fs');
const  User=  require("./src/models/registers");
const passport=  require("passport");
const session = require("express-session");
const config = require("./config/config");

const LocalStrategy=require("passport-local");
const passportLocalMongoose =  require("passport-local-mongoose");
require("./src/db/conn");
const Register=require("./src/models/registers")
const port= process.env.PORT || 5000

const static_path=path.join(__dirname,"./public")
const template_path=path.join(__dirname,"./templates/views");
const partials_path=path.join(__dirname,"./templates/partials");
const auth = require("./middleware/auth");
const auth1 = require("./middleware/auth");
const auth2 = require("./middleware/auth");
const hide = require("./middleware/hide");
const cookieParser = require('cookie-parser');


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({secret:config.sessionSecret}))
app.set("views",template_path);
hbs.registerPartials(partials_path);
app.set("view engine","ejs");


console.log(process.env.SECRET);

// app.use(express.static('public'));

// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//        cb(null,path.join(__dirname, './public/uploads'));
//     },
//     filename:function(req,file,cb){
//        const name = Date.now()+'-'+file.originalname;
//        cb(null,name);
//     }
// });
// const upload = multer({storage:storage}).single('image');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname+"_" +Date.now()+path.extname(file.originalname));
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }

};
const upload=multer({storage:storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
}).single('image');
app.get('/cat',(req,res)=>{
    res.render("cat")
});
app.get('/secret',(req,res)=>{
    res.render("secret")
});
app.get('/hhf',function(req,res,next){

    Register.find({}, function (err, data) {
        if (!err) {
            res.render('hhf',{records:data});
        } else {
            throw err;
        }
    }).clone().catch(function(err){ console.log(err)})
    
});
app.get('/about',(req,res)=>{
    res.render("about")

});
app.get('/show',hide.isLogin,async(req,res)=>{
    //     try{
    //     const limitNumber=5;
    //     const categories=await Register.find({}).limit(limitNumber);
    //     res.render('show',{categories});
    // }catch(error){
    //     res.status(500).send({message:error.message|| "error occured"});
    // }
    // Register.find({}, function (err, data) {
    //     if (!err) {
    //         res.render('hhf',{records:data});
    //     } else {
    //         throw err;
    //     }
    // }).clone().catch(function(err){ console.log(err)})
    
    try {
        // const limitNumber = 10;
        const categories = await Register.find({}).limit();
        const latest = await Register.find({}).sort({ _id: -1 }).limit();

        const food={latest};
        res.render('show', { title: 'Cooking Blog - Explore Latest', categories,food } );
        // console.log(categories.firstname)
      } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
      }
      
    
});
app.get('/userprofile',async(req,res)=>{

    try {
        
        const userData = await Register.findById({ _id:req.session._id });
        res.render('userprofile',{ user:userData });

    } catch (error) {
        console.log(error.message);
    }
    // try{
    //     let userId = req.params.id;
    //     const userdata = await Register.findById(userId);
    //     res.render('userprofile', { title: 'Cooking Blog - Recipe', userdata } );
    // } catch (error) {    //     res.status(500).send({message: error.message || "Error Occured" });
    //   }
      
    
    
    //  Register.findById({_id:req.params.id},function(err,docs){
    //     if(err)res.json(err);
    //     else res.render('show',{Register:docs[0]});
    //        });
 
});
app.get('/detail/:id',async(req,res)=>{
    try {
        let recipeId = req.params.id;
        const recipe = await Register.findById(recipeId);
        res.render('detail', { title: 'Cooking Blog - Recipe', recipe } );
      } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
      }
});
app.get('/ind',async(req,res)=>{
    try {
        const limitNumber = 20;
        const categories = await Register.find({}).limit(limitNumber);
        const latest = await Register.find({}).sort({ _id: -1 }).limit(limitNumber);

        const food={latest};
        res.render('ind', { title: 'Cooking Blog - Explore Latest', categories,food } );
        // console.log(categories.firstname)
      } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
      }
});
app.get('/contact',(req,res)=>{
    res.render("contact")

});
app.get('/',(req,res)=>{
   res.render("index");
});
app.get('/login',hide.isLogout,(req,res)=>{
    // try {


        // const oneuser = await Register.find({}).sort({ _id: -1 }).limit();

        // const singleuser={oneuser};
        // res.render('login', { title: 'Cooking Blog - Explore Latest',singleuser } );
    //   } catch (error) {
    //     res.status(500).send({message: error.message || "Error Occured" });
    //   }
    
    res.render("login")
});
app.get("/logout",hide.isLogin,async(req,res)=>{
//  try{

// req.user.tokens=req.user.tokens.filter((currElement)=>{
//     return currElement.token!= req.token
// })
    // res.clearCookie("jwt");

    try {
        
        req.session.destroy();
        res.redirect('/');

    } catch (error) {
        console.log(error.message);
    }


console.log("logout susscessfully");
// await req.user.save();

// res.redirect("login");
//  }catch(error){
//     res.status(500).send(error);

//  }

});


app.post('/login',async(req,res)=>{
    try{
       
    const email=req.body.email;
    const password=req.body.password;
  
    const useremail=await Register.findOne({email:email});
    const token=await useremail.generateAuthToken();
    
    console.log("the token part"+ token);
    res.cookie("jwt",token,{
        expires:new Date(Date.now()+60000),
        httpOnly:true
    });
    if(useremail.createpassword===password){
        // res.send(useremail.password);
        // console.log(useremail);
        // req.session.user_id=useremail._id;
        req.session._id = useremail._id;
        res.status(201).redirect("/show");
    }else{
        res.send("invalid login details");
    }
    } catch(error){
        res.status(400).send("invalid Email")
    }
    // req.session.loggedin = true
});

app.get('/Register',hide.isLogout,(req,res)=>{
    res.render("register")

})
app.post("/Register",upload,async(req,res)=>{
    // console.log(req.filename);
    try{
const repeatpassword=req.body.repeatpassword;
const createpassword=req.body.createpassword;
const imageFile=req.file.filename;
if(repeatpassword===createpassword){
    const registeremp= new  Register({
        // userid:req.body.userid,
        firstname:req.body.firstname,
        email:req.body.email,
        phonenumber:req.body.phonenumber,
        createpassword:createpassword,
        repeatpassword:repeatpassword,
        selectjob:req.body.selectjob,
        image:imageFile
    });
    const token=await registeremp.generateAuthToken();
    console.log("the token part"+ token);
    res.cookie("jwt",token,{
        expires:new Date(Date.now()+60000),
        httpOnly:true
    });
   
 const registered=await registeremp.save();
 req.session._id = registeremp._id;

res.status(201).redirect("/show");
}else{
    res.send("password is not matching")
}
    }catch(error){
        res.status(500).json({message: error});
        console.log("There was an error");
    }

})
app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
}) 