const express = require('express');
const Album = require('../models/Album');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');

// controllers/albums.js (Index - GET /albums)
router.index = async (req, res) => {
  try {
    // Finds all albums where the 'owner' matches the ID attached by requireToken middleware
    const albums = await Album.find({ owner: req.userId }).populate('owner', 'email')
    res.status(200).json(albums)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}




// controllers/albums.js (Show - GET /albums/:id)
router.show = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('owner', 'email')
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found.' })
    }
    // You could optionally add a check here to ensure the user can only view their own album.

    res.status(200).json(album)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}



// controllers/albums.js (Create - POST /albums)
router.create = async (req, res) => {
  try {
    // 1. Assign the owner ID from the JWT payload (via req.userId)
    const albumData = { 
      ...req.body, 
      owner: req.userId // CRITICAL: Sets the album owner
    }
    
    const album = await Album.create(albumData)
    res.status(201).json(album)
  } catch (error) {
    res.status(400).json({ error: error.message }) // 400 for validation errors
  }
}



// controllers/albums.js (Update - PUT /albums/:id)
router.update = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found.' })
    }

    // --- Authorization Check ---
    if (album.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this album.' })
    }
    // ---------------------------

    const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, // Return the updated document
      runValidators: true // Enforce schema validation on update
    })

    res.status(200).json(updatedAlbum)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}



// controllers/albums.js (Destroy - DELETE /albums/:id)
router.destroy = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found.' })
    }

    // --- Authorization Check ---
    if (album.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this album.' })
    }
    // ---------------------------

    await Album.findByIdAndDelete(req.params.id)
    res.status(204).send() // 204 No Content for successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


module.exports = router;