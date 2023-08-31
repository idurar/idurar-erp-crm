import { ErpLayout } from '@/layout';
import UpdateItem from '@/modules/ErpPanelModule/UpdateItem';
import InvoiceForm from '@/modules/InvoiceModule/Forms/InvoiceForm';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectItemById } from '@/redux/erp/selectors';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

export default function UpdateInvoiceModule({ config }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const item = useSelector(selectItemById(id));
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (item) {
      dispatch(erp.currentAction({ actionType: 'update', data: item }));
    } else {
      // If item is undefined for more than 3 seconds, it means the
      // id was invalid and will redirect the user.
    }
  }, [item]);

  useLayoutEffect(() => {
    dispatch(erp.list({ entity: 'Invoice' }));
  }, []);

  return (
    <ErpLayout>
      {item ? <UpdateItem config={config} UpdateForm={InvoiceForm} /> : <PageLoader />}
    </ErpLayout>
  );
}
