const mongoose = require('mongoose')
const Schema = mongoose.Schema // Shorthand for Mongoose Schema type

const albumSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true // Remove whitespace from both ends of a string
  },
  artist: { 
    type: String, 
    required: true,
    trim: true
  },
  year: { 
    type: Number, 
    // Basic validation to ensure a reasonable year is entered
    min: 1900, 
    max: new Date().getFullYear() + 5 
  },
  format: { 
    type: String, 
    enum: ['Vinyl', 'CD', 'Digital', 'Cassette', 'Other'], // Restrict possible values
    default: 'Vinyl'
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  notes: { 
    type: String, 
    trim: true 
  },
  genre: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    trim: true
  },
  // --- CRITICAL for Authorization ---
  owner: { 
    type: Schema.Types.ObjectId, // Defines a reference to another document's ID
    ref: 'User',                 // Specifies the target model name
    required: true 
  },
  // ---------------------------------
}, { 
    // Mongoose automatically adds createdAt and updatedAt timestamps
    timestamps: true 
})

module.exports = mongoose.model('Album', albumSchema)