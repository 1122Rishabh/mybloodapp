const express =require("express");
const app = express();
const path = require("path")
const hbs = require("hbs");
const ejs=require("ejs");
const user_route = express();
// const session=require("express-session");
const config = require("./config/config");
// user_route.use(session({secret:config.sessionSecret}));
const router=express.Router()
const multer =require("multer");
const bodyParser = require('body-parser');
  
const fs = require('fs');
require("./db/conn");
const Register=require("./models/registers")
const port= process.env.PORT || 5000
const static_path=path.join(__dirname,"../public")
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");



app.use(express.urlencoded({extended:false}));
app.use(express.json());
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set('view engine','ejs');
app.set("views",template_path);
hbs.registerPartials(partials_path);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, + Date.now()+file.originalname ,'.jpg','.png')
    },
});


// const fileFilter=(req,res,cb)=>{
//     if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==='image/png'){
//         cb(null,true);
//     }else{
//         cb(null,false);
//     }

// };
var upload=multer({storage:storage,
    // limits:{
    //     fileSize:1024*1024*5
    // },
    // fileFilter:fileFilter
}).single('image')

// const upload = multer({ storage: storage });

app.get('/cat',(req,res)=>{
    res.render("cat")
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
app.get('/show',async(req,res)=>{
    //     try{
    //     const limitNumber=5;
    //     const categories=await Register.find({}).limit(limitNumber);
    //     res.render('show',{categories});
    // }catch(error){
    //     res.status(500).send({message:error.message|| "error occured"});
    // }
    
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
            // Register.find({}, function (err, data) {
        //     if (!err) {
        //         res.render('show',{records:data});
        //     } else {
        //         throw err;
        //     }
        // }).clone().catch(function(err){ console.log(err)})
    
});
app.get('/detail/:id',async(req,res)=>{
    try {
        let recipeId = req.params.id;
        const recipe = await Register.findById(recipeId);
        res.render('detail', { title: 'Cooking Blog - Recipe', recipe } );
      } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
      }
    } 
    
)
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
    } 
)
// app.get('/cat', async(req, res) => {
//     try {
//       const limitNumber = 5;
//       const categories = await Register.find({}).limit(limitNumber);
      
//     res.render('cat', { title: 'Cooking Blog - Home', categories, food } );
// } catch (error) {
//   res.satus(500).send({message: error.message || "Error Occured" });
// }
// })







// app.get('/:id',async(req,res)=>{

//     console.log(req.params.id);
//     Register.findById(req.params.id)
//     .then(data=>{
//         // res.render('show',{records:data});
//         res.status(200).json({
            
//             records:data
//         })
//     })
//     .catch(err=>{
//         console.log(err);
//         res.status(500).json({
//             error:err
//         })
//     })
// });

app.get('/contact',(req,res)=>{
    res.render("contact")

});
app.get('/',(req,res)=>{
   res.render("index");
});
app.get('/login',(req,res)=>{
    res.render("login")
})
app.post('/login',async(req,res)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;

    const useremail=await Register.findOne({email:email});

    if(useremail.createpassword===password){
        // res.send(useremail.password);
        // console.log(useremail);
        // req.session.user_id=useremail._id;
        res.status(201).render("index");
    }else{
        res.send("invalid login details");
    }
    } catch(error){
        res.status(400).send("invalid Email")
    }
});
app.get('/Register',(req,res)=>{
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
 const registered=await registeremp.save();
res.status(201).render("index");
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