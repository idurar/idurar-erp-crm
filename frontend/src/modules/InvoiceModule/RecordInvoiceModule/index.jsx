import { ErpLayout } from '@/layout';
import RecordPayment from '@/modules/ErpPanelModule/RecordPayment';
import InvoiceForm from '@/modules/InvoiceModule/Forms/InvoiceForm';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectItemById, selectCurrentItem } from '@/redux/erp/selectors';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

export default function RecordInvoiceModule({ config }) {
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
  }, [item]);

  const { result: currentResult } = useSelector(selectCurrentItem);

  item = currentResult;

  return (
    <ErpLayout>
      {item ? <RecordPayment config={config} UpdateForm={InvoiceForm} /> : <PageLoader />}
    </ErpLayout>
  );
}
