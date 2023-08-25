import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectItemById } from '@/redux/erp/selectors';
import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useErpContext } from '@/context/erp';
import { erp } from '@/redux/erp/actions';
import { useEffect } from 'react';

const useUrlAction = (entity) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { action, id } = useParams();
  const { erpContextAction } = useErpContext();
  const { readPanel, updatePanel, recordPanel, createPanel, modal } = erpContextAction;
  const item = useSelector(selectItemById(id));

  function Read() {
    dispatch(erp.currentItem({ data: item }));
    readPanel.open();
  }

  function RecordPayment() {
    dispatch(erp.currentAction({ actionType: 'recordPayment', data: item }));
    recordPanel.open();
    dispatch(erp.currentItem({ data: item }));
  }

  function Edit() {
    dispatch(erp.currentAction({ actionType: 'update', data: item }));
    updatePanel.open();
  }

  function Download() {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${id}.pdf`, '_blank');
  }

  function New() {
    dispatch(erp.currentAction({ actionType: 'create', data: item }));
    createPanel.open();
    console.log(createPanel);
  }

  useEffect(() => {
    if (item !== undefined) {
      console.log(action);
      if (action === 'edit') {
        Edit();
      } else if (action === 'read') {
        Read();
      } else {
        history.replace(`/${entity}`);
      }
    } else if (action === 'new') {
      New();
    }
  }, [item]);
};
export default useUrlAction;
