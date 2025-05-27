const user=require('../models/user');
//signup render controller
module.exports.renderSignup=((req,res)=>{
     res.render("users/signup.ejs");
});

module.exports.signup=(async(req,res,next)=>{
    try{
         let{username,password,email}=req.body;
         let newUser= new user({
            username:username,
            email:email,
          });
        
        let registeredUser= await user.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }else{
                 req.flash('success','Welcome to wonderlust');
                 res.redirect('/listing');
            }
        })
     
       
    }catch(e){
        res.send(e.message);
    }  
});

module.exports.renderLogin=((req,res)=>{
    res.render("../views/users/login.ejs");
});
module.exports.login=(async(req,res)=>{
    req.flash('success',"login successful");
     let redirecturl=res.locals.redirectUrl || '/listing';
     res.redirect(redirecturl);
});


module.exports.logout=((req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }else{
            req.flash('success',' log out successful');
            res.redirect('/listing');
        }
    })
});