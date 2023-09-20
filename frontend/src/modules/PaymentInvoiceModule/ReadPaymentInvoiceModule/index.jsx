import { ErpLayout } from '@/layout';
import ReadItem from './components/ReadItem';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectItemById, selectCurrentItem } from '@/redux/erp/selectors';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

export default function ReadPaymentInvoiceModule({ config }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  let item = useSelector(selectItemById(id));

  useEffect(() => {
    if (item) {
      dispatch(erp.currentItem({ data: item }));
    } else {
      dispatch(erp.read({ entity: config.entity, id }));
    }
    console.log('useEffect item');
  }, [item]);

  const { result: currentResult } = useSelector(selectCurrentItem);

  item = currentResult;
  return (
    <ErpLayout>
      {item ? <ReadItem config={config} selectedItem={item} /> : <PageLoader />}
    </ErpLayout>
  );
}
