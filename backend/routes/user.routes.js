const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Create
router.post('/', userController.createUser);

// Get ALL
router.get('/', userController.getAllUsers);

// Get by ID
router.get('/:id', userController.getUserById);

// Check associations
router.get('/:id/associations', userController.checkUserAssociations);

// Update a user
router.put('/:id', userController.updateUser);

// Delete
router.delete('/:id', userController.deleteUser);

module.exports = router;
