// index.js or server.js
require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// 1. Check Node.js Version
const [major] = process.versions.node.split('.').map(parseFloat);
// Node 20 is the current LTS, 18 is maintenance LTS. Checking for a reasonable minimum.
if (major < 18) {
  console.log('🚨 Please upgrade your Node.js version to 18 or greater. 👌');
  process.exit(1);
}

// 2. Load Environment Variables
// It's a good practice to load the .env file first, then the local override.
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// We expose this for global access if needed, but it's not strictly necessary here
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 3. Database Connection Logic (Mongoose)
const startMongoose = async () => {
  try {
    let mongoUri = process.env.DATABASE;
    if (!mongoUri) {
      // lazy-load mongodb-memory-server to avoid adding it for production
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      // expose the in-memory URI to other processes/scripts in this session
      process.env.DATABASE = mongoUri;
      console.log('--- 💾 No DATABASE env var found - Starting in-memory MongoDB for testing. ---');
      console.log(`In-memory MongoDB URI: ${mongoUri}`);
    }

    await mongoose.connect(mongoUri);

    mongoose.connection.on('error', (error) => {
      console.error(
        `1. 🔥 Common Error caused issue: Check your .env file for the correct DATABASE URL!`
      );
      console.error(`2. 🚫 Mongoose Connection Error: ${error.message}`);
      // Don't exit here, as the app might still be running, but log the failure
    });

    console.log('--- 🟢 MongoDB Connection Established! ---');

  } catch (err) {
    console.error('--- 🔴 Fatal Error: Failed to connect to MongoDB or start server. ---');
    console.error(err);
    process.exit(1);
  }
};

// 4. Load Models and Start Mongoose
startMongoose().then(() => {
  // Load models AFTER the connection is attempted to ensure mongoose is initialized
  const modelsFiles = globSync('./src/models/**/*.js');

  if (modelsFiles.length === 0) {
      console.warn('⚠️ No Mongoose models found in ./src/models/');
  }

  for (const filePath of modelsFiles) {
    // console.log(`Loading model: ${filePath}`); // Optional: Check model loading
    require(path.resolve(filePath));
  }

  // 5. Start Express App
  const app = require('./app'); // Assuming you have an 'app.js' file
  app.set('port', process.env.PORT || 8888);
  
  const server = app.listen(app.get('port'), () => {
    console.log(`--- 🚀 Express running → On PORT: ${server.address().port} ---`);
  });

  // Handle server errors (e.g., port already in use)
  server.on('error', (err) => {
    console.error('--- 🔴 Express Server Error ---');
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${app.get('port')} is already in use.`);
    } else {
        console.error(err);
    }
    process.exit(1);
  });
});