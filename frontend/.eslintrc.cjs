module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 0,
    'no-unused-vars': 'error',
  },
  overrides: [
    {
      // These modules intentionally colocate providers/hooks or route-level lazy exports.
      // Splitting them would add indirection without improving runtime correctness.
      files: [
        'src/context/**/index.jsx',
        'src/hooks/useNetwork.jsx',
        'src/locale/Localization.jsx',
        'src/router/routes.jsx',
      ],
      rules: { 'react-refresh/only-export-components': 'off' },
    },
  ],
};
