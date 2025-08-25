const express = require("express");
const app = express();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const review = require("../models/review.js");
const router = express.Router({mergeParams: true});
const {isLoggedIn , isReviewAuthor,validateReview} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

//review 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.renderReview));

//delete reviews
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;