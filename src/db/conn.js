const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/blooddata",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
   // useCreateIndex:true
}).then(()=>{
    console.log(`Connection Succesfully`);
}).catch((e)=>{
    console.log(e);
})
