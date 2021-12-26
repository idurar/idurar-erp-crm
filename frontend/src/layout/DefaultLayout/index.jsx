import React from 'react';

import { CrudContextProvider } from '@/context/crud';

function DefaultLayout({ children }) {
  return <CrudContextProvider>{children}</CrudContextProvider>;
}

export default DefaultLayout;
