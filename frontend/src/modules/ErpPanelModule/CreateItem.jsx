import React, { useState, useEffect } from 'react';
import { Form, Divider } from 'antd';

import { Button, PageHeader, Tag } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectCreatedItem } from '@/redux/erp/selectors';

import { useErpContext } from '@/context/erp';
import calculate from '@/utils/calculate';
import uniqueId from '@/utils/uinqueId';

import Loading from '@/components/Loading';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

function SaveForm({ form, config }) {
  let { CREATE_ENTITY } = config;
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {CREATE_ENTITY}
    </Button>
  );
}

export default function CreateItem({ config, CreateForm }) {
  let { entity, CREATE_ENTITY } = config;
  const { erpContextAction } = useErpContext();
  const history = useHistory();
  const { createPanel } = erpContextAction;
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [offerSubTotal, setOfferSubTotal] = useState(0);
  const handelValuesChange = (changedValues, values) => {
    const items = values['items'];
    let subTotal = 0;
    let subOfferTotal = 0;

    if (items) {
      items.map((item) => {
        console.log({ item });
        if (item) {
          if (item.offerPrice && item.quantity) {
            let offerTotal = calculate.multiply(item['quantity'], item['offerPrice']);
            subOfferTotal = calculate.add(subOfferTotal, offerTotal);
          }
          if (item.quantity && item.price) {
            let total = calculate.multiply(item['quantity'], item['price']);
            //sub total
            subTotal = calculate.add(subTotal, total);
          }
        }
      });
      setSubTotal(subTotal);
      setOfferSubTotal(subOfferTotal);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'create' }));
      setSubTotal(0);
      setOfferSubTotal(0);
      createPanel.close();
      dispatch(erp.list({ entity }));
    }
    return () => {};
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    if (fieldsValue) {
      if (fieldsValue.items) {
        let newList = [...fieldsValue.items];
        newList.map((item) => {
          item.total = calculate.multiply(item.quantity, item.price);
        });
        fieldsValue = {
          ...fieldsValue,
          items: newList,
        };
      }
    }
    dispatch(erp.create({ entity, jsonData: fieldsValue }));
  };

  return (
    <>
      <PageHeader
        onBack={() => {
          // createPanel.close();
          history.push(`/${entity.toLowerCase()}`);
        }}
        title={CREATE_ENTITY}
        ghost={false}
        tags={<Tag color="volcano">Draft</Tag>}
        // subTitle="This is create page"
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => history.push(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
          >
            Cancel
          </Button>,
          <SaveForm form={form} config={config} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit} onValuesChange={handelValuesChange}>
          <CreateForm subTotal={subTotal} offerTotal={offerSubTotal} />
        </Form>
      </Loading>
    </>
  );
}
