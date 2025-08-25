const listing = require("../models/listing.js");
const review = require("../models/review.js");


module.exports.renderReview = async (req, res) => {
    let list = await listing.findById(req.params.id);
    let newReview = new review(req.body.Review);
    newReview.Author = req.user._id;
    list.reviews.push(newReview);

    await newReview.save();
    await list.save();
    res.redirect(`/listing/${req.params.id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}