const Listing= require("../models/listening.js");
const Review = require("../models/review.js");


module.exports.postReview = async(req,res)=>{
    let {id} = req.params; 
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", " New review created!");
    console.log("new review");
res.redirect(`/listings/${id}`)
}

module.exports.deleteReview = async (req,res)=>{
    let {id, reviewId} = req.params;

   await Listing.findByIdAndUpdate(id, { $pull: {reviews : reviewId}});
   await  Review.findByIdAndDelete(reviewId);
   req.flash("success", " Review deleted!");
   res.redirect(`/listings/${id}`)
}