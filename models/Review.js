const mongoose = require('mongoose')
const Schema = mongoose.Schema // Shorthand

const reviewSchema = new Schema({
  content: { 
    type: String, 
    required: true,
    trim: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1, 
    max: 5 // Assuming a 1-5 star rating
  },
  // --- CRITICAL Foreign Keys ---
  album: { 
    type: Schema.Types.ObjectId,
    ref: 'Album',           // Links to the Album being reviewed
    required: true 
  },
  reviewer: { 
    type: Schema.Types.ObjectId,
    ref: 'User',            // Links to the User who wrote the review
    required: true 
  },
  // -----------------------------
}, { 
    timestamps: true 
})

module.exports = mongoose.model('Review', reviewSchema)