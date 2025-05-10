const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}

listing.insertMany(initData.data)
.then((res)=> console.log('data saved successfully'))
.catch((err)=> console.log(err));

