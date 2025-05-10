const mongoose=require("mongoose");
const listing=require("./models/listing.js");

main()
.then((res)=> console.log("connection successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}
