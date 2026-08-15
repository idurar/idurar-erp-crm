// src/router/routes.js

import React from 'react';
import TaxPage from '@/pages/TaxPage';

// Dummy HomePage component (replace with your real one)
const HomePage = () => <div>Welcome to Home Page</div>;

const routes = {
  default: [
    { path: '/', element: <HomePage /> },
    { path: '/tax', element: <TaxPage /> },
  ],
};

export default routes;
