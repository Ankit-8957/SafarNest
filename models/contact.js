const mongoose = require("mongoose");
const Schema = mongoose;

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:'User'
      }
});
const Contact = mongoose.model("Contact",contactSchema);
module.exports = Contact;