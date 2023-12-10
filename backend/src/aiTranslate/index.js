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

const generateBackendFile = ({ language, newLanguageContent }) => {
  const txt = objectToText(newLanguageContent);
  const fileContent = `module.exports = ${txt}`;

  const filePath = '../backend/src/locale/translation/' + language + '.js';

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

const generateFrontendFile = ({ language, newLanguageContent }) => {
  const txt = objectToText(newLanguageContent);
  const fileContent = `const lang = ${txt}\n export default lang`;

  const filePath = '../frontend/src/locale/translation/' + language + '.js';

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};
// Creating an instance of OpenAIApi with API key from the environment variables

async function translate(language, langObject) {
  const objText = objectToText(langObject);
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      {
        role: 'system',
        content:
          'You will be provided with text as js object, and your task is to translate all text into requested language , and return result as valid json',
      },
      {
        role: 'user',
        content: `translate this into ${language} language : ${objText}`,
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

const missedWords = require(`./missedWords`);

async function generateTranslation(language) {
  const filePath = `../locale/translation/${language.value}`;
  const currentLang = require(filePath);

  const result = await translate(language.label, missedWords);
  const translatedFile = JSON.parse(result);

  const newLanguageContent = { ...currentLang, ...translatedFile };

  generateBackendFile({ language: language.value, newLanguageContent });
  generateFrontendFile({ language: language.value, newLanguageContent });
}

languages.forEach(({ label, value }) => {
  generateTranslation({ label, value });
});
