const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// Show booking form
router.get("/:id/book", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).send("Listing not found");
  res.render("bookings/form", { listing });
});

// Handle booking submission
router.post("/:id/book", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body;

  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).send("Listing not found");

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    checkIn,
    checkOut,
    guests,
  });

  await booking.save();
  req.flash("success", "Booking successful!");
  res.redirect(`/listings/${id}`);
});

// Show all bookings of logged-in user
router.get("/my-bookings", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("bookings/dashboard", { bookings });
});

// Cancel booking
router.delete("/:listingId/bookings/:bookingId", isLoggedIn, async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You can only cancel your own bookings!");
    return res.redirect("/listings/my-bookings");
  }

  await Booking.findByIdAndDelete(bookingId);
  req.flash("success", "Booking canceled successfully!");
  res.redirect("/listings/my-bookings");
});


module.exports = router;
