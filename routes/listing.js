const express=require('express');
const router=express.Router();
const listing = require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../Schema.js");


//index route
 router.get("/", async(req,res,next)=>{
  let  data= await listing.find();
  if(!data){
    throw new ExpressError(404,"Data not found");
  }
  res.render("./listings/index.ejs",{data});

 })
//add route
 router.get("/new",(req,res)=>{
     res.render("./listings/new.ejs");
 })
 

 //show route
 router.get("/:id", wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let data= await listing.findById(id).populate('reviews');
    if(!data){
      next(new ExpressError(404,"listing not found"));
    }else{
        res.render("./listings/show.ejs",{data});
  
    }
    
 }));
 //create route
router.post("/new",wrapAsync(async(req,res,next)=>{
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
            country:country,
          });
          let addedData=await newData.save();
          // console.log(addedData);
          req.flash('success','New listing created');
          res.redirect("/listing");  

 }));
 
 

 //edit route
 router.get("/:id/edit",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let data= await listing.findById(id);
    if(!data){
      throw new ExpressError(404,"data not found");
    }
    res.render("./listings/edit.ejs",{data});
    }));

 router.put("/:id/edited",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    
    if(req.body===undefined || null){
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
    req.flash('success','Listing edited');
    res.redirect(`/listing/${id}`);
  }

 }));

  //destroy route
  router.delete("/:id",wrapAsync(async(req,res,next)=>{
      let {id}=req.params;
      let deleteData= await listing.findByIdAndDelete(id);
      if(!deleteData){
        next(new ExpressError(404,"Data not found"));
      }else{
         req.flash("success",'Listing deleted');
          res.redirect("/listing");
       

      }
       }));
    
 

  module.exports=router;