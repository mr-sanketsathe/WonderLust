const express=require('express');
const router=express.Router();
// const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
// const {listingSchema}=require("../Schema.js");
const {isLoggedIn,isOwner}=require('../middleware.js');
const controllerListing=require('../controllers/listings.js');
const {storage}=require('../cloudConfig.js');
const multer=require('multer');
const upload=multer({storage});


router.get("/",wrapAsync(controllerListing.index));
//renderNewform and create new listing 
router.route('/new')
  .get(isLoggedIn,(controllerListing.add))
  .post(isLoggedIn,upload.single('image'),wrapAsync(controllerListing.create));
  

//show and destroy route
router.route('/:id')
  .get(isLoggedIn,wrapAsync(controllerListing.show))
  .delete(isLoggedIn,isOwner,wrapAsync(controllerListing.destroy));


 //renderEditform and update route
router.route('/:id/edit')
  .get(isLoggedIn,isOwner,wrapAsync(controllerListing.edit))
  .put(isLoggedIn,upload.single('image'),isOwner,wrapAsync(controllerListing.edited));


 

  module.exports=router;