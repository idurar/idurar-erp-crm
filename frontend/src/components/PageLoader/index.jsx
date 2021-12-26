import React from 'react';
import { Spin } from 'antd';

const PageLoader = () => {
  return (
    <div className="centerAbsolute">
      <Spin size="large" />
    </div>
  );
};
export default PageLoader;
