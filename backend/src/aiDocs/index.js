require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const generateDocsFile = ({ file_name, newDocsContent }) => {
  const filePath = '../docs/' + file_name + '.md';

  fs.writeFile(filePath, newDocsContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};
// Creating an instance of OpenAIApi with API key from the environment variables

async function documentThisFile(file) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      {
        role: 'system',
        content:
          'You will be provided with js file , and your task is to create Tutorial for this file , the Tutorial should be long, you need include the repository of this code witch is IDUARR open source erp crm based on Mern-stack "### Github repo : https://github.com/idurar/idurar-erp-crm ", and return result as markdown file',
      },
      {
        role: 'user',
        content: `Create long Tutorial for this file : ${file}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 12000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const list = response.choices[0].message.content;
  return list;
}
async function generateFileName(file) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      {
        role: 'system',
        content:
          'You will be provided with markdown content file function doc , and your task is to create Title for this file , title file should seo freindly , and return result as text title',
      },
      {
        role: 'user',
        content: `Create Title for this Documentation : ${file}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 12000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const list = response.choices[0].message.content;
  return list;
}

const jsFile = fs.readFileSync(`./src/aiDocs/function.js`, 'utf-8');

// const { globSync } = require('glob');
// const path = require('path');

// const pattern = './src/controllers/appControllers/*/**/';
// const files = globSync(pattern).map((filePath) => {
//   return path.basename(filePath);
// });

async function generateDocs() {
  const newDocsContent = await documentThisFile(jsFile);

  const file_name = await generateFileName(newDocsContent);
  generateDocsFile({
    file_name,
    newDocsContent,
  });
}

generateDocs();
