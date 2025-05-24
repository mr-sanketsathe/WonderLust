const mongoose=require("mongoose");
const express=require("express");
const methodOverride=require("method-override");
const engine=require('ejs-mate');
const app=express();
const path=require("path");
const session=require('express-session');
const flash=require('connect-flash');
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require('./routes/user.js');
const passport=require('passport');
const LocalStratergy=require('passport-local').Strategy;
const user=require('./models/user.js');
main()
.then(()=> console.log("connection successful"))
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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  next();
});
app.use("/listing",listingsRouter);
app.use("/listing/:id/reviews",reviewsRouter);
app.use('/',userRouter);



//error handler 
  app.use((err,req,res,next)=>{
    let {status=500,msg="some error occured"}=err;
    res.status(status).render("error.ejs",{msg});
    next();
  })
  
  
  app.listen(3000,()=>{
    console.log("listening to 3000");

  })

