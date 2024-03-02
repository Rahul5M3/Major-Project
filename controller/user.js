const User=require("../models/user.js");



module.exports.renderSignupForm=(req,res)=>{
    // res.send('form');
    res.render('users/form.ejs');
};

module.exports.signup=async (req,res)=>{
    try{
        let {email,username,password}=req.body;
        const newUser=new User({email,username});
        const registerUser=await User.register(newUser,password);
        req.login(registerUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash('success',"Welcome to WanderLust");
            res.redirect('/listings');
        })
        // req.flash('success',"Registered Successfully");
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login.ejs');
};

module.exports.login=async (req,res)=>{
    req.flash('success',"Welcome to WanderLust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);  
};

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        else {
            req.flash('success',"Successfully Loggout");
            res.redirect('/listings');
        }
    })
};