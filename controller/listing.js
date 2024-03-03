const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    let {g}=req.query;
    if(g){
        const Alllist = await Listing.find({$or:[{title:g, description:g,  location:g, country:g}]});
        if(Alllist.length>0){
            return res.render('listings/index.ejs',{Alllist}); 
        }
    }
    const Alllist = await Listing.find();
    // console.log(list);
    res.render('listings/index.ejs',{Alllist});
};

module.exports.renderNewForm=(req,res)=>{
    res.render('listings/new.ejs');
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listing){
        req.flash('error','Listing you requested for does not exit');
        res.redirect('/listings');
    }
    // console.log(listing);
    res.render('listings/show.ejs',{listing});
};

module.exports.createListing=async (req,res,next)=>{

    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send();

    let url=req.file.path;
    let filename=req.file.filename;
    let list=req.body.listing;
    // console.log(url,"..",filename);
    // console.log(list);
    const lists=new Listing(list);
    lists.owner=req.user._id;
    // lists.image.url=url;
    // lists.image.filename=filename;
    lists.image={url,filename};
    lists.geometry=response.body.features[0].geometry;
    // console.log(lists);
    await lists.save();
    req.flash("success","New Listing Created");
    res.redirect('/listings');
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let lists= await Listing.findById(id);
    if(!lists){
        req.flash('error','Listing you requested for does not exit');
        res.redirect('/listings');
    }
    // console.log(lists);
    let originalImg=lists.image.url;
    originalImg=originalImg.replace("/upload","/upload/w_250");
    res.render('listings/edit.ejs',{lists,originalImg});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.file);
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success"," Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deleteList=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect('/listings');
};


