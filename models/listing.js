const mongoose = require("mongoose");
const Schema = mongoose;
const Review = require("./review.js");
const { ref, string } = require("joi");
const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "default-image"
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format",
      set: (v) =>
        !v
          ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  category: {
    type: String,
    enum: [
        "Hotel",
        "Resort",
        "Villa",
        "Apartment",
        "Hostel",
        "Cabin",
        "Cottage",
        "Farmhouse",
        "Tent",
        "Camping",
        "Treehouse",
        "Guesthouse",
        "Homestay",
        "Beach House",
        "Mountain Stay",
        "Boat",
        "Other"
    ],
    required: true
}
});


//creata a middleware for delete all reviews when delete a list
listSchema.post("findOneAndDelete",async (listing) => {
  if (listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});
const listing = mongoose.model("listing", listSchema);

module.exports = listing;
