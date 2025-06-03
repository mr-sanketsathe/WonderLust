const express=require('express');
const router=express.Router({mergeParams:true});
const user=require('../models/user.js');
const ExpressError = require('../utils/ExpressError.js');
const passport = require('passport');
const{saveRedirectUrl}=require('../middleware.js');
const userControllers=require('../controllers/users.js');

//renderSignupform and signUp

router.route('/signup')
    .get((userControllers.renderSignup))
    .post( (userControllers.signup));

//renderLoginform and login
router.route('/login')
    .get((userControllers.renderLogin))
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),(userControllers.login));

router.get('/logout',(userControllers.logout));


module.exports=router;
