const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const {listingSchema,reviewSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');
const Listing=require('../models/listing.js');
const {isLoggedin,isOwner,validateListing}=require('../middleware.js');

const multer=require('multer');
const {storage}=require('../cloudConfig.js');
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });

const ListingController=require("../controller/listing.js");

// // -----------------------------------------------------------------------------------------------------Index Rout
// // -----------------------------------------------------------------------------------------------------insert into db
router.route('/')
.get(wrapAsync(ListingController.index))  
.post(isLoggedin,upload.single('listing[image]'),validateListing, wrapAsync(ListingController.createListing))
// .post(upload.single('listing[image]'),(req,res)=>{res.send(req.file)})    

// // -----------------------------------------------------------------------------------------------------New Rout
router.get('/new',isLoggedin,wrapAsync(ListingController.renderNewForm))

// // ---------------------------------------------------------------------------------------------------Update Rout
// // -----------------------------------------------------------------------------------------------------Show Rout
//// -----------------------------------------------------------------------------------------------------Delete Rout
router.route("/:id")
.get(wrapAsync(ListingController.showListing  ))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(ListingController.updateListing))
.delete(isLoggedin,isOwner,wrapAsync(ListingController.destroyListing))

////-----------------------------------------------------------------------------------------edit rout
router.get('/:id/edit',isLoggedin,isOwner, wrapAsync(ListingController.renderEditForm))


module.exports=router;