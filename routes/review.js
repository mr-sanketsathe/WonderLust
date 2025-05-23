 const express=require('express');
 const router=express.Router();
 const review=require("../models/review.js");
 const ExpressError=require("../utils/ExpressError.js");
 const wrapAsync=require("../utils/wrapAsync.js");
 const reviewSchema=require("../Schema.js");
 const Listing=require("../models/listing.js");

//review  route
  router.post("/",wrapAsync(async(req,res,next)=>{
      let data=await listing.findById(req.params.id);
      if(req.body.review===undefined){
        next(new ExpressError(404,"add relevent infomation"));
      }else{
        let{rating,comment}=req.body.review;
        if(((rating || comment)  === ' '||null ||undefined) ||(!comment ||!rating)) {
          next(new ExpressError(404,"add review data correctly"));
        }else{
         let newReview=new review(req.body.review);
         data.reviews.push(newReview);
         let result1=await newReview.save();
         let result2=await data.save();
         res.redirect(`/listing/${req.params.id}`);
        }
          
      }
     
      }));
   
    
//delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let{id,reviewId}=req.params;
  let result=await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  console.log(result);
  await review.findByIdAndDelete(reviewId);
  res.redirect(`/listing/${id}`);

}));

module.exports=router;