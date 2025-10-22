const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

// DELETE review route (secure)
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
  const { id, reviewId } = req.params;

  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
});

// POST review route
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).send("Listing not found");

    // Use the logged-in user as the author
    const review = new Review({
      reviewText: req.body.reviewText,
      rating: Number(req.body.rating),
      author: req.user._id, // ✅ actual logged-in user
      property: listing._id,
    });

    await review.save();

    listing.reviews.push(review);
    await listing.save();

    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Error submitting review:", err);
    req.flash("error", "Error submitting review!");
    res.redirect(`/listings/${req.params.id}`);
  }
});


module.exports = router;
