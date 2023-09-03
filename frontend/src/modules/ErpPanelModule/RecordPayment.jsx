import React, { useState, useEffect } from 'react';
import { Form, Divider, Button, PageHeader, Tag } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectRecordPaymentItem } from '@/redux/erp/selectors';

import { useErpContext } from '@/context/erp';

import Loading from '@/components/Loading';

import PaymentInvoiceForm from '@/forms/PaymentInvoiceForm';
import { CloseCircleOutlined } from '@ant-design/icons';
import uniqueId from '@/utils/uinqueId';
import history from '@/utils/history';

export default function RecordPayment({ config }) {
  let { entity, RECORD_ENTITY } = config;
  const { erpContextAction } = useErpContext();
  const { recordPanel } = erpContextAction;
  const dispatch = useDispatch();

  const { isLoading, isSuccess, current: currentInvoice } = useSelector(selectRecordPaymentItem);

  const [form] = Form.useForm();

  const [maxAmount, setMaxAmount] = useState(0);

  useEffect(() => {
    if (currentInvoice) {
      const { credit, total, discount } = currentInvoice;
      setMaxAmount(total - discount - credit);
    }
  }, [currentInvoice]);
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'recordPayment' }));
      recordPanel.close();
      dispatch(erp.list({ entity }));
    }
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    if (currentInvoice) {
      const { _id: invoice } = currentInvoice;
      const client = currentInvoice.client && currentInvoice.client._id;
      fieldsValue = {
        ...fieldsValue,
        invoice,
        client,
      };
    }

    dispatch(
      erp.recordPayment({
        entity: 'paymentInvoice',
        jsonData: fieldsValue,
      })
    );
  };

  return (
    <>
      <PageHeader
        onBack={() => {
          history.push(`/${entity.toLowerCase()}`);
        }}
        title={RECORD_ENTITY}
        ghost={false}
        tags={<Tag color="volcano">Draft</Tag>}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              history.push(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            Cancel
          </Button>,
          // <SaveForm config={config} form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <PaymentInvoiceForm maxAmount={maxAmount} />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Record Payment
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </>
  );
}
