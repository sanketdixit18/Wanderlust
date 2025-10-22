const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    reviewText: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  },
  
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
