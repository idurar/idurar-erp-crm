import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NotFound from '@/components/NotFound';

const NotFoundPage = () => {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(`notfound`, { replace: true });
  }, []);
  return <NotFound entity={''} />;
};
export default NotFoundPage;
