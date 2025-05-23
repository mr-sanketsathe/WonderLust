const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviewSchema= new Schema({
    
        comment:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true,
            

        },
        createdAt:{
            type: Date,
            default:Date.now(),
        }
    });
 
let review=mongoose.model("review",reviewSchema);
module.exports=review;