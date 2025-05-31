/**
 * Main Express application file
 * 
 * This file sets up the Express application with all necessary middleware,
 * routes, and error handlers. It serves as the central configuration point
 * for the backend API.
 */

// Import required dependencies
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// Import route handlers
const coreAuthRouter = require('./routes/coreRoutes/coreAuth');         // Authentication routes
const coreApiRouter = require('./routes/coreRoutes/coreApi');           // Core API routes
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter'); // File download routes
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');     // Public access routes
const erpApiRouter = require('./routes/appRoutes/appApi');              // Application-specific API routes

// Import authentication middleware
const adminAuth = require('./controllers/coreControllers/adminAuth');

// Import error handling middleware
const errorHandlers = require('./handlers/errorHandlers');

// Create Express application instance
const app = express();

/**
 * Configure CORS (Cross-Origin Resource Sharing)
 * - origin: true allows requests from any origin (in production, you might want to restrict this)
 * - credentials: true allows cookies to be sent with cross-origin requests
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Parse cookies attached to the client request
app.use(cookieParser());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (form submissions)
// extended: true allows for rich objects and arrays to be encoded
app.use(express.urlencoded({ extended: true }));

// Compress all responses to reduce bandwidth usage
app.use(compression());

// File upload middleware (currently commented out)
// Uncomment to enable file uploads
// app.use(fileUpload());

/**
 * API Routes Configuration
 * 
 * The order of these routes is important:
 * 1. Authentication routes (no auth required)
 * 2. Core API routes (auth required)
 * 3. ERP/Application routes (auth required)
 * 4. Download routes (for file downloads)
 * 5. Public routes (no auth required)
 */

// Authentication routes - no auth token required
app.use('/api', coreAuthRouter);

// Core API routes - protected by authentication
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);

// Application-specific API routes - protected by authentication
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);

// File download routes
app.use('/download', coreDownloadRouter);

// Public access routes
app.use('/public', corePublicRouter);

/**
 * Error Handling
 * 
 * These middleware functions catch any errors that occur during request processing
 */

// 404 Not Found handler - catches any requests that don't match defined routes
app.use(errorHandlers.notFound);

// Production error handler - hides error details in production environment
app.use(errorHandlers.productionErrors);

// Export the configured Express app for use in server.js
module.exports = app;