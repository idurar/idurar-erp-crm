import { glob } from 'glob';

const pattern = './src/models/**/*.js';

const modelsFilesPaths = await glob(pattern);
const modelsFilesImports = await modelsFilesPaths.map(
  async (path) => await import(path.replace('src/', '#'))
);

export default modelsFilesImports;
