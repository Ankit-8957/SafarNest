const User = require("../models/user.js");

module.exports.renderUser = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let result = await User.register(newUser, password);
        req.login(result,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Now you are Logged In");
        res.redirect("/listing");
        });
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
        console.log(e);
    }
}

module.exports.login = (req,res) => {
    res.render("users/login.ejs");    
}
module.exports.renderLogin = async (req,res) => {
    req.flash("success","Welcome, You are logged in successfully!!");
    if (res.locals.redirectUrl) {
        return  res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/listing");
   
}
module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Now you are logged out");
        res.redirect("/listing");
    });
}