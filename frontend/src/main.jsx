import { createRoot } from 'react-dom/client';

import RootApp from './RootApp';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<RootApp />);
