

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const saltRounds = 12;

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    
    if (userInDatabase) {
      // 409 Conflict: Now returns { err: '...' }
      return res.status(409).json({ err: 'Username already taken.' });
    }
    
    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, saltRounds)
    });

    const payload = { username: user.username, _id: user._id };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    // Success path returns { token, username }
    return res.status(201).json({ token, username: user.username });

  } catch (err) {
    // 500 Server Error: Now returns { err: '...' }
    return res.status(500).json({ err: err.message });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      // 401 Unauthorized: Now returns { err: '...' }
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password, user.hashedPassword
    );
    if (!isPasswordCorrect) {
      // 401 Unauthorized: Now returns { err: '...' }
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const payload = { username: user.username, _id: user._id };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    // Success path returns { token, username }
    return res.status(200).json({ token, username: user.username });
  } catch (err) {
    // 500 Server Error: Now returns { err: '...' }
    return res.status(500).json({ err: err.message });
  }
});

module.exports = router;