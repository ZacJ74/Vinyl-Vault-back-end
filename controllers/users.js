
const express = require('express');
const router = express.Router();

const User = require('../models/users');

const verifyToken = require('../middleware/verify-token');

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "username");

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId){
      return res.status(403).json({ err: "Unauthorized"});
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: 'User not found.'});
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;






// const User = requires('../models/User');
// const jwt = require('jsonwebtoken');
// const bycrypt = require('bcrypt');


// const creatToken = (userId) => {
//     return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
// };



// exports.signUp = async (req, res) => {
//   const { email, password } = req.body

//   try {
//     // 1. Check if user already exists
//     if (await User.findOne({ email })) {
//       return res.status(400).json({ message: 'Email already in use.' })
//     }

//     // 2. Hash the password
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     // 3. Create and save the new user
//     const user = await User.create({ email, password: hashedPassword })

//     // 4. Create a JWT
//     const token = createToken(user._id)

//     res.status(201).json({ email: user.email, token })
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }


// exports.signIn = async (req, res) => {
//   const { email, password } = req.body

//   try {
//     // 1. Find user by email
//     const user = await User.findOne({ email })
//     if (!user) {
//       // Use generic unauthorized message for security
//       return res.status(401).json({ message: 'Invalid credentials.' })
//     }

//     // 2. Compare the plain password with the hashed password
//     const match = await bcrypt.compare(password, user.password)
//     if (!match) {
//       return res.status(401).json({ message: 'Invalid credentials.' })
//     }

//     // 3. Create a JWT
//     const token = createToken(user._id)

//     res.status(200).json({ email: user.email, token })
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }