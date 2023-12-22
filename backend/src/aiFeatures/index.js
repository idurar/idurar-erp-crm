require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

function objectToText(obj) {
  let text = '{\n';
  Object.entries(obj).forEach(([key, value]) => {
    text += `${key}: "${value}",\n`;
  });
  text += '}';
  return text;
}

const generateFeaturesFile = ({ language, file_name, newFeaturesContent }) => {
  const filePath = '../features/' + language + '_' + file_name + '.md';

  fs.writeFile(filePath, newFeaturesContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};
// Creating an instance of OpenAIApi with API key from the environment variables

async function translate(language, content) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      {
        role: 'system',
        content:
          'You will be provided with text as markdown file, and your task is to translate this text into requested language , and return result as markdown file',
      },
      {
        role: 'user',
        content: `translate this into ${language} language : ${content}`,
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

async function translateFileName(language, filename) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      {
        role: 'system',
        content:
          'You will be provided with file name , and your task is to translate this text into requested language , and return result as filename with underscore instead of spaces between words.',
      },
      {
        role: 'user',
        content: `translate this filename into ${language} language : ${filename}`,
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

const languages = require('../locale/languages');

const featuresContent = fs.readFileSync(`./src/aiFeatures/featuresContent.md`, 'utf-8');

async function generateTranslation(language) {
  const newFeaturesContent = await translate(language.label, featuresContent);

  const file_name = await translateFileName(language.label, 'free_open_source_erp_crm_software');
  generateFeaturesFile({
    language: language.value,
    file_name,
    newFeaturesContent,
  });
}

languages.forEach(({ label, value }) => {
  generateTranslation({ label, value });
});
