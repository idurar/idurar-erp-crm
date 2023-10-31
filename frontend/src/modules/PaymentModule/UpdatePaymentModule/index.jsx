import { ErpLayout } from '@/layout';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectItemById } from '@/redux/erp/selectors';
import { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Payment from './components/Payment';
import { selectReadItem } from '@/redux/erp/selectors';

export default function UpdatePaymentModule({ config }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  let item = useSelector(selectItemById(id));

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }));
  }, [item, id]);

  const { result: currentResult } = useSelector(selectReadItem);

  item = item ? item : currentResult;

  useLayoutEffect(() => {
    dispatch(erp.currentAction({ actionType: 'update', id, data: item }));
  }, []);

  return (
    <ErpLayout>{item ? <Payment config={config} currentItem={item} /> : <PageLoader />}</ErpLayout>
  );
}
