

// // ====== IMPORTS ======
// const express = require("express");
// const router = express.Router({ mergeParams: true }); // needed to access :id
// const mongoose = require("mongoose");
// const path = require("path");
// const multer = require("multer");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const Listing = require("./models/listing.js");
// const wrapAsync=require("./utils/wrapAsync.js");
// const Review = require("./models/review.js");
// const reviewsRoutes = require("./routes/reviews");



// const app = express();

// // ====== DATABASE CONNECTION ======
// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
//   console.log("✅ Connected to MongoDB");
// }
// main().catch(err => console.error("❌ DB connection error:", err));



// app.use("/listings/:id/reviews", reviewsRoutes); // mount reviews router


// // ====== MIDDLEWARE SETUP ======
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));

// // Multer: Memory storage for image upload
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Mount review routes
// app.use("/listings/:id/reviews", reviewsRoutes);



// // ====== ROUTES ======

// // Home (basic route)
// app.get("/", (req, res) => {
//   res.send("Hello from server!");
// });

// // INDEX - Show all listings
// app.get("/listings", async (req, res) => {
//   try {
//     const allListings = await Listing.find({});
//     res.render("listings/index", { allListings });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("⚠️ Server Error while fetching listings");
//   }
// });

// // NEW - Show form to create a new listing
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new");
// });

// // CREATE - Add new listing to DB
// app.post("/listings", upload.single("image"), async (req, res) => {
//   try {
//     const { title, description, price, location, country, imageURL } = req.body;

//     const defaultPlaceholder =
//       "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdGVsfGVufDB8fDB8fHww";

//     let finalImageUrl = defaultPlaceholder;
//     let finalFilename = "default_or_url_input";

//     if (req.file) {
//       // ✅ Use uploaded file (Cloudinary/local depending on config)
//       finalImageUrl = req.file.path || defaultPlaceholder;
//       finalFilename = req.file.filename || req.file.originalname;
//     } else if (imageURL && imageURL.trim() !== "") {
//       finalImageUrl = imageURL.trim();
//     }

//     const newListing = new Listing({
//       title,
//       description,
//       price,
//       location,
//       country,
//       image: {
//         url: finalImageUrl,
//         filename: finalFilename,
//       },
//     });

//     await newListing.save();
//     console.log("✅ New listing saved:", newListing);
//     res.redirect("/listings");
//   } catch (err) {
//     console.error("❌ Error creating listing:", err);
//     res.status(500).send("⚠️ Server Error: " + err.message);
//   }
// });


// // SHOW - Show single listing
// app.get("/listings/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) return res.status(404).send("❌ Listing not found");
//     res.render("listings/show", { listing });
//   } catch (err) {
//     console.error("❌ Error fetching listing:", err);
//     res.status(500).send("⚠️ Server Error");
//   }
// });

// // EDIT - Show form to edit existing listing
// app.get("/listings/:id/edit", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) return res.status(404).send("❌ Listing not found");
//     res.render("listings/edit", { listing });
//   } catch (err) {
//     console.error("❌ Error loading edit form:", err);
//     res.status(500).send("⚠️ Server Error");
//   }
// });

// // UPDATE - Update listing in DB
// app.put("/listings/:id", upload.single("placeholder_name"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, price, location, country } = req.body;

//     await Listing.findByIdAndUpdate(id, {
//       title,
//       description,
//       price,
//       location,
//       country,
//     });

//     console.log("✅ Listing updated");
//     res.redirect(`/listings/${id}`);
//   } catch (err) {
//     console.error("❌ Error updating listing:", err);
//     res.status(500).send("⚠️ Server Error");
//   }
// });

// // DELETE - Remove listing from DB
// app.delete("/listings/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     console.log("🗑️ Listing deleted");
//     res.redirect("/listings");
//   } catch (err) {
//     console.error("❌ Error deleting listing:", err);
//     res.status(500).send("⚠️ Server Error");
//   }
// });

// // DELETE
// app.delete("/listings/:id", async (req, res) => {
//   await Listing.findByIdAndDelete(req.params.id);
//   res.redirect("/listings");
// });


// // ====== SERVER START ======
// app.listen(8080, () => {
//   console.log("🚀 Server is listening on port 8080");
// });






































const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const multer = require("multer");


const Listing = require("./models/listing");
const reviewsRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");

// ✅ Import middleware here
const { isLoggedIn, isAuthor } = require("./middleware");


const app = express();

