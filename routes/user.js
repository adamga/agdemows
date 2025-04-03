const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CosmosClient } = require('@azure/cosmos');
const cosmosConfig = require('../config/cosmos');
const User = require('../models/user');

// Cosmos DB client
const cosmosClient = new CosmosClient({
  endpoint: cosmosConfig.endpoint,
  key: cosmosConfig.key,
});

const database = cosmosClient.database(cosmosConfig.databaseId);
const container = database.container(cosmosConfig.containerId);

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to validate user profile data
function validateUserProfile(req, res, next) {
  const {
    username,
    email,
    firstName,
    lastName,
    dateOfBirth,
    address,
    phoneNumber,
    profilePictureUrl,
    bio,
    flightExperienceLevel,
    preferredAircraft,
    favoriteDestinations,
    membershipStatus,
    dateOfAccountCreation,
    lastLoginDate,
  } = req.body;

  // Validate required fields
  if (!username || !email || !firstName || !lastName || !dateOfBirth || !address || !phoneNumber || !profilePictureUrl || !bio || !flightExperienceLevel || !preferredAircraft || !favoriteDestinations || !membershipStatus || !dateOfAccountCreation || !lastLoginDate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Validate phone number format
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ error: 'Invalid phone number format.' });
  }

  // Validate date of birth
  const dateOfBirthDate = new Date(dateOfBirth);
  if (isNaN(dateOfBirthDate.getTime()) || dateOfBirthDate > new Date()) {
    return res.status(400).json({ error: 'Invalid date of birth.' });
  }

  // Validate profile picture URL format
  try {
    new URL(profilePictureUrl);
  } catch (_) {
    return res.status(400).json({ error: 'Invalid profile picture URL.' });
  }

  // Validate membership status
  const allowedMembershipStatuses = ['free', 'premium'];
  if (!allowedMembershipStatuses.includes(membershipStatus)) {
    return res.status(400).json({ error: 'Invalid membership status.' });
  }

  // Validate bio length
  if (bio.length > 500) {
    return res.status(400).json({ error: 'Bio must be 500 characters or less.' });
  }

  // Validate flight experience level length
  if (flightExperienceLevel.length > 100) {
    return res.status(400).json({ error: 'Flight experience level must be 100 characters or less.' });
  }

  // Validate preferred aircraft length
  if (preferredAircraft.length > 100) {
    return res.status(400).json({ error: 'Preferred aircraft must be 100 characters or less.' });
  }

  // Validate favorite destinations length
  if (favoriteDestinations.length > 100) {
    return res.status(400).json({ error: 'Favorite destinations must be 100 characters or less.' });
  }

  next();
}

// Route to update user profile
router.post('/update', upload.single('profilePicture'), validateUserProfile, async (req, res) => {
  const {
    username,
    email,
    firstName,
    lastName,
    dateOfBirth,
    address,
    phoneNumber,
    profilePictureUrl,
    bio,
    flightExperienceLevel,
    preferredAircraft,
    favoriteDestinations,
    membershipStatus,
    dateOfAccountCreation,
    lastLoginDate,
  } = req.body;

  const profilePicture = req.file;

  try {
    const { resource: user } = await container.item(username, username).read();

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.dateOfBirth = dateOfBirth;
    user.address = address;
    user.phoneNumber = phoneNumber;
    user.profilePictureUrl = profilePictureUrl;
    user.bio = bio;
    user.flightExperienceLevel = flightExperienceLevel;
    user.preferredAircraft = preferredAircraft;
    user.favoriteDestinations = favoriteDestinations;
    user.membershipStatus = membershipStatus;
    user.dateOfAccountCreation = dateOfAccountCreation;
    user.lastLoginDate = lastLoginDate;

    if (profilePicture) {
      // Handle profile picture upload
      // Assuming you have a function to upload the file and get the URL
      const profilePictureUrl = await uploadProfilePicture(profilePicture);
      user.profilePictureUrl = profilePictureUrl;
    }

    await container.item(username, username).replace(user);

    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
