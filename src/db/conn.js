const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://rishi1122:rishi1122@cluster0.gvop3b1.mongodb.net/test",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex: true,
   // useCreateIndex:true
}).then(()=>{
    console.log(`Connection Succesfully`);
}).catch((e)=>{
    console.log(e);
})
