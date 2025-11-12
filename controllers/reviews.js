

const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Ensure path is correct!
const Album = require('../models/Album');   // Ensure path is correct!
const verifyToken = require('../middleware/verify-token'); // Ensure path is correct!

// =========================================================
// ROUTE DEFINITIONS
// =========================================================

// (Index - GET /album/:albumId) - GET all reviews for an album
router.get('/album/:albumId', async (req, res) => {
  try {
    const reviews = await Review.find({ album: req.params.albumId })
      .populate('reviewer', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

module.exports = router;