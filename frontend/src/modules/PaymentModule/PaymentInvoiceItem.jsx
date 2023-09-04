import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';

import { Button, PageHeader, Row, Col, Descriptions, Statistic, Tag, Spin } from 'antd';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  MailOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';
import uniqueId from '@/utils/uinqueId';

import { selectReadItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useMoney } from '@/settings';
import useMail from '@/hooks/useMail';

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

export default function PaymentInvoiceItem({ config }) {
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const { erpContextAction } = useErpContext();
  const { moneyFormatter } = useMoney();
  const { send } = useMail({ entity });

  const { result: currentResult, isLoading } = useSelector(selectReadItem);

  const { readPanel, updatePanel } = erpContextAction;

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState({
    status: '',
    client: {
      company: '',
      email: '',
      phone: '',
      address: '',
    },
    invoice: {
      subTotal: 0,
      taxTotal: 0,
      taxRate: 0,
      total: 0,
      credit: 0,
      number: 0,
      year: 0,
    },
  });

  useEffect(() => {
    console.log(currentResult);
    if (currentResult) {
      const { items } = currentResult?.invoice;

      setItemsList(items);
      setCurrentErp(currentResult);
    }
  }, [currentResult]);

  return (
    <>
      <PageHeader
        onBack={() => readPanel.close()}
        title={`${ENTITY_NAME} # ${currentErp?.number || ''}/${currentErp?.year || ''}`}
        ghost={false}
        tags={<Tag color="volcano">{currentErp.paymentStatus || currentErp.status}</Tag>}
        // subTitle="This is cuurent erp page"
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(`${DOWNLOAD_BASE_URL}invoice/${currentErp?.invoice?.pdfPath}`, '_blank');
            }}
            icon={<FilePdfOutlined />}
            disabled={isLoading}
          >
            Download PDF
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              send(currentErp?.invoice?._id);
            }}
            icon={<MailOutlined />}
            disabled={isLoading}
          >
            Mail Invoice
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
            }}
            type="primary"
            icon={<EditOutlined />}
            disabled={isLoading}
          >
            Edit Erp
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
        <Row gutter={[12, 0]}>
          <Col xs={12} md={8} lg={6}>
            <Statistic
              title="Status"
              value={currentErp?.invoice?.status}
              style={{
                margin: '0 32px',
              }}
            />
          </Col>
          <Col xs={12} md={8} lg={6}>
            <Statistic
              title="SubTotal"
              value={moneyFormatter({ amount: currentErp?.invoice?.subTotal })}
              style={{
                margin: '0 32px',
              }}
            />
          </Col>
          <Col xs={12} md={8} lg={6}>
            <Statistic
              title="Total"
              value={moneyFormatter({ amount: currentErp?.invoice?.total })}
              style={{
                margin: '0 32px',
              }}
            />
          </Col>
          <Col xs={12} md={8} lg={6}>
            <Statistic
              title="Balance"
              value={moneyFormatter({ amount: currentErp?.invoice?.credit })}
              style={{
                margin: '0 32px',
              }}
            />
          </Col>
        </Row>
      </PageHeader>
      {isLoading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      ) : (
        <>
          <Divider dashed />
          <Row gutter={[12, 0]}>
            <Col className="gutter-row" md={12}>
              <Descriptions title={`Client : ${currentErp.client.company || '-'}`}>
                <Descriptions.Item label="E-mail">
                  {currentErp.client.email || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {currentErp.client.phone || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {currentErp.client.address || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col className="gutter-row" md={12}>
              <Descriptions title="Payment: ">
                <Descriptions.Item label="Mode">
                  <span className="capitalize">{currentErp?.paymentMode?.name}</span>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <Divider />
          {itemslist && (
            <>
              <Row gutter={[12, 0]}>
                <Col className="gutter-row" span={11}>
                  <p>
                    <strong>ITEM</strong>
                  </p>
                </Col>
                <Col className="gutter-row" span={4}>
                  <p
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <strong>PRICE</strong>
                  </p>
                </Col>
                <Col className="gutter-row" span={4}>
                  <p
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <strong>QUANTITY</strong>
                  </p>
                </Col>
                <Col className="gutter-row" span={5}>
                  <p
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <strong>TOTAL</strong>
                  </p>
                </Col>
                <Divider />
              </Row>
              {itemslist?.map((item) => (
                <Item key={item._id} item={item}></Item>
              ))}
            </>
          )}
          <div
            style={{
              width: '300px',
              float: 'right',
              textAlign: 'right',
              fontWeight: '700',
            }}
          >
            <Row gutter={[12, -5]}>
              <Col className="gutter-row" span={12}>
                <p>Sub Total :</p>
              </Col>

              <Col className="gutter-row" span={12}>
                <p>{moneyFormatter({ amount: currentErp?.invoice?.subTotal })}</p>
              </Col>
              <Col className="gutter-row" span={12}>
                <p>Tax Total ({currentErp?.invoice?.taxRate * 100} %) :</p>
              </Col>
              <Col className="gutter-row" span={12}>
                <p>{moneyFormatter({ amount: currentErp?.invoice?.taxTotal })}</p>
              </Col>
              <Col className="gutter-row" span={12}>
                <p>Total :</p>
              </Col>
              <Col className="gutter-row" span={12}>
                <p>{moneyFormatter({ amount: currentErp?.invoice?.total })}</p>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
}
