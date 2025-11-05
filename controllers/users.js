const User = requires('../models/User');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');


const creatToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};