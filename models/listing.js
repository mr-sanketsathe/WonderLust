const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    image:{
        type: String,
        default:"https://unsplash.com/photos/tilt-shift-lens-photography-of-flower-field-during-sunset-13VwsTt9pAw",
        set : (v)=> v=== " "?"https://unsplash.com/photos/tilt-shift-lens-photography-of-flower-field-during-sunset-13VwsTt9pAw":v,
        
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
    }

});

const listing=new mongoose.model("listing",listingSchema);
module.exports=listing;


