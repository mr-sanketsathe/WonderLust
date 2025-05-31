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
    if(!data){
      next(new ExpressError(404,"listing not found"));
      req.flash('error','listing not found');
      res.redirect('/listing');
    }else{
      res.render("./listings/show.ejs",{data,});
        }
    
 });

 //create controller

 module.exports.create=(async(req,res,next)=>{  
        let {title,description,price,location,country}=req.body;
         const address = `${location}, ${country}`;
          const api = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`;
          const response = await fetch(api, {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'LeafletAppExample/1.0', // Required for Nominatim's usage policy
                  
              }
            });
           const data = await response.json();
           console.log(data);
           if(!data ||data.length==0){
               req.flash("could not find location");
              }
              let lat=data[0].lat;
              let lon=data[0].lon;
              let owner=req.user;
              let url=req.file.path;
              let filename=req.file.filename;
              let newData= new listing({
                title:title,
                description:description,
                price:price,
                location:location,
                country:country,
                owner:owner,
              });
              newData.image={url,filename};
              newData.coordinates=[lat,lon];
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
     }else{
         let originalImageUrl=data.image.url;
         originalImageUrl.replace('/upload','/upload/w_250');
         res.render("./listings/edit.ejs",{data,originalImageUrl});
     }
    
     });
 //edited controller
 module.exports.edited=(async (req,res,next)=>{
   
    if(req.body===undefined || null){
      next(new ExpressError(400,"add relevent infomation"));
    }else{
    let {id}=req.params;
    let url=req.file.path;
    let filename=req.file.filename;
    let {title,description,price,location,country}=req.body;
     const address = `${location}, ${country}`;
          const api = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`;
          const mapRes = await fetch(api, {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'LeafletAppExample/1.0', // Required for Nominatim's usage policy
                  
              }
            });
           const mapData = await mapRes.json();
           let lat=mapData[0].lat;
           let lon=mapData[0].lon;
            let data= await listing.updateOne(
            { _id: id },
            {
            $set: {
              title: title,
              description: description,
              price: price,
              location: location,
              image:{
                url:url,
                filename:filename,
              },
              country: country,
              coordinates:[lat,lon],
              },
              }
            );

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

 

