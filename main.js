if(process.env.NODE_ENV !='production'){
  require('dotenv').config();
}
const mongoose=require("mongoose");
const express=require("express");
const methodOverride=require("method-override");
const engine=require('ejs-mate');
const app=express();
const path=require("path");
const session=require('express-session');
const mongoStore=require('connect-mongo');
const flash=require('connect-flash');
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require('./routes/user.js');
const passport=require('passport');
const LocalStratergy=require('passport-local').Strategy;
const user=require('./models/user.js');
const  dbUrl=process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbUrl);
}
main()
.then(()=> console.log("connection successful"))
.catch(err => console.log(err));


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',engine);
const store=mongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
const sessionOptions={
  store:store,
  secret:process.env.SECRET,
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
  res.locals.error=req.flash('error');
  res.locals.user=req.user;
  console.log(res.locals.user);
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

