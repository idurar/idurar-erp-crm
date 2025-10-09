// index.js or server.js

// 1. Dependencies and Setup
require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// 2. Minimum Node version check
const [major] = process.versions.node.split('.').map((v) => parseInt(v, 10) || 0);
if (major < 18) {
  // Use console.error for critical failure
  console.error('🚨 Please upgrade your Node.js version to 18 or greater. Process exiting.');
  process.exit(1);
}

// 3. Load environment
// Ensure paths are correctly resolved and handle potential errors in .env loading
require('dotenv').config({ path: path.resolve(process.cwd(), '.env'), debug: process.env.DEBUG });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local'), debug: process.env.DEBUG });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Variable is loaded, but unused in this file

// 4. Helper to start/attach mongoose
const startMongoose = async () => {
  try {
    let mongoUri = process.env.DATABASE;

    if (!mongoUri) {
      // Logic for in-memory MongoDB
      if (process.env.NODE_ENV === 'production') {
        throw new Error('DATABASE env var is REQUIRED in production.');
      }
      
      // Lazy-load for testing environments
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('--- 💾 No DATABASE env var found - started in-memory MongoDB for testing. ---');
      console.log(`In-memory MongoDB URI: ${mongoUri}`);
    }

    // Optional mongoose settings
    mongoose.set('strictQuery', false); 
    await mongoose.connect(mongoUri, { keepAlive: true });

    mongoose.connection.on('error', (err) => {
      // This is a persistent listener for errors after initial connection
      console.error('🔥 Mongoose connection error (runtime):', err.message);
    });

    // Event listener for a successful initial connection
    mongoose.connection.once('open', () => {
      console.log('--- 🟢 MongoDB connection established ---');
    });

    return mongoose;
  } catch (err) {
    console.error('--- 🔴 Fatal Error: Failed to start/connect to MongoDB ---');
    console.error(err);
    // Re-throw the error to be caught by the main function's catch block
    throw err; 
  }
};

// 5. Main application logic
const main = async () => {
  try {
    await startMongoose();

    // Load models
    const modelsPattern = path.resolve(process.cwd(), 'src/models/**/*.js');
    const modelsFiles = globSync(modelsPattern);

    if (modelsFiles.length === 0) {
      console.warn('⚠️ No Mongoose models found at src/models/**/*.js');
    }
    
    for (const f of modelsFiles) {
        try {
            require(path.resolve(f));
        } catch (e) {
            console.error(`🔴 Error loading model file: ${f}`, e.message);
            process.exit(1); // Exit if model loading fails
        }
    }

    // Start express
    const app = require('./app'); // Assumes 'app.js' exports the Express app
    
    // Robustly parse the port from environment, defaulting to 8888
    const port = parseInt(process.env.PORT, 10); 
    app.set('port', isNaN(port) ? 8888 : port);

    const server = app.listen(app.get('port'), () => {
      console.log(`--- 🚀 Express running → On PORT: ${server.address().port} ---`);
    });

    // Server error handling
    server.on('error', (err) => {
      console.error('--- 🔴 Express server error ---');
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${app.get('port')} is already in use. Please choose a different port.`);
      } else {
        console.error(err);
      }
      process.exit(1);
    });

    // Graceful shutdown helpers
    const shutdown = async (signal) => {
      console.log(`\n--- ⚠️ Received ${signal}. Shutting down gracefully... ---`);
      
      let exitCode = 0;
      try {
        await new Promise(resolve => server.close(() => {
            console.log('Express server closed.');
            resolve();
        }));
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
      } catch (e) {
        console.error('Error during shutdown:', e);
        exitCode = 1;
      }
      process.exit(exitCode);
    };

    // Process event listeners for graceful shutdown and unhandled errors
    process.on('SIGINT', () => shutdown('SIGINT (Ctrl+C)'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('unhandledRejection', (reason, promise) => {
      console.error('--- 🔴 Unhandled Rejection at ---', promise);
      console.error('Reason:', reason);
      // Optional: process.exit(1); depending on severity
    });
    process.on('uncaughtException', (err) => {
        console.error('--- 🔴 Uncaught Exception ---', err);
        shutdown('Uncaught Exception');
    });

  } catch (err) {
    // Catches errors from startMongoose and main logic
    console.error('--- 🔴 Fatal error in main startup ---');
    console.error(err.message);
    process.exit(1);
  }
};

main();