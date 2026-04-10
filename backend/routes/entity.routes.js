const express = require('express');
const router = express.Router();
const entityController = require('../controllers/entity.controller');

// Create
router.post('/', entityController.createEntity);

// Get
router.get('/', entityController.getAllEntities);

// Get
router.get('/:id', entityController.getEntityById);

// Check associations
router.get('/:id/associations', entityController.checkEntityAssociations);

// Update
router.put('/:id', entityController.updateEntity);

// Delete
router.delete('/:id', entityController.deleteEntity);

module.exports = router;
