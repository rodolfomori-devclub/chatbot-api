const express = require('express');
const router = express.Router();

// Import route files
const { router: codeCheckRoutes } = require('./routes/codeCheck');
const githubRoutes = require('./routes/github');
const streamRoutes = require('./routes/stream');

// Register routes
router.use('/code-check', codeCheckRoutes);
router.use('/github', githubRoutes);
router.use('/', streamRoutes);

module.exports = router; 