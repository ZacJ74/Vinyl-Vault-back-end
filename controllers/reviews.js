

const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Ensure path is correct!
const Album = require('../models/Album');   // Ensure path is correct!
const verifyToken = require('../middleware/verify-token'); // Ensure path is correct!

// =========================================================
// ROUTE DEFINITIONS
// =========================================================

// (Create - POST /) - POST a new review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, rating, album } = req.body;

    // 1. Ensure the referenced album exists
    const albumExists = await Album.findById(album);
    if (!albumExists) {
      return res.status(404).json({ message: 'Target Album not found.' });
    }

    // 2. Build review data with ownership attached
    const reviewData = {
      content,
      rating,
      album, // Album ID from req.body
      reviewer: req.userId // User ID from JWT
    };
    
    const review = await Review.create(reviewData);
    res.status(201).json(review);
  } catch (error) {
    // 400 for validation errors or bad input
    res.status(400).json({ error: error.message }); 
  }
});

// (Destroy - DELETE /:id) - DELETE a review (Requires ownership)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // --- Authorization Check (Reviewer must match req.userId) ---
    if (review.reviewer.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You did not write this review.' });
    }
    // -----------------------------------------------------------

    await Review.findByIdAndDelete(req.params.id);
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NOTE: Index/Show routes for reviews are usually placed on the Album router or implemented differently.
// For testing purposes, POST and DELETE (with authorization) are sufficient.

module.exports = router;




// const express = require('express');
// const Review = require('../models/Review');
// const Album = require('../models/Album'); 
// const router = require('./users');
// const verifyToken = require('../middleware/verify-token'); // Ensure path is correct!



// // controllers/reviews.js (Index - GET /reviews/album/:albumId)
// router.index = async (req, res) => {
//   try {
//     // Finds all reviews where the 'album' matches the ID from the URL parameter
//     const reviews = await Review.find({ album: req.params.albumId })
//       .populate('reviewer', 'email') // Display the reviewer's email
//       .sort({ createdAt: -1 }) // Sort by newest first
      
//     res.status(200).json(reviews)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }



// // controllers/reviews.js (Create - POST /reviews)
// router.create = async (req, res) => {
//   try {
//     // 1. Assign reviewer ID from JWT (via req.userId)
//     // 2. Assign album ID from the request body
//     const reviewData = { 
//       ...req.body, 
//       reviewer: req.userId, // CRITICAL: Who wrote the review
//       album: req.body.albumId // CRITICAL: Which album it belongs to (passed from front-end)
//     }
    
//     const review = await Review.create(reviewData)
//     // Populate the reviewer field before sending back so the front-end can display the name
//     await review.populate('reviewer', 'email')
    
//     res.status(201).json(review)
//   } catch (error) {
//     res.status(400).json({ error: error.message }) 
//   }
// }

// // controllers/reviews.js (Update - PUT /reviews/:id)
// router.update = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id)
    
//     if (!review) {
//       return res.status(404).json({ message: 'Review not found.' })
//     }

//     // --- Authorization Check: Reviewer ID check ---
//     if (review.reviewer.toString() !== req.userId.toString()) {
//       return res.status(403).json({ message: 'Forbidden: You did not write this review.' })
//     }
//     // ---------------------------------------------

//     const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { 
//       new: true, 
//       runValidators: true 
//     })
//     await updatedReview.populate('reviewer', 'email')

//     res.status(200).json(updatedReview)
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// }


// // controllers/reviews.js (Destroy - DELETE /reviews/:id)
// router.destroy = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id)
    
//     if (!review) {
//       return res.status(404).json({ message: 'Review not found.' })
//     }

//     // --- Authorization Check: Reviewer ID check ---
//     if (review.reviewer.toString() !== req.userId.toString()) {
//       return res.status(403).json({ message: 'Not Allowed: You did not write this review.' })
//     }
//     // ---------------------------------------------

//     await Review.findByIdAndDelete(req.params.id)
//     res.status(204).send() 
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

// module.exports = router;