import { useState, useEffect } from 'react';

import { Button, Row, Col, Descriptions, Tag, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { FileTextOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { generate as uniqueId } from 'shortid';

import { useMoney } from '@/settings';

import RecordPayment from './RecordPayment';
import useLanguage from '@/locale/useLanguage';
import { tagColor } from '@/utils/statusTagColor';
import { useNavigate } from 'react-router-dom';

export default function Payment({ config, currentItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;

  const money = useMoney();
  const navigate = useNavigate();

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState(currentItem);

  const [client, setClient] = useState({});
  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client[currentErp.client.type]);
    }
  }, [currentErp]);

  useEffect(() => {
    const controller = new AbortController();
    if (currentItem) {
      const { items } = currentItem;

      setItemsList(items);
      setCurrentErp(currentItem);
    }
    return () => controller.abort();
  }, [currentItem]);

  useEffect(() => {
    console.info('itemslist', itemslist);
  }, [itemslist]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 20, push: 2 }}
        >
          <PageHeader
            onBack={() => navigate(`/${entity.toLowerCase()}`)}
            title={`Record Payment for ${ENTITY_NAME} # ${currentErp.number}/${
              currentErp.year || ''
            }`}
            ghost={false}
            tags={
              <Tag color={tagColor(currentErp.paymentStatus)?.color}>
                {currentErp.paymentStatus && translate(currentErp.paymentStatus)}
              </Tag>
            }
            // subTitle="This is cuurent erp page"
            extra={[
              <Button
                key={`${uniqueId()}`}
                onClick={() => {
                  navigate(`/${entity.toLowerCase()}`);
                }}
                icon={<CloseCircleOutlined />}
              >
                {translate('Cancel')}
              </Button>,
              <Button
                key={`${uniqueId()}`}
                onClick={() => navigate(`/invoice/read/${currentErp._id}`)}
                icon={<FileTextOutlined />}
              >
                {translate('Show Invoice')}
              </Button>,
            ]}
            style={{
              padding: '20px 0px',
            }}
          ></PageHeader>
          <Divider dashed />
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 10, order: 2, push: 2 }}
          lg={{ span: 10, order: 2, push: 4 }}
        >
          <div className="space50"></div>
          <Descriptions title={`${translate('Client')}  : ${currentErp.client.name}`} column={1}>
            <Descriptions.Item label={translate('email')}>{client.email}</Descriptions.Item>
            <Descriptions.Item label={translate('phone')}>{client.phone}</Descriptions.Item>
            <Divider dashed />
            <Descriptions.Item label={translate('payment status')}>
              <Tag color={tagColor(currentErp.paymentStatus)?.color}>
                {currentErp.paymentStatus && translate(currentErp.paymentStatus)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={translate('sub total')}>
              {money.amountFormatter({ amount: currentErp.subTotal })}
            </Descriptions.Item>
            <Descriptions.Item label={translate('total')}>
              {money.amountFormatter({ amount: currentErp.total })}
            </Descriptions.Item>
            <Descriptions.Item label={translate('discount')}>
              {money.amountFormatter({ amount: currentErp.discount })}
            </Descriptions.Item>
            <Descriptions.Item label={translate('Balance')}>
              {money.amountFormatter({ amount: currentErp.credit })}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col
          className="gutter-row"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 1 }}
          lg={{ span: 10, order: 1, push: 2 }}
        >
          <RecordPayment config={config} />
        </Col>
      </Row>
    </>
  );
}
