import { Menu } from 'antd';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
import { erp } from '@/redux/erp/actions';
import { selectItemById } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import uniqueId from '@/utils/uinqueId';
import { useHistory } from 'react-router-dom';

const Read = ({ record, entity }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const item = useSelector(selectItemById(record._id));
  function onClick() {
    dispatch(erp.currentItem({ data: item }));
    history.push(`/offer/read/${record._id}`);
  }

  return <div onClick={onClick}>Read</div>;
};

export default function DataTableDropMenu({ row, entity }) {
  // const dispatch = useDispatch();
  // const history = useHistory();
  // const { erpContextAction } = useErpContext();
  // const { recordPanel, modal } = erpContextAction;
  // const item = useSelector(selectItemById(row._id));
  // function Read(e) {
  //   e.preventDefault();
  //   dispatch(erp.currentItem({ data: item }));

  //   history.push(`/offer/read/${row._id}`);
  // }

  // function Edit() {
  //   e.preventDefault();
  //   dispatch(erp.currentAction({ actionType: 'update', data: item }));

  //   history.push(`/offer/update/${row._id}`);
  // }
  // function Delete() {
  //   e.preventDefault();
  //   dispatch(erp.currentAction({ actionType: 'delete', data: item }));
  //   modal.open();
  // }
  // function Download() {
  //   e.preventDefault();
  //   window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${row._id}.pdf`, '_blank');
  // }
  return [
    {
      label: <Read row={row} entity={entity} />,
      key: `${uniqueId()}`,
      icon: <EyeOutlined />,
    },
    {
      label: <Read row={row} entity={entity} />,
      key: `${uniqueId()}`,
      icon: <EditOutlined />,
    },
    {
      label: <Read row={row} entity={entity} />,
      key: `${uniqueId()}`,
      icon: <FilePdfOutlined />,
    },
    {
      label: <Read row={row} entity={entity} />,
      key: `${uniqueId()}`,
      icon: <DeleteOutlined />,
    },
  ];
}
