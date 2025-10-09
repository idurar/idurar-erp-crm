import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

// function importModule(path) {
//   // who knows what will be imported here?
//   return import(path);
// }
export default {
  plugins: [
    dynamicImportVars({
      // options
    }),
  ],
};
