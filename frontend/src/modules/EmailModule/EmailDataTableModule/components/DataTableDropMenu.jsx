import { Menu } from 'antd';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectItemById } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import uniqueId from '@/utils/uinqueId';
import { useHistory } from 'react-router-dom';

export default function DataTableDropMenu({ row, entity }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { erpContextAction } = useErpContext();
  const { recordPanel, modal } = erpContextAction;
  const item = useSelector(selectItemById(row._id));
  function Read() {
    dispatch(erp.currentItem({ data: item }));
    // readPanel.open();
    history.push(`/email/read/${row._id}`);
  }

  function Edit() {
    dispatch(erp.currentAction({ actionType: 'update', data: item }));
    // updatePanel.open();
    history.push(`/email/update/${row._id}`);
  }
  return (
    <Menu style={{ minWidth: 130 }}>
      <Menu.Item key={`${uniqueId()}`} icon={<EyeOutlined />} onClick={Read}>
        Show
      </Menu.Item>
      <Menu.Item key={`${uniqueId()}`} icon={<EditOutlined />} onClick={Edit}>
        Edit
      </Menu.Item>
    </Menu>
  );
}
