 const express=require('express');
 const router=express.Router({ mergeParams: true });
 const review=require("../models/review.js");
 const ExpressError=require("../utils/ExpressError.js");
 const wrapAsync=require("../utils/wrapAsync.js");
 const Listing=require("../models/listing.js");

//review  route
  router.post("/",wrapAsync(async(req,res,next)=>{
      let data=await Listing.findById(req.params.id);
      console.log(req.body.review);
      if(req.body.review===undefined){
        next(new ExpressError(404,"add relevent infomation"));
      }else{
        let{rating,comment}=req.body.review;
        if(((rating || comment)  === ' '||null ||undefined) ||(!comment ||!rating)) {
          next(new ExpressError(404,"add review data correctly"));
        }else{
         let newReview=new review(req.body.review);
         data.reviews.push(newReview);
         try{
            let result1=await newReview.save();
            let result2=await data.save();
            console.log(result1);
            console.log(result2);
        }catch(e){
            console.log(e.message);
        }
         req.flash('success','New review created');
         res.redirect(`/listing/${req.params.id}`);
        }
          
      }
     
      }));
   
    
//delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let{id,reviewId}=req.params;
  let result=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await review.findByIdAndDelete(reviewId);
  req.flash('success','Review deleted');
  res.redirect(`/listing/${id}`);

}));

module.exports=router;