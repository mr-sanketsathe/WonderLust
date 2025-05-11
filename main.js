const mongoose=require("mongoose");
const listing=require("./models/listing.js");
const express=require("express");
const methodOverride=require("method-override");
const app=express();
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
main()
.then((res)=> console.log("connection successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}
 app.get("/",(req,res)=>{
   res.send("root branch");
 })
//index route
 app.get("/listing", async(req,res)=>{
  let  data= await listing.find();
  res.render("index.ejs",{data});

 })

 //add route
 app.get("/listing/new",(req,res)=>{
     res.render("new.ejs");
 })
 
 app.post("/listing/new", async(req,res)=>{
    let {title,description,image,price,location,country}=req.body;
    let newData= await  listing.insertOne({
      title:title,
      description:description,
      image:image,
      price:price,
      location:location,
      country:country
    });
    console.log(newData);
    res.redirect("/listing");

 })
 //show route
 app.get("/listing/:id", async(req,res)=>{
    let {id}=req.params;
    let data= await listing.findById(id);
    res.render("show.ejs",{data});
  
 })

 //edit route
 app.get("/listing/:id/edit", async (req,res)=>{
    let {id}=req.params;
    let data= await listing.findById(id);
    res.render("edit.ejs",{data});
    
    
 })

 app.put("/listing/:id/edited", async (req,res)=>{
    let {id}=req.params;
    let {title,description,image,price,location,country}=req.body;
   let newData= await listing.updateOne({_id:id},{
      title:title,
      description:description,
      image:image,
      price:price,
      location:location,
      country:country
    })
    console.log(newData);
    res.redirect(`/listing/${id}`);

 })

  //destroy route
  app.delete("/listing/:id", async(req,res)=>{
      let {id}=req.params;
      let deleteData= await listing.findByIdAndDelete(id);
      res.redirect("/listing");
  })
app.listen(3000,()=>{
  console.log("listening to 3000");

})

