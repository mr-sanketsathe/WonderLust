const Listing=require('../models/listing');
const review=require('../models/review');
module.exports.createReview=(async(req,res,next)=>{
      let data=await Listing.findById(req.params.id);
      if(req.body.review===undefined){
        next(new ExpressError(404,"add relevent infomation"));
      }else{
        let{rating,comment}=req.body.review;
        if(((rating || comment)  === ' '||null ||undefined) ||(!comment ||!rating)) {
          next(new ExpressError(404,"add review data correctly"));
        }else{
         let newReview=new review(req.body.review);
         newReview.author=req.user._id;
         data.reviews.push(newReview);
         try{
            await newReview.save();
            await data.save();
           

           
        }catch(e){
            console.log(e.message);
        }
         req.flash('success','New review created');
         res.redirect(`/listing/${req.params.id}`);
        }
          
      }
     
      });

module.exports.destroyReview=(async(req,res)=>{
  let{id,reviewId}=req.params;
  let result=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await review.findByIdAndDelete(reviewId);
  req.flash('error','Review deleted');
  res.redirect(`/listing/${id}`);

});