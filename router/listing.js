const express = require("express");
const app = express();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, validateContact } = require("../middleware.js");
const router = express.Router();
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// All listing
router.get("/", wrapAsync(listingController.index));
//For Search 
router.get("/search", wrapAsync(listingController.search));
//For filter
router.get("/filter",wrapAsync(listingController.filter));
//About section
router.get("/about", listingController.about);
//contact section
router.get("/contact", listingController.contact);
router.post("/contact", isLoggedIn, validateContact, listingController.contactPost);
//create new information
router.get("/new", isLoggedIn, listingController.createNewInfo);

router.post("/", upload.single('Listing[image]'), validateListing, wrapAsync(listingController.renderNewInfo));

//go to form for edit individual list
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// edit list
router.put("/:id", upload.single('Listing[image]'), validateListing, wrapAsync(listingController.editForm));
// details of individual card
router.get("/:id", wrapAsync(listingController.individualList));


//delete card
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteList));

module.exports = router;
