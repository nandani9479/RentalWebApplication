const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
// const { reviewSchema} = require("../schema.js");
const Listing= require("../models/listening.js");
const {validateReview, isLogin, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controlers/reviews.js");



//post route
router.post("/",validateReview, isLogin ,wrapAsync(reviewController.postReview));


//delete route .......................................
router.delete("/:reviewId", isLogin, isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;