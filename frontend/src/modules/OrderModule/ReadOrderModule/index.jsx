import NotFound from '@/components/NotFound';
import { ErpLayout } from '@/layout';
import ReadItem from '@/modules/AdvancedCrudModule/ReadItem';

import PageLoader from '@/components/PageLoader';
import { adavancedCrud } from '@/redux/adavancedCrud/actions';
import { selectReadItem } from '@/redux/adavancedCrud/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

export default function ReadInvoiceModule({ config }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(adavancedCrud.read({ entity: config.entity, id }));
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

  if (isLoading) {
    return (
      <ErpLayout>
        <PageLoader />
      </ErpLayout>
    );
  } else
    return (
      <ErpLayout>
        {isSuccess ? (
          <ReadItem config={config} selectedItem={currentResult} />
        ) : (
          <NotFound entity={config.entity} />
        )}
      </ErpLayout>
    );
}
