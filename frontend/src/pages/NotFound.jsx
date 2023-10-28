import React, { useEffect } from 'react';
import NotFound from '@/components/NotFound';
import history from '@/utils/history';
const NotFoundPage = () => {
  useEffect(() => {
    history.replace('/notfound');
  }, []);
  return <NotFound entity={''} />;
};
export default NotFoundPage;
