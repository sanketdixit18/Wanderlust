// const mongoose=require("mongoose");
// const Schema=mongoose.Schema;
// const listingSchema=new Schema({
//     title:String,
//     description:String,
//    image: {
//     filename: String,
//     url: String
//   },
//     // price:Number,
//     price: {
//     type: Number,
//     required: true,
//     default: 0,   // ✅ prevents null errors
//   },
//     location:String,
//     country:String
// });
// const Listing=mongoose.model("Listing",listingSchema);
// module.exports=Listing;





// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Import the Review model
// const Review = require("./review");

// const listingSchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Title is required"],
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     image: {
//       filename: String,
//       url: String,
//     },
//     price: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     location: {
//       type: String,
//       required: [true, "Location is required"],
//     },
//     country: {
//       type: String,
//       required: [true, "Country is required"],
//     },
    
//     amenities: {
//       type: [String], // e.g., ["wifi", "parking", "tv"]
//       default: [],
//     },
//     // ✅ One listing can have many reviews
//     reviews: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Review",
//     },
//   ],
//   author: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User",
//   required: true
//   }

//   },
//   { timestamps: true }
// );

// // ✅ Middleware: delete all reviews when a listing is deleted
// listingSchema.post("findOneAndDelete", async function (doc) {
//   if (doc) {
//     await Review.deleteMany({ _id: { $in: doc.reviews } });
//   }
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Import the Review and Booking models
const Review = require("./review");
const Booking = require("./booking");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      filename: String,
      url: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    amenities: {
      type: [String], // e.g., ["wifi", "parking", "tv"]
      default: [],
    },
    // ✅ One listing can have many reviews
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Middleware: delete all reviews and bookings when a listing is deleted
listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
    await Booking.deleteMany({ listing: doc._id }); // 🔥 add this line
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
