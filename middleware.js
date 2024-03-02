const Listing=require('./models/listing.js');
const Review=require('./models/reviews.js');
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('./schema.js');

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error',"Please Logged in for creating listing");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    // if(req.session.redirectUrl){
    //     return res.locals.redirectUrl=req.session.redirectUrl;
    // }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    if(!( list.owner._id.equals(res.locals.currUser._id))){
        req.flash('error',"You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateReview= (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressErrorError(400,"Invalid data");
    }
    next(); 
}

module.exports.isReviewAuthor= async (req,res,next)=>{
    let {id,reviewID}=req.params; 
    let review=await Review.findById(reviewID);
    // console.log('---------------------------------');
    // console.log(review);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error',"You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
