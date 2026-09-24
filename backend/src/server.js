import 'module-alias/register';
import { connect, connection } from 'mongoose';
import { globSync } from 'glob';
import { resolve } from 'path';

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
import('dotenv').config({ path: '.env' });
import('dotenv').config({ path: '.env.local' });

connect(process.env.DATABASE);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

connection.on('error', (error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

const modelsFiles = globSync('./src/models/**/*.js');

for (const filePath of modelsFiles) {
  import(resolve(filePath));
}

// Start our app!
import app from './app';
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → On PORT : ${server.address().port}`);
});
