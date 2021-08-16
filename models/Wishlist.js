const mongoose = require("mongoose");

const wishistSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wishlist", wishlistSchema);
