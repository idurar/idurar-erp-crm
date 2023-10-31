import { useState, useEffect } from 'react';

import { Button, Row, Col, Descriptions, Statistic, Tag, Divider, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  MailOutlined,
  ExportOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';

import { generate as uniqueId } from 'shortid';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useMoney } from '@/settings';
import useMail from '@/hooks/useMail';
import { useNavigate } from 'react-router-dom';

const Item = ({ item }) => {
  const { moneyFormatter } = useMoney();
  return (
    <Row gutter={[12, 0]} key={item._id}>
      <Col className="gutter-row" span={11}>
        <p style={{ marginBottom: 5 }}>
          <strong>{item.itemName}</strong>
        </p>
        <p>{item.description}</p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {moneyFormatter({ amount: item.price })}
        </p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.quantity}
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p
          style={{
            textAlign: 'right',
            fontWeight: '700',
          }}
        >
          {moneyFormatter({ amount: item.total })}
        </p>
      </Col>
      <Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
    </Row>
  );
};

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();

  const { moneyFormatter } = useMoney();
  const { send } = useMail({ entity });
  const navigate = useNavigate();

  const { result: currentResult } = useSelector(selectCurrentItem);

  const resetErp = {
    status: '',
    client: {
      company: '',
      email: '',
      phone: '',
      address: '',
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  };

  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);

  useEffect(() => {
    const controller = new AbortController();
    if (currentResult) {
      const { invoice, _id, ...others } = currentResult;
      setCurrentErp({ ...others, ...invoice, _id });
    }
    return () => controller.abort();
  }, [currentResult]);

  return (
    <>
      <PageHeader
        onBack={() => {
          history.goBack();
        }}
        title={`${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ''}`}
        ghost={false}
        tags={<Tag color="volcano">{currentErp.paymentStatus || currentErp.status}</Tag>}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentErp._id}.pdf`,
                '_blank'
              );
            }}
            icon={<FilePdfOutlined />}
          >
            {translate('Download PDF')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              send(currentErp._id);
            }}
            icon={<MailOutlined />}
          >
            {translate('Send by email')}
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
      >
        <Row>
          <Statistic title="Status" value={currentErp.status} />
          <Statistic
            title={translate('SubTotal')}
            value={moneyFormatter({ amount: currentErp.subTotal })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('Total')}
            value={moneyFormatter({ amount: currentErp.total })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('Amount')}
            value={moneyFormatter({ amount: currentErp.amount })}
            style={{
              margin: '0 32px',
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`${translate('Client')} : ${currentErp.client.company}`}>
        <Descriptions.Item label={translate('Address')}>
          {currentErp.client.address}
        </Descriptions.Item>
        <Descriptions.Item label={translate('email')}>{currentErp.client.email}</Descriptions.Item>
        <Descriptions.Item label={translate('Phone')}>{currentErp.client.phone}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row>
        <Col sm={24} md={12}>
          <Typography.Title level={5}>{translate('Payment Information')} :</Typography.Title>
        </Col>
        <Col sm={24} md={12} style={{ textAlign: 'right' }}>
          <Button icon={<ExportOutlined />}>label={translate('Show invoice')}</Button>
        </Col>
      </Row>
      <div
        style={{
          width: '300px',
          float: 'left',
          textAlign: 'right',
          fontWeight: '700',
        }}
      >
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={12}>
            <p>{translate('Amount')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.amount })}</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{translate('Total')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.total })}</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{translate('Total Paid')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.credit })}</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{translate('Total Remaining')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.total - currentErp.credit })}</p>
          </Col>
        </Row>
      </div>
    </>
  );
}
