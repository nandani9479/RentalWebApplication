const Listing = require("../models/listening");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async(req,res)=>{
    let allListen = await Listing.find({});
   // console.log(allListen);
    res.render("listings/index.ejs", {allListen});
};


module.exports.renderForm = (req,res)=>{
    res.render("listings/new.ejs");
};


module.exports.showController = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
       populate : {
        path:"author",
    }
    })
    .populate("owner");
    
    if(!listing){
        req.flash("error" , "listing does n't exit");
        res.redirect("/lsitings");
    }
    //console.log(listen);
    res.render("listings/show.ejs",  {listing});
    }


module.exports.postController = async (req, res, next)=>{
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    
    console.log(response.body.features[0].geometry);  

// let{title, description, image, price, location, country }= req.body;
let url = req.file.path;
let filename = req.file.filename;
// console.log(url, ".." , filename);

     const newListens =  new Listing(req.body.listing);
    //  console.log(req.user);
     newListens.owner = req.user._id;
     newListens.image = {url, filename};
     newListens.geometry = response.body.features[0].geometry;
    

    
      await newListens.save();
     
         req.flash("success", "New listing created!");
         res.redirect("/listings");
     
     //    let listens = req.body.listing;
     //    console.log(listens); 
     //    res.send("working");
     }


    module.exports.editRander = async(req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findById(id);
        if(!listing){
            req.flash("error" , "listing does n't exit");
            res.redirect("/lsitings");
        }

        let originalImageUrl = listing.image.url;
         originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

        res.render("listings/edit.ejs", {listing  ,  originalImageUrl});
    }


    module.exports.updateController = async(req,res)=>{
        let {id} = req.params; 
    
        const listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing });

        if( typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
        }

         req.flash("success", " Listing Updated!");
         res.redirect(`/listings`)
    }

    module.exports.deleteController = async(req,res)=>{
        let {id} = req.params; 
         let deleteListen = await Listing.findByIdAndDelete(id);
         req.flash("success", "Listing deleted!");
         res.redirect("/listings");
    }

    module.exports.search = async (req, res) => {
        // console.log(req.query.find);
        let input = req.query.find.trim().replace(/\s+/g, " "); // remove start and end space and middle space remove and middle add one space------
        console.log(input);
        if (input == "" || input == " ") {
            //search value empty
            req.flash("error", "Search value empty !!!");
            res.redirect("/listings");
        }
    
        // convert every word 1st latter capital and other small---------------
        let data = input.split("");
        let element = "";
        let flag = false;
        for (let index = 0; index < data.length; index++) {
            if (index == 0 || flag) {
                element = element + data[index].toUpperCase();
            } else {
                element = element + data[index].toLowerCase();
            }
            flag = data[index] == " ";
        }
        console.log(element);
    
        let allListen = await Listing.find({
            title: { $regex: element, $options: "i" },
        });
        if (allListen.length != 0) {
            res.locals.success = "Listings searched by Title";
            res.render("listings/index.ejs", { allListen });
            return;
        }
        if (allListen.length == 0) {
            allListen = await Listing.find({
                category: { $regex: element, $options: "i" },
            }).sort({ _id: -1 });
            if (allListen.length != 0) {
                res.locals.success = "Listings searched by Category";
                res.render("listings/index.ejs", { allListen });
                return;
            }
        }
        if (allListen.length == 0) {
            allListen = await Listing.find({
                country: { $regex: element, $options: "i" },
            }).sort({ _id: -1 });
            if (allListen.length != 0) {
                res.locals.success = "Listings searched by Country";
                res.render("listings/index.ejs", { allListen });
                return;
            }
        }
        if (allListen.length == 0) {
            let allListen = await Listing.find({
                location: { $regex: element, $options: "i" },
            }).sort({ _id: -1 });
            if (allListen.length != 0) {
                res.locals.success = "Listings searched by Location";
                res.render("listings/index.ejs", { allListen });
                return;
            }
        }
        const intValue = parseInt(element, 10); // 10 for decimal return - int ya NaN
        const intDec = Number.isInteger(intValue); // check intValue is Number & Not Number return - true ya false
    
        if (allListen.length == 0 && intDec) {
            allListen = await Listing.find({ price: { $lte: element } }).sort({
                price: 1,
            });
            if (allListen.length != 0) {
                res.locals.success = `Listings searched for less than Rs ${element}`;
                res.render("listings/index.ejs", { allListen });
                return;
            }
        }
        if (allListen.length == 0) {
            req.flash("error", "Listings is not here !!!");
            res.redirect("/listings");
        }
    };
  
    module.exports.filter = async (req, res, next) => {
        try {
            const { id } = req.params;
    
            if (!id) {
                req.flash("error", "Category ID is required.");
                return res.redirect("/listings");
            }
    
            // Find all listings where the category array contains the given category
            const allListen = await Listing.find({ category: { $all: [id] } });
    
            if (allListen.length > 0) {
                res.locals.success = `Listings found for category: ${id}`;
                res.render("listings/index", { allListen }); // Removed .ejs extension
            } else {
                req.flash("error", `No listings found`);
                res.redirect("/listings");
            }
        } catch (error) {
            console.error("Error filtering listings by category:", error);
            req.flash("error", "An error occurred while filtering listings.");
            res.redirect("/listings");
        }
    };
    
    
  

