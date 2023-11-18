require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 18) {
  console.log('Please upgrade your node.js version at least 18.x.x or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

mongoose.connect(process.env.DATABASE);

mongoose.connection.on('error', (error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

const modelsFiles = globSync('./src/models/**/*.js');

for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers for each CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // If a worker dies, fork a new one to replace it
    cluster.fork();
  });
} else {
  const app = require('./app');
  app.set('port', process.env.PORT || 8888);
  console.log('🚀 ~ file: server.js:34 ~ numCPUs:', numCPUs);
  const server = app.listen(app.get('port'), () => {
    console.log(`Express running → On PORT : ${server.address().port}`);
  });
}
// Start our app!
