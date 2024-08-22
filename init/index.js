if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listening.js");
const dbUrl = 'mongodb+srv://123princegaur9586:vJ7DyktOSFFG21ri@wanderlust.u8mv9bx.mongodb.net/?retryWrites=true&w=majority&appName=WanderLust';

main().then(()=>{
    console.log("connection to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

let categoryAll = [
	"Beachfront",
	"Caves",
	"Lake",
	"Farms",
	"Rooms",
	"Lakefront",
	"Tiny Homes",
	"Treehouse",
	"Trending",
	"Tropical",
	"Camping",
	"Earth Homes",
];

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj,  owner: "6680e5dfd4b86f40f367392c"}));
    category: [
        `${categoryAll[Math.floor(Math.random() * categoryAll.length)]}`,
        `${categoryAll[Math.floor(Math.random() * categoryAll.length)]}`,
    ],

    await Listing.insertMany(initData.data);         //initData is object..........
    console.log("data was initialized");
}

initDB();



