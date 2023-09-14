import React, { useState, useEffect } from 'react';
import { Divider, Typography } from 'antd';

import { Button, PageHeader, Row, Col, Descriptions, Statistic, Tag } from 'antd';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  MailOutlined,
  ExportOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';
import uniqueId from '@/utils/uinqueId';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useMoney } from '@/settings';
import useMail from '@/hooks/useMail';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

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
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const { erpContextAction } = useErpContext();
  const { moneyFormatter } = useMoney();
  const { send } = useMail({ entity });
  const history = useHistory();

  const { result: currentResult } = useSelector(selectCurrentItem);

  const { readPanel, updatePanel } = erpContextAction;

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
              history.push(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            Close
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
            Download PDF
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              send(currentErp._id);
            }}
            icon={<MailOutlined />}
          >
            Mail {entity.slice(0, 1).toUpperCase() + entity.slice(1).toLowerCase()}
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
              history.push(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            Edit
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
        <Row>
          <Statistic title="Status" value={currentErp.status} />
          <Statistic
            title="SubTotal"
            value={moneyFormatter({ amount: currentErp.subTotal })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title="Total"
            value={moneyFormatter({ amount: currentErp.total })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title="Amount"
            value={moneyFormatter({ amount: currentErp.amount })}
            style={{
              margin: '0 32px',
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`Client : ${currentErp.client.company}`}>
        <Descriptions.Item label="Address">{currentErp.client.address}</Descriptions.Item>
        <Descriptions.Item label="E-mail">{currentErp.client.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{currentErp.client.phone}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row>
        <Col sm={24} md={12}>
          <Typography.Title level={5}>Payment Information :</Typography.Title>
        </Col>
        <Col sm={24} md={12} style={{ textAlign: 'right' }}>
          <Button icon={<ExportOutlined />}>Show invoice</Button>
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
          {/* amount */}
          <Col className="gutter-row" span={12}>
            <p>Amount :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.amount })}</p>
          </Col>
          {/* total */}
          <Col className="gutter-row" span={12}>
            <p>Total :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.total })}</p>
          </Col>
          {/* total paid */}
          <Col className="gutter-row" span={12}>
            <p>Total Paid :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.credit })}</p>
          </Col>
          {/* total Remaining */}
          <Col className="gutter-row" span={12}>
            <p>Total Remaining :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.total - currentErp.credit })}</p>
          </Col>
        </Row>
      </div>
    </>
  );
}
