// const mongoose=require('mongoose');
// const initData=require('./data.js');
// const Listing=require('../models/listing.js');

// main()
// .then(()=>{
//     console.log('Connected to DB');
// })
// .catch(err=>{
//     console.log(err);
// })

// async function main(){
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

// const initDB= async ()=>{
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
//     //await Listing.insertMany(initData.data);
    // console.log(initData.data);
//     console.log('successfully inserted');
// };

// initDB();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"65ddfbf45f53c8ad109d9803",}));
    await Listing.insertMany(initData.data);
    // console.log(initData.data);
    console.log("data was initialized");
};

initDB();