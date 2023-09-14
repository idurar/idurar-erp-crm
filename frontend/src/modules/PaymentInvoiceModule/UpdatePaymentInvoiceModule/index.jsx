import { ErpLayout } from '@/layout';
import UpdateItem from '@/modules/ErpPanelModule/UpdateItem';
import PaymentInvoiceForm from '@/modules/PaymentInvoiceModule/Forms/PaymentInvoiceForm';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectItemById, selectCurrentItem } from '@/redux/erp/selectors';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import Payment from './components/Payment';
import { selectReadItem } from '@/redux/erp/selectors';

export default function UpdatePaymentInvoiceModule({ config }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  console.log('🚀 ~ file: index.jsx:17 ~ UpdatePaymentInvoiceModule ~ id:', id);

  let item = useSelector(selectItemById(id));
  console.log('🚀 ~ file: index.jsx:20 ~ UpdatePaymentInvoiceModule ~ item:', item);

  useLayoutEffect(() => {
    // if (item) {
    //   dispatch(erp.currentItem({ data: item }));
    // } else {
    //   dispatch(erp.read({ entity: config.entity, id }));
    // }
    dispatch(erp.read({ entity: config.entity, id }));
    console.log('🚀 ~ file: index.jsx:29 ~ useEffect ~ config.entity:', config.entity);
  }, [item, id]);

  const { result: currentResult } = useSelector(selectReadItem);

  item = item ? item : currentResult;

  useLayoutEffect(() => {
    dispatch(erp.currentAction({ actionType: 'update', id, data: item }));
  }, []);

  console.log('🚀 ~ file: index.jsx:38 ~ useEffect ~ item:', item);
  return (
    <ErpLayout>{item ? <Payment config={config} currentItem={item} /> : <PageLoader />}</ErpLayout>
  );
}
