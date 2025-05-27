const mongoose=require("mongoose");
const review=require("./review.js");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    image: {
        url:String,
        filename:String,
      },
      
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'review',
        }
        
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
    

});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await review.deleteMany({_id:{$in:listing.reviews}});
    }
   

})
const listing=new mongoose.model("listing",listingSchema);
module.exports=listing;


