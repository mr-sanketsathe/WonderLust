const listing=require('../models/listing.js');


//index controller
module.exports.index=(async(req,res,next)=>{
  let  data= await listing.find();
  if(!data){
    throw new ExpressError(404,"Data not found");
  }else{
      res.render("./listings/index.ejs",{data});
  }
 });
 //add controller
 module.exports.add=((req,res)=>{
   res.render("./listings/new.ejs"); 
  });
 
//show controller
 module.exports.show=(async(req,res,next)=>{
    let {id}=req.params;
    // console.log("this is user:",res.locals.user);
    let data= await listing.findById(id)
    .populate({
      path:'reviews',populate:{
         path:'author'
      },
    })
    .populate('owner');
    // console.log(data);
    if(!data){
      next(new ExpressError(404,"listing not found"));
      req.flash('error','listing not found');
      res.redirect('/listing');
    }else{
        res.render("./listings/show.ejs",{data});
       
  
    }
    
 });

 //create controller

 module.exports.create=(async(req,res,next)=>{
          let {title,description,price,location,country}=req.body;
          let owner=req.user;
          let url=req.file.path;
          let filename=req.file.filename;
          let newData= new listing({
            title:title,
            description:description,
            price:price,
            location:location,
            country:country,
            owner:owner
          });
          newData.image={url,filename};
          let addedData=await newData.save();
          console.log(addedData);        
          req.flash('success','New listing created');
          res.redirect("/listing"); 
 });

 //edit controller
 module.exports.edit=(async (req,res,next)=>{
     let {id}=req.params;
     let data= await listing.findById(id);
     if(!data){
       throw new ExpressError(404,"data not found");
     }
     res.render("./listings/edit.ejs",{data});
     });
 //edited controller
 module.exports.edited=(async (req,res,next)=>{
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

 });

 //destroy controller
 module.exports.destroy=(async(req,res,next)=>{
       let {id}=req.params;
       let deleteData= await listing.findByIdAndDelete(id);
       if(!deleteData){
         next(new ExpressError(404,"Data not found"));
       }else{
          req.flash("error",'Listing deleted');
           res.redirect("/listing");
       }       
        });

 

