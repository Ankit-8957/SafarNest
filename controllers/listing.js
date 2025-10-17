const listing = require("../models/listing.js");
const contact = require("../models/contact.js");
const sendMail = require("../utils/mailer.js");
module.exports.index = async (req, res) => {
    let allList = await listing.find({});
    res.render("./listing/index.ejs", { allList });
}

module.exports.createNewInfo = (req, res) => {    
    res.render("listing/newInfo.ejs");
}

module.exports.renderNewInfo = async (req, res) => {
    let filename = req.file.filename;
    let url = req.file.path;    
    const list = new listing(req.body.Listing);
    list.image = {filename , url};
    list.owner = req.user._id;
    await list.save();
    req.flash("success","New list added successfull");
    res.redirect("/listing");
    // res.send(req.file);
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if(!Listing){
        req.flash("error","List does not exists!!!");
        return res.redirect("/listing");
    }
    res.render("./listing/edit.ejs", { Listing });
}

module.exports.editForm = async (req, res, next) => {
    let { id } = req.params;
    let list  = await listing.findByIdAndUpdate(id, { ...req.body.Listing });
    if(typeof req.file !== "undefined"){
    let filename = req.file.filename;
    let url = req.file.path; 
    list.image = { filename,url };
    await list.save();
    }
    res.redirect(`/listing/${id}`);
    // res.send(req.file);
}

module.exports.individualList = async (req, res) => {
    let { id } = req.params;
    let details = await listing.findById(id).populate({path:"reviews",populate:{path: "Author"}}).populate("owner");
    if (!details) {
        req.flash("error","List is not available!!!");
        return res.redirect("/listing");
    }
    res.render("./listing/detail.ejs", { details });
}

module.exports.deleteList = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}

module.exports.about = (req,res)=>{
    res.render("listing/about.ejs");        
}



module.exports.search = async (req, res) => {
    let search = req.query.query;
    const priceQuery = isNaN(Number(search)) ? null : Number(search);
    const condition = [
         { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
    ];

    let allList = await listing.find({
        $or: condition
    });
    if(allList.length === 0 || priceQuery === Number(search)){
        req.flash("error","List not found !!");
        return res.redirect("/listing");
    }
    res.render("./listing/index.ejs", { allList });
}

module.exports.filter = async (req,res) => {
    let filter = req.query.price;
    const [min, max] = filter.split("-").map(Number);
    let allList = await listing.find({price: { $gte: min, $lte: max }});
    res.render("listing/index.ejs",{allList});    
}