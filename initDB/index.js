const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}

initData.data=initData.data.map((obj)=>({...obj,owner:'6831900fdccb8fc88e8b2f35'}));
  
listing.insertMany(initData.data)
.then((res)=> console.log('data saved successfully'))
.catch((err)=> console.log(err));

