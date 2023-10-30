import { useLayoutEffect, Suspense } from 'react';

import PageLoader from '@/components/PageLoader';
import { useDispatch } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';
import RoutesAppConfig from './RoutesAppConfig';

export default function AppRouter() {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <RoutesAppConfig />
    </Suspense>
  );
}
