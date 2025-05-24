const express=require('express');
const router=express.Router({mergeParams:true});
const user=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');


router.get('/signup',(req,res)=>{
     res.render("../views/users/signup.ejs");
});
router.post('/signup',wrapAsync(async(req,res,next)=>{
    try{
        let{username,email,password}=req.body;
        if(username & email & password){
             let newUser={
            username:username,
            email:email,
        };
            let registeredUser=user.register(newUser, password);
            console.log(registeredUser);
            res.redirect('/listing');

        }else{
            next(new ExpressError(404,'add all credentials'));
        }
       
    }catch(e){
        res.send(e.message);
    }
}));

router.get('/login',(req,res)=>{
    res.render("../views/users/login.ejs");
})

router.post('/login',wrapAsync(async(req,res,next)=>{
    let {username,password}=req.body;
   if(username & password){
        let registeredUser=await user.findOne({
        username:username,
    })
        if(registeredUser){
            req.flash('success','user logic successfully');
            res.redirect('/listing');
        }else{
            req.flash('success','user not found');
            res.redirect('/login');
        }
   }else{
    next(new ExpressError(404,'Add all creadentials'));
    
   }
    
    
}));

module.exports=router;
