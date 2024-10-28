require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Make sure we are running Node.js 20 or greater
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version to at least 20 or greater. 👌\n ');
  process.exit();
}

// Import environmental variables from .env files
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// Connect to MongoDB
mongoose.connect(process.env.DATABASE);

// Function to connect to Redis


// Define your OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// MongoDB connection error handling
mongoose.connection.on('error', (error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your MongoDB URL`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

// Connect to Redis

// Load all Mongoose models
const modelsFiles = globSync('./src/models/**/*.js');
for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

// Start the Express app
const app = require('./app');
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → On PORT : ${server.address().port}`);
});
