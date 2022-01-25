import React from 'react';

import { Button, Menu } from 'antd';
import { EyeOutlined, EditOutlined, LockOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectItemById } from '@/redux/crud/selectors';
import { useCrudContext } from '@/context/crud';
import uniqueId from '@/utils/uinqueId';
import DataTable from '@/components/DataTable';

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;
  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}
function DropDownRowMenu({ row }) {
  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, advancedBox, readBox, editBox } = crudContextAction;
  const item = useSelector(selectItemById(row._id));
  const Show = () => {
    dispatch(crud.currentItem({ data: item }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function Edit() {
    dispatch(crud.currentItem({ data: item }));
    dispatch(crud.currentAction({ actionType: 'update', data: item }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function UpdatePassword() {
    dispatch(crud.currentItem({ data: item }));
    dispatch(crud.currentAction({ actionType: 'update', data: item }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }
  function Delete() {
    dispatch(crud.currentAction({ actionType: 'delete', data: item }));
    modal.open();
  }
  return (
    <Menu style={{ minWidth: 130 }}>
      <Menu.Item key={`${uniqueId()}`} icon={<EyeOutlined />} onClick={Show}>
        Show
      </Menu.Item>
      <Menu.Item key={`${uniqueId()}`} icon={<EditOutlined />} onClick={Edit}>
        Edit
      </Menu.Item>
      <Menu.Item key={`${uniqueId()}`} icon={<LockOutlined />} onClick={UpdatePassword}>
        Update Password
      </Menu.Item>
      <Menu.Item key={`${uniqueId()}`} icon={<DeleteOutlined />} onClick={Delete}>
        Delete
      </Menu.Item>
    </Menu>
  );
}

export default function AdminCrudModule({ config }) {
  return <DataTable config={config} DropDownRowMenu={DropDownRowMenu} AddNewItem={AddNewItem} />;
}
