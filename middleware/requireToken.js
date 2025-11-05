// middleware/requireToken.js
const jwt = require('jsonwebtoken')
const User = require('../models/User') // Need the User model for finding the user

const requireToken = async (req, res, next) => {
  // 1. Check if the Authorization header exists
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ message: 'Authorization token required.' })
  }

  // 2. Extract the token (e.g., remove "Bearer ")
  const token = authorization.split(' ')[1]

  try {
    // 3. Verify the token using the secret
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)

    // 4. Find the user and attach their ID to the request object
    // This allows controllers to know *who* is making the request
    req.userId = userId

    next() // Proceed to the route handler
  } catch (error) {
    console.error('JWT Verification Error:', error.message)
    res.status(401).json({ message: 'Request is not authorized (Invalid token).' })
  }
}

module.exports = requireToken