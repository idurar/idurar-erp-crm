import React, { useState, useEffect } from 'react';

import { Divider, Typography, Button, PageHeader } from 'antd';
import { EditOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';
import uniqueId from '@/utils/uinqueId';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const { Title, Paragraph } = Typography;



export default function ReadItem({ config, selectedItem }) {
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const { erpContextAction } = useErpContext();
  const history = useHistory();

  const { result: currentResult } = useSelector(selectCurrentItem);

  const { readPanel, updatePanel } = erpContextAction;

  const resetErp = {

    emailName: '',
    emailKey: '',
    emailSubject: '',
    emailBody: '',
    emailVariables: [],
    _id: '',

  };

  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);

  useEffect(() => {
    const controller = new AbortController();
    if (currentResult) {
      setCurrentErp(currentResult);
    }
    return () => controller.abort();
  }, [currentResult]);

  return (
    <>
      <PageHeader
        onBack={() => {
          readPanel.close();
          history.goBack();
        }}
        title={`${ENTITY_NAME} # ${currentErp?.emailName}`}
        ghost={false}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              readPanel.close();
              history.push(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            Close
          </Button>,

          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentErp,
                })
              );
              updatePanel.open();
              history.push(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            Edit Template
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}

      ></PageHeader>
      <Divider dashed />
      <div>
        <Title level={3}>Subject</Title>
        <Paragraph>{currentErp.emailSubject}</Paragraph>
        <Title level={3}>Body</Title>
        <div dangerouslySetInnerHTML={{ __html: currentErp.emailBody }} />

      </div>
    </>
  );
}