// ====== DATABASE ======
mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// ====== MIDDLEWARE ======
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//Flash
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// 1️⃣ Session + Flash
app.use(session({
  secret: "thisisasecretkey",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 3️⃣ Middleware to make variables available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null; // important!
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


// ✅ Mount auth routes here
app.use("/", authRoutes);
app.use("/listings", bookingRoutes); // Mount under listings











// const storage = multer.memoryStorage();
// const upload = multer({ storage });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Mount review routes
app.use("/listings/:id/reviews", reviewsRoutes);

// ====== LISTING ROUTES ======

// Home
// app.get("/", (req, res) => res.send("Hello from server!"));
// Home route
app.get("/", async (req, res) => {
  try {
    // If you want to pass listings data to the template
    const allListings = await Listing.find({}); // assuming you have a Listing model
    res.render("listings/index", { allListings });
  } catch (err) {
    console.error(err);
    res.send("Error loading listings");
  }
});


// INDEX
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// NEW - show form to create a listing (only for logged-in users)
app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// CREATE - create a new listing (only for logged-in users)
// app.post("/listings", isLoggedIn, upload.single("image"), async (req, res) => {
//   const { title, description, price, location, country, imageURL } = req.body;

//   const finalImage = imageURL && imageURL.trim() !== "" 
//     ? imageURL 
//     : "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&auto=format&fit=crop&q=60";

//   const newListing = new Listing({
//     title,
//     description,
//     price,
//     location,
//     country,
//     image: { url: finalImage, filename: "placeholder" },
//     author: req.user._id // <-- ADD THIS
//   });

//   await newListing.save();
//   req.flash("success", "Listing added successfully!");
//   res.redirect("/listings");
// });



// app.post("/listings", isLoggedIn, upload.single("image"), async (req, res) => {
//   const { title, description, price, location, country, imageURL } = req.body;

//   let finalImage;

//   if (req.file) {
//     // If user uploaded an image file
//     finalImage = {
//       url: `/uploads/${req.file.filename}`,
//       //url: req.file.path,        // multer + Cloudinary gives path or location
//       filename: req.file.filename
//     };
//   } else if (imageURL && imageURL.trim() !== "") {
//     // If user provided image link manually
//     finalImage = {
//       url: imageURL,
//       filename: "manual-upload"
//     };
//   } else {
//     // Default placeholder image
//     finalImage = {
//       url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&auto=format&fit=crop&q=60",
//       filename: "placeholder"
//     };
//   }

//   const newListing = new Listing({
//     title,
//     description,
//     price,
//     location,
//     country,
//     image: finalImage,
//     author: req.user._id
//   });

//   await newListing.save();
//   req.flash("success", "Listing added successfully!");
//   res.redirect("/listings");
// });

app.post("/listings", isLoggedIn, upload.single("image"), async (req, res) => {
  const { title, description, price, location, country, imageURL } = req.body;

  let finalImage;

  if (req.file) {
    // If user uploaded an image file (stored locally)
    finalImage = {
      url: `/uploads/${req.file.filename}`, // serve from public/uploads
      filename: req.file.filename
    };
  } else if (imageURL && imageURL.trim() !== "") {
    // If user provided image link manually
    finalImage = {
      url: imageURL,
      filename: "manual-upload"
    };
  } else {
    // Default placeholder image
    finalImage = {
      url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&auto=format&fit=crop&q=60",
      filename: "placeholder"
    };
  }

  const newListing = new Listing({
    title,
    description,
    price,
    location,
    country,
    image: finalImage,
    author: req.user._id
  });

  await newListing.save();
  req.flash("success", "Listing added successfully!");
  res.redirect("/listings");
});



// SHOW
// app.get("/listings/:id", async (req, res) => {
//   const listing = await Listing.findById(req.params.id).populate("reviews");
//   if (!listing) return res.status(404).send("Listing not found");
//   res.render("listings/show", { listing });
// });
app.get("/listings/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("author"); // host

  if (!listing) return res.status(404).send("Listing not found");

  // Calculate average rating for this listing from its reviews
  let avgRating = 0;
  if (listing.reviews.length > 0) {
    const sum = listing.reviews.reduce((total, r) => total + r.rating, 0);
    avgRating = (sum / listing.reviews.length).toFixed(1);
  }

  res.render("listings/show", { listing, avgRating });
});


// EDIT
app.get("/listings/:id/edit", isLoggedIn, isAuthor, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
});

// UPDATE
// app.put("/listings/:id", isLoggedIn, isAuthor, upload.single("image"), async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;
//   await Listing.findByIdAndUpdate(id, updateData);
//   req.flash("success", "Listing updated successfully!");
//   res.redirect(`/listings/${id}`);
// });
app.put("/listings/:id", isLoggedIn, isAuthor, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country, imageURL } = req.body;

  const listing = await Listing.findById(id);

  // Update normal fields
  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.location = location;
  listing.country = country;

  // Handle image logic
  if (req.file) {
    // If a new image file is uploaded
    listing.image = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    };
  } else if (imageURL && imageURL.trim() !== "") {
    // If user entered a new image URL manually
    listing.image = {
      url: imageURL,
      filename: "manual-upload"
    };
  }
  // If neither uploaded nor provided, keep old image

  await listing.save();

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
});


// DELETE
app.delete("/listings/:id", isLoggedIn, isAuthor, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
});

// ====== SERVER ======
app.listen(8080, () => console.log("🚀 Server listening on port 8080"));
