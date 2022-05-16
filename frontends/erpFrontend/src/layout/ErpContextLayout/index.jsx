import React from 'react';

import { ErpContextProvider } from '@/context/erp';

function ErpContextLayout({ children }) {
  return <ErpContextProvider>{children}</ErpContextProvider>;
}

export default ErpContextLayout;
