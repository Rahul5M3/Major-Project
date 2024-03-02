if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
 
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require('./models/listing.js');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('./schema.js');
const Review=require('./models/reviews.js');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const passport=require("passport");
const User=require('./models/user.js');
const LocalStrategy=require('passport-local');

const listingRouter=require('./router/listing.js');
const reviewRouter=require('./router/review.js');
const userRouter=require('./router/user.js');



app.listen(8080,()=>{
    console.log('Server Started');
})

const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log('Connected to DB');
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
}); 

store.on("ERROR",()=>{
    console.log('Error in mongo session',err);
});

const sessionOption={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
    }
}

//// always use flash and session before app.use('/listings',listing) and app.use('/listings/:id/review',review)
app.use(session(sessionOption));
app.use(flash());

////-------------------------------------------for passport means login 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

app.use(express.urlencoded({extended:true}))
app.use(express.json())



// // -------------------------------------------------------------------------------------------------Root Rout
app.get('/',((req,res)=>{
    res.redirect('/listings');
}))

////------------------------------------------------------creating middleware for flash pop up msg
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


// //-----------------------------------all routs start with /listings goes in this and from here to router/listing.js 
app.use('/listings',listingRouter);

// //-----------------------------------all routs start with /listings/:id/review goes in this and from here to router/review.js
app.use('/listings/:id/review',reviewRouter);

// // -----------------------------------------------------user router same like above 2
app.use('/',userRouter);

////-----------------------------------------------------------------------------------------------------------------
app.all('*',(req,res,next)=>{
    throw new ExpressError(404,"Page not found");
})

// //----------------------------------------------------------------------------------------------------error handling
app.use((err,req,res,next)=>{   
    let {status=404,message="Page not found"}=err;
    // res.status(status).send(message);
    res.status(status).render('error.ejs',{err});
})

