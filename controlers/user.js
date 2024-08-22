const User = require("../models/user.js");



module.exports.renderSign = (req,res)=>{
    res.render("users/signUp.ejs");
}

module.exports.signUp = async(req,res)=>{
    try{  
         let {username , email , password} = req.body;
    const newUser = new User ({email,username});
    const registered = await User.register(newUser, password);
    req.flash("success", "Welcome to Wanderlust");
    res.redirect("/listings");
}catch(e){
    req.flash("error", e.message);
    res.redirect("/signUp");
}

}


module.exports.renderLogin =  (req,res)=>{
    res.render("users/login.ejs");
   
}

module.exports.logIn = async(req,res)=>{
    req.flash("success", "Welcome back to Wanderlaust");
    // res.send("welcome to my  wanderlust");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);           //res.locals.redirectUrl........
}

module.exports.LogOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}