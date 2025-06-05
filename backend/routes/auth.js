const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user with plain password, model pre-save hook will hash it automatically
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'Signed up successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Provided password:', password);
        console.log('Hashed password from DB:', user.password);
        console.log('Password match result:', isMatch);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: 'Logged in successfully', token, username: user.username });  // added message
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
