const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const helmet = require('helmet'); // 🛡️ Security enhancement

// --- Route Imports ---
const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const erpApiRouter = require('./routes/appRoutes/appApi');

// --- Controller/Middleware Imports ---
const adminAuth = require('./controllers/coreControllers/adminAuth');
const errorHandlers = require('./handlers/errorHandlers');

// 🛠️ Environment Variables for Configuration
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://127.0.0.1:3000']; // Enhanced CORS config

// create our Express app
const app = express();

// --- 🔒 Security Middleware ---
// Helmet helps secure Express apps by setting various HTTP headers.
app.use(helmet({
    // Disable DNS prefetching header for security/privacy
    dnsPrefetchControl: { allow: false },
    // Prevent client-side scripting attacks
    contentSecurityPolicy: isProduction ? undefined : false // CSP can be complex; disable for dev
}));

// --- 🌐 CORS Configuration Enhancement ---
// Define a more robust CORS policy
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow specific origins or all in development
        if (!isProduction || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Block all others
        callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true, // Allow cookies to be sent
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// --- Standard Middleware ---
app.use(cookieParser());
// Body parser: parse application/json and application/x-www-form-urlencoded
app.use(express.json({ limit: '10mb' })); // Increased limit for larger payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression()); // Gzip/deflate compression for responses

// --- 📁 File Upload Middleware ---
// Default options for express-fileupload
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // Set file size limit (e.g., 50MB)
    useTempFiles: true, // Use temporary files to handle large files
    tempFileDir: '/tmp/' // Directory to store temp files
}));

// --- 🚀 API Routes ---
// Public/Authentication routes (no token required)
app.use('/api', coreAuthRouter);

// Protected API routes (token required via adminAuth.isValidAuthToken)
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);

// Download and Public (static) routes
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// --- 🖼️ Serve Frontend SPA ---
const buildPath = path.join(__dirname, "../../frontend/dist"); // Defining the build path

// Serve static files from the frontend build directory
app.use(express.static(buildPath, {
    maxAge: isProduction ? '1y' : '0' // Aggressive caching in production
}));

// Catch-all route to serve the frontend SPA's index.html
// This MUST come after all API and static file routes
app.get("*", function(req, res) {
    if (req.path.startsWith('/api') || req.path.startsWith('/download') || req.path.startsWith('/public')) {
        // If it looks like an API/special route but didn't match above, let it 404
        // and fall through to the notFound handler.
        return errorHandlers.notFound(req, res);
    }

    // Serve index.html for all other GET requests (SPA routing)
    res.sendFile(path.join(buildPath, "index.html"), function (err) {
        if (err) {
            console.error("Error sending index.html:", err.message);
            // Send a client-friendly 500 error
            res.status(500).send("Could not load application.");
        }
    });
});

// --- 🛑 Error Handling ---
// If the above routes didn't work (e.g., a non-matched API call), we 404 them.
app.use(errorHandlers.notFound);

// Standard Express error handling (for errors thrown inside routes/middleware)
if (isProduction) {
    // Production error handler - doesn't leak stack traces to user
    app.use(errorHandlers.productionErrors);
} else {
    // Development error handler - prints stack trace
    app.use(errorHandlers.developmentErrors);
}


// done! we export it so we can start the site in start.js
module.exports = app;
