const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const CustomMenu = new Schema({
  enabled: {
    type: Boolean,
    default: true,
  },
  slug: {
    type: String,
    required: "Please supply a slug",
    trim: true,
  },
  title: {
    type: String,
    required: "Please supply a title",
    trim: true,
  },
  icon: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomMenu",
  },
  class: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("CustomMenu", CustomMenu);
