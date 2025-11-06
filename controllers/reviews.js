const express = require('express');
const Review = require('../models/Review');
const Album = require('../models/Album'); 
const router = require('./users');




// controllers/reviews.js (Index - GET /reviews/album/:albumId)
router.index = async (req, res) => {
  try {
    // Finds all reviews where the 'album' matches the ID from the URL parameter
    const reviews = await Review.find({ album: req.params.albumId })
      .populate('reviewer', 'email') // Display the reviewer's email
      .sort({ createdAt: -1 }) // Sort by newest first
      
    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}



// controllers/reviews.js (Create - POST /reviews)
router.create = async (req, res) => {
  try {
    // 1. Assign reviewer ID from JWT (via req.userId)
    // 2. Assign album ID from the request body
    const reviewData = { 
      ...req.body, 
      reviewer: req.userId, // CRITICAL: Who wrote the review
      album: req.body.albumId // CRITICAL: Which album it belongs to (passed from front-end)
    }
    
    const review = await Review.create(reviewData)
    // Populate the reviewer field before sending back so the front-end can display the name
    await review.populate('reviewer', 'email')
    
    res.status(201).json(review)
  } catch (error) {
    res.status(400).json({ error: error.message }) 
  }
}

// controllers/reviews.js (Update - PUT /reviews/:id)
router.update = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' })
    }

    // --- Authorization Check: Reviewer ID check ---
    if (review.reviewer.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You did not write this review.' })
    }
    // ---------------------------------------------

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    })
    await updatedReview.populate('reviewer', 'email')

    res.status(200).json(updatedReview)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// controllers/reviews.js (Destroy - DELETE /reviews/:id)
router.destroy = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' })
    }

    // --- Authorization Check: Reviewer ID check ---
    if (review.reviewer.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not Allowed: You did not write this review.' })
    }
    // ---------------------------------------------

    await Review.findByIdAndDelete(req.params.id)
    res.status(204).send() 
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = router;