import { useState, useEffect } from 'react';

import { Divider, Typography, Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { EditOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';
import { generate as uniqueId } from 'shortid';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';

const { Title, Paragraph } = Typography;

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const { erpContextAction } = useErpContext();
  const navigate = useNavigate();

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
          navigate(`/${entity.toLowerCase()}`);//navigate to previous page
        }}
        title={`${ENTITY_NAME} # ${currentErp?.emailName}`}
        ghost={false}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              readPanel.close();
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
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
              navigate(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <div>
        <Title level={3}>{translate('Subject')}</Title>
        <Paragraph>{currentErp.emailSubject}</Paragraph>
        <Title level={3}>{translate('Body')}</Title>
        <div dangerouslySetInnerHTML={{ __html: currentErp.emailBody }} />
      </div>
    </>
  );
}
