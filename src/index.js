const express = require('express');
const router = express.Router();

// Import route files
const { router: codeCheckRoutes } = require('./routes/codeCheck');
const githubRoutes = require('./routes/github');

// Register routes
router.use('/code-check', codeCheckRoutes);
router.use('/github', githubRoutes);

module.exports = router; 