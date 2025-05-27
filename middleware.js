const listing=require("./models/listing.js");
const review=require("./models/review.js");
module.exports.isLoggedIn=(req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in please login');
        req.session.redirectUrl=req.originalUrl;
        return res.redirect('/login');
    }
    
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let data=await listing.findById(id);
    if(!res.locals.user._id.equals(data.owner)){
       req.flash('error','You are not owner of this listing');
       return  res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.isReviewOwner= async(req,res,next)=>{
   let{id,reviewId}=req.params;
    let reviewData= await review.findById(reviewId);
    if(!res.locals.user.equals(reviewData.author)){
       req.flash('error','You are not author of this review');
       return  res.redirect(`/listing/${id}`);
    }
    next();
};

