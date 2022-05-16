const { defaults } = require('jest-config');
module.exports = {
  ...defaults,
  moduleNameMapper: {
    '^@/(.+)': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: ['./src/setupTests.js'],
};
