import ReadItem from '@/components/ErpPanel/ReadItem';
import PageLoader from '@/components/PageLoader';
import { ErpLayout } from '@/layout';
import { erp } from '@/redux/erp/actions';
import { selectItemById } from '@/redux/erp/selectors';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const PANEL_TITLE = 'quote';
const dataTableTitle = 'quotes Lists';
const ADD_NEW_ENTITY = 'Add new quote';
const DATATABLE_TITLE = 'quotes List';
const ENTITY_NAME = 'quote';
const CREATE_ENTITY = 'Save quote';
const UPDATE_ENTITY = 'Update quote';

const config = {
  entity: 'Quote',
  PANEL_TITLE,
  dataTableTitle,
  ENTITY_NAME,
  CREATE_ENTITY,
  ADD_NEW_ENTITY,
  UPDATE_ENTITY,
  DATATABLE_TITLE,
  // dataTableColumns,
  // searchConfig,
  // entityDisplayLabels,
};

export default function InvoiceRead() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const item = useSelector(selectItemById(id));
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (item) {
      clearTimeout(timeoutId);
      dispatch(erp.currentItem({ data: item }));
    } else {
      // If item is undefined for more than 3 seconds, it means the
      // id was invalid and will redirect the user.

      setTimeoutId(
        setTimeout(() => {
          history.push('/quote');
        }, 3000)
      );
    }
  }, [item]);

  useLayoutEffect(() => {
    dispatch(erp.list({ entity: 'Quote' }));
  }, []);

  return (
    <ErpLayout>
      {item ? <ReadItem config={config} selectedItem={item} /> : <PageLoader />}
    </ErpLayout>
  );
}
