const { findById } = require("./models/review");
const listing = require("./models/listing.js");
const review = require("./models/review");
const { reviewSchema,listingSchema,contactSchema } = require("./schema.js");

const expressError = require("./utils/expressError.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You are not logged in !!!!!!!!");
        return res.redirect("/user/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if(!res.locals.currUser || !res.locals.currUser._id.equals(Listing.owner._id)){
        req.flash("error","Only owner can modify this !!!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let foundReview = await review.findById(reviewId);
     if (!foundReview) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listing/${id}`);
    }
    if(!res.locals.currUser || !res.locals.currUser._id.equals(foundReview.Author._id)){
        req.flash("error","Only Author can delete !!!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error);
    } else {
        next();
    }
};
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error);
    } else {
        next();
    }
};

module.exports.validateContact = (req,res,next)=>{
    const { error } = contactSchema.validate(req.body);
    if(error){
        throw new expressError(400, error);
    } else{
        next();
    }
};