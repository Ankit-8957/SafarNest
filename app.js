if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

const ListingRouter = require("./router/listing.js");
const ReviewsRouter = require("./router/reviews.js");
const userRouter = require("./router/user.js");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { log } = require('console');
//use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

// Use method override with query parameter ?_method=PUT or ?_method=DELETE
app.use(methodOverride('_method'));
const dbUrl = process.env.db_URL;
//setup connection of mongoose
main()
    .then(res => { console.log("Database is connected") })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
})
store.on("error", ()=>{
    console.log("Error in Mongo Session store" , err);    
});
app.use(session({
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Set EJS as the view engine
app.set("view engine", "ejs");

// Set views directory
app.set("views", path.join(__dirname, "views"));
// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
//local variables
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listing", ListingRouter);
app.use("/listing/:id/reviews", ReviewsRouter)
app.use("/", userRouter)

//express error handling
app.all(/.*/, (req, res, next) => {
    next(new expressError(404, "Page not found!!!!!"));
});
//error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", { err });
});

app.listen("8080", () => {
    console.log("Server start.........");
});