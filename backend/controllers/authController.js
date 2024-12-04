import User from '../models/user.model.js'; // Import the User model
import bcrypt from 'bcrypt';

const AuthController = {
  // Login Function
  login: (req, res) => {
    const { email, password } = req.body;

    // Retrieve user by email
    User.getByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Server error', error: err });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the provided password with the hashed password in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Server error', error: err });
        }

        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If passwords match, return success
        return res.status(200).json({
          message: 'Login successful',
          userId: user.id,
          username: user.username,
          role: user.role,
        });
      });
    });
  },

  register: (req, res) => {
    const { email, password, role, additionalData } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    // Check if the provided role is valid
    const validRoles = ['administrator', 'client', 'tour_operator', 'tour_guide'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if user already exists
    User.getByEmail(email, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ message: 'Server error', error: err });
      }

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Create the user in the database (password will be hashed inside the model)
      User.create(email, password, role, additionalData, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Server error', error: err });
        }

        return res.status(201).json({
          message: 'User registered successfully',
          userId: result.id,
          username: result.username,
          role: result.role,
        });
      });
    });
  },
};

export default AuthController;