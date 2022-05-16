import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';

import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';

import CreateForm from '@/components/CreateForm';
import UpdateForm from '@/components/UpdateForm';
import DeleteModal from '@/components/DeleteModal';
import ReadItem from '@/components/ReadItem';
import SearchItem from '@/components/SearchItem';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';

import { CrudLayout } from '@/layout';

import AdminDataTable from './AdminDataTable';
import UpdatePassword from './UpdatePassword';

import { selectCurrentItem } from '@/redux/crud/selectors';

function SidePanelTopContent({ config, formElements }) {
  const { crudContextAction, state } = useCrudContext();
  const { entityDisplayLabels } = config;
  const { panel, advancedBox, modal, readBox, editBox } = crudContextAction;

  const { isReadBoxOpen, isEditBoxOpen, isAdvancedBoxOpen } = state;
  const { result: currentItem } = useSelector(selectCurrentItem);
  const dispatch = useDispatch();

  const [labels, setLabels] = useState('');
  useEffect(() => {
    if (currentItem) {
      const currentlabels = entityDisplayLabels.map((x) => currentItem[x]).join(' ');

      setLabels(currentlabels);
    }
  }, [currentItem]);

  const removeItem = () => {
    dispatch(crud.currentAction({ actionType: 'delete', data: currentItem }));
    modal.open();
  };
  const editItem = () => {
    dispatch(crud.currentAction({ actionType: 'update', data: currentItem }));
    editBox.open();
  };
  const updatePassword = () => {
    dispatch(crud.currentAction({ actionType: 'update', data: currentItem }));
    advancedBox.open();
  };

  const show =
    isReadBoxOpen || isEditBoxOpen || isAdvancedBoxOpen ? { opacity: 1 } : { opacity: 0 };
  return (
    <>
      <Row style={show}>
        {/* <Col span={13}>
          <p style={{ marginBottom: "10px" }}>{labels}</p>
        </Col> */}
        <Col span={24}>
          <Button
            onClick={removeItem}
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            style={{
              float: 'left',
              marginRight: '5px',
              marginLeft: '-5px',
            }}
          >
            remove
          </Button>
          <Button
            onClick={editItem}
            type="text"
            icon={<EditOutlined />}
            size="small"
            style={{ float: 'left', marginRight: '5px' }}
          >
            edit
          </Button>
          <Button
            onClick={updatePassword}
            type="text"
            icon={<LockOutlined />}
            size="small"
            style={{ float: 'left', marginRight: '0px' }}
          >
            update password
          </Button>
        </Col>

        <Col span={24}></Col>
        <div className="space10"></div>
      </Row>
      <ReadItem config={config} />
      <UpdateForm config={config} formElements={formElements} />
      <UpdatePassword config={config} />
    </>
  );
}

function FixHeaderPanel({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox } = crudContextAction;

  const addNewItem = () => {
    collapsedBox.close();
  };
  return (
    <div className="box">
      <Row gutter={12}>
        <Col className="gutter-row" span={21}>
          <h1 style={{ fontSize: 20, marginBottom: 20 }}>{config.PANEL_TITLE}</h1>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col className="gutter-row" span={21}>
          <SearchItem config={config} />
        </Col>
        <Col className="gutter-row" span={3}>
          <Button onClick={addNewItem} block={true} icon={<PlusOutlined />}></Button>
        </Col>
      </Row>
    </div>
  );
}

function AdminCrudModule({ config, createForm, updateForm }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(crud.resetState());
  }, []);

  return (
    <CrudLayout
      config={config}
      fixHeaderPanel={<FixHeaderPanel config={config} />}
      sidePanelBottomContent={<CreateForm config={config} formElements={createForm} />}
      sidePanelTopContent={<SidePanelTopContent config={config} formElements={updateForm} />}
    >
      <AdminDataTable config={config} />
      <DeleteModal config={config} />
    </CrudLayout>
  );
}

export default AdminCrudModule;
