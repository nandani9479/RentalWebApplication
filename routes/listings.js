const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing= require("../models/listening.js");
const { isLogin, isOwner, validateListing } = require("../middleware.js");

const listingControler = require("../controlers/listings.js");
const multer  = require('multer');
// const upload = multer({ dest: 'uploads/' });
const{storage} = require("../cloudConfig.js");
const upload = multer({storage});



//INDEX ROUTE
router.get("/"  , wrapAsync(listingControler.index));



//NEW and CREATE ROUTE...........................
router.get("/new", isLogin, listingControler.renderForm);
router.get("/search", wrapAsync(listingControler.search));
router.get("/filter/:id", wrapAsync(listingControler.filter));


//READ/SHOW  ROUTE.......
router.get("/:id"  , wrapAsync(listingControler.showController));



//create route........................
router.post("/",   isLogin,
upload.single('listing[image]'), 
validateListing, 
wrapAsync(listingControler.postController));

 


//EDIT ROUTE.....................
router.get("/:id/edit" ,isLogin ,
 isOwner,
  wrapAsync(listingControler.editRander));


//UPDATE ROUTE......................
router.put("/:id"  ,isLogin,
upload.single('listing[image]'), 
 validateListing,
  isOwner,
   wrapAsync(listingControler.updateController));


//delete route....................
router.delete("/:id" , isLogin, isOwner, listingControler.deleteController);

module.exports = router;
