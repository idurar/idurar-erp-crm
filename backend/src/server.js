// Node.js 25 removed SlowBuffer. A transitive JWT dependency still references
// it while installing its constant-time Buffer comparison helpers.
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

// Keep runtime selection explicit and cross-platform. This prevents a globally
// inherited NODE_ENV from accidentally turning the local watcher into a
// production process (or vice versa).
if (process.argv.includes('--development')) process.env.NODE_ENV = 'development';
if (process.argv.includes('--production')) process.env.NODE_ENV = 'production';

require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Make sure we are running a supported Node.js version.
const [major] = process.versions.node.split('.').map(Number);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { validateEnvironment } = require('./config/environment');
validateEnvironment();

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

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 8888);
let server;

const startHttpServer = () => {
  server = app.listen(app.get('port'), () => {
  console.log(`Express running → On PORT : ${server.address().port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${app.get('port')} is already in use. Stop the other backend process first.`);
    } else {
      console.error(`HTTP server failed: ${error.message}`);
    }
    process.exit(1);
  });
};

const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('MongoDB connected');
    const ensureStockMovementIndexes = require('./setup/ensureStockMovementIndexes');
    await ensureStockMovementIndexes();
    const { processRecurringInvoices } = require('./services/recurringInvoiceService');
    let recurringJobRunning = false;
    const runRecurringInvoices = async () => {
      if (recurringJobRunning) return;
      recurringJobRunning = true;
      try {
        const created = await processRecurringInvoices();
        if (created) console.log(`${created} wiederkehrende Rechnungsentwürfe erstellt`);
      } catch (error) {
        console.error(`Wiederkehrende Rechnungen fehlgeschlagen: ${error.message}`);
      } finally {
        recurringJobRunning = false;
      }
    };
    startHttpServer();
    runRecurringInvoices();
    setInterval(runRecurringInvoices, 15 * 60 * 1000).unref();
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error('Check DATABASE in backend/.env and make sure MongoDB is running.');
    process.exit(1);
  }
};

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  if (!server) {
    mongoose.connection.close().finally(() => process.exit(0));
    return;
  }
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
