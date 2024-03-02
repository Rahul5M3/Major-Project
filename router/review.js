const express=require('express');
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require('../schema.js');
const Review=require('../models/reviews.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const Listing=require('../models/listing.js');
const {validateReview, isLoggedin,isReviewAuthor}=require('../middleware.js');

const reviewController=require("../controller/review.js");



////----------------------------------------------------------------------------insert rout inserting review in db   post rout
router.post('/',isLoggedin, validateReview, wrapAsync(reviewController.createReview));

////---------------------------------------------------------------------------delete rout
router.get("/:reviewID/delete",isLoggedin,isReviewAuthor, reviewController.destroyReview)



module.exports=router;
