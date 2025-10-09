const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const helmet = require('helmet'); // 🛡️ New: For setting security headers

// --- Route Imports ---
const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const erpApiRouter = require('./routes/appRoutes/appApi');

// --- Controller/Middleware Imports ---
const adminAuth = require('./controllers/coreControllers/adminAuth');
const errorHandlers = require('./handlers/errorHandlers');

// 🛠️ Configuration based on Environment Variables (Best Practice)
const isProduction = process.env.NODE_ENV === 'production';
// Load allowed origins from ENV, default to localhost for development
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://127.0.0.1:3000'];

// create our Express app
const app = express();

// --- 🔒 Security Middleware (HELMET) ---
// Helmet helps secure Express apps by setting various HTTP headers.
app.use(helmet({
    // Disable Content Security Policy in development for easier debugging,
    // but consider a strict policy for production.
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: false, // Often needed for React/SPA dev setups
}));

// --- 🌐 Enhanced CORS Configuration ---
const corsOptions = {
    // Dynamically check origin against allowed list
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        
        callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true, // Allow cookies to be sent
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204 // Standard for preflight success
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// --- Standard Middleware ---
app.use(cookieParser());

// Body parser: Increased limit to handle larger JSON/Form data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(compression()); // Gzip/deflate compression

// --- 📁 File Upload Middleware ---
// Properly configure file upload with limits and temporary file usage
app.use(fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 }, // Set file size limit (e.g., 100MB)
    useTempFiles: true, // Use temporary files to handle large files efficiently
    tempFileDir: '/tmp/' // Standard temp directory
}));

// --- 🚀 API Routes ---
// Public/Authentication routes
app.use('/api', coreAuthRouter);

// Protected API routes (token required)
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);

// Download and Public (static) routes
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// --- 🖼️ Serve Frontend SPA ---
const buildPath = path.join(__dirname, "../../frontend/dist");

// Serve static files with caching headers
app.use(express.static(buildPath, {
    maxAge: isProduction ? '1y' : '0' // Aggressive caching in production
}));

// Catch-all route to serve the frontend SPA's index.html
app.get("*", function(req, res, next) {
    // If the request path looks like an API or static file that should have been matched, 
    // but wasn't, let it fall to the 404 handler instead of serving index.html.
    if (req.path.startsWith('/api') || req.path.startsWith('/download') || req.path.startsWith('/public')) {
        return next(); // Pass to the next middleware (notFound)
    }

    // Serve index.html for all other GET requests (SPA routing)
    res.sendFile(path.join(buildPath, "index.html"), function (err) {
        if (err) {
            console.error("Error sending index.html:", err.message);
            res.status(500).send("Could not load application.");
        }
    });
});

// --- 🛑 Error Handling ---
// 1. 404 Handler: If none of the routes above matched
app.use(errorHandlers.notFound);

// 2. Global Error Handler: Handles errors thrown in middleware/routes
if (isProduction) {
    // Production error handler - doesn't leak stack traces
    app.use(errorHandlers.productionErrors);
} else {
    // Development error handler - includes stack trace (assuming errorHandlers exports this)
    app.use(errorHandlers.developmentErrors || errorHandlers.productionErrors); 
    // Fallback if developmentErrors isn't defined
}

// done! we export it so we can start the site in start.js
module.exports = app;
