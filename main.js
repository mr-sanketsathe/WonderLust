const mongoose=require("mongoose");
const listing=require("./models/listing.js");
const express=require("express");
const methodOverride=require("method-override");
const engine=require('ejs-mate');
const app=express();
const path=require("path");
const ExpressError=require("./utils/ExpressError.js");
const listingSchema=require("./Schema.js");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',engine);
main()
.then((res)=> console.log("connection successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}

const schemaValidation=(req,res,next)=>{
        let result=listingSchema.validate(req.body);
        if(result.error){
          next(new ExpressError(404,result.error));
        }
 }
 app.get("/",(req,res)=>{
   res.send("root branch");
 })

 
 
 //add route
 app.get("/listing/new",(req,res)=>{
     res.render("./listings/new.ejs");
 })
 
 app.post("/listing/new",schemaValidation, wrapAsync(async(req,res,next)=>{
          let {title,description,image,price,location,country}=req.body;
            if (!image || image.trim() === "") {
                image = "https://images.unsplash.com/photo-1631799200294-0f1212ae90f1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
              }
   
          let newData= new listing({
            title:title,
            description:description,
            image:image,
            price:price,
            location:location,
            country:country
          });
          let addedData=await newData.save();
          console.log(addedData);
          res.redirect("/listing");  

 }));

 app.get("/listing", async(req,res,next)=>{
  let  data= await listing.find();
  if(!data){
    throw new ExpressError(404,"Data not found");
  }
  res.render("./listings/index.ejs",{data});

 })
 //show route
 app.get("/listing/:id", wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let data= await listing.findById(id);
    if(!data){
      next(new ExpressError(404,"listing not found"));
    }else{
        res.render("./listings/show.ejs",{data});
  
    }
    
 }));

 //edit route
 app.get("/listing/:id/edit",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let data= await listing.findById(id);
    if(!data){
      throw new ExpressError(404,"data not found");
    }
    res.render("./listings/edit.ejs",{data});
    }));

 app.put("/listing/:id/edited", wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    if(req.body===undefined){
      next(new ExpressError(400,"add relevent infomation"));
    }else{
    let {title,description,image,price,location,country}=req.body;
    if (!image || image.trim() === "") {
    image = "https://images.unsplash.com/photo-1631799200294-0f1212ae90f1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
   };

   let newData= await listing.updateOne({_id:id},{
      title:title,
      description:description,
      image:image,
      price:price,
      location:location,
      country:country
    });
    console.log(newData);
    res.redirect(`/listing/${id}`);
  }

 }));

  //destroy route
  app.delete("/listing/:id",wrapAsync(async(req,res,next)=>{
      let {id}=req.params;
      let deleteData= await listing.findByIdAndDelete(id);
      if(!deleteData){
        next(new ExpressError(404,"Data not found"));
      }else{
          res.redirect("/listing");
          console.log(deleteData);

      }
       
      
      
  }));


  function wrapAsync(fn){
    return function(req,res,next){
      fn(req,res,next).catch((err)=> next(err));
    }
  };
  //error handler 
  app.use((err,req,res,next)=>{
    let {status=500,msg="some error occured"}=err;
    res.status(status).render("error.ejs",{msg});
    
  })
  
  
  app.listen(3000,()=>{
    console.log("listening to 3000");

  })

