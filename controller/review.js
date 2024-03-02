const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    
    let newReview=new Review(req.body.review);
    
    list.reviews.push(newReview);
    newReview.author=req.user._id;
    await newReview.save();
    await list.save();
    req.flash("success","New Review Created");
    // console.log('new review saved');
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview=async (req,res)=>{
    let {id,reviewID}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}