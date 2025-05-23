const mongoose=require("mongoose");
const express=require("express");
const listing = require("./models/listing.js");
const methodOverride=require("method-override");
const engine=require('ejs-mate');
const app=express();
const path=require("path");
const review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const wrapAsync=require("./utils/wrapAsync.js");
const session=require('express-session');
const flash=require('connect-flash');
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
main()
.then((res)=> console.log("connection successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',engine);
app.get("/",(req,res)=>{
   res.send("root branch");
 })
const sessionOptions={
  secret:'mysecret',
  resave:false,
  saveUninitialized:true
}
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  console.log(req.flash('s'));
  next();
});
app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews);

//error handler 
  app.use((err,req,res,next)=>{
    let {status=500,msg="some error occured"}=err;
    res.status(status).render("error.ejs",{msg});
    
  })
  
  
  app.listen(3000,()=>{
    console.log("listening to 3000");

  })

