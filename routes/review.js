 const express=require('express');
 const router=express.Router({ mergeParams: true });
 const review=require("../models/review.js");
 const ExpressError=require("../utils/ExpressError.js");
 const wrapAsync=require("../utils/wrapAsync.js");
 const Listing=require("../models/listing.js");
 const { isLoggedIn,isReviewOwner} = require('../middleware.js');
 const reviewController=require('../controllers/reviews.js');


//review  route
  router.post("/",isLoggedIn,wrapAsync(reviewController.createReview));
   
    
//delete route
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(reviewController.destroyReview));

module.exports=router;