import { useState, useEffect } from 'react';

import { Button, Tag, Form, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';

import useLanguage from '@/locale/useLanguage';

import { settingsAction } from '@/redux/settings/actions';
import { erp } from '@/redux/erp/actions';
import { selectCreatedItem, selectInvoiceFollowNumItems } from '@/redux/erp/selectors';
import calculate from '@/utils/calculate';
import { generate as uniqueId } from 'shortid';

import Loading from '@/components/Loading';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import invoiceFollowNum from '@/utils/invoiceFollowNum';

import { useNavigate } from 'react-router-dom';

function SaveForm({ form }) {
  const translate = useLanguage();
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {translate('Save')}
    </Button>
  );
}

export default function CreateItem({ config, CreateForm }) {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const { isLoading, isSuccess, result } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [offerSubTotal, setOfferSubTotal] = useState(0);
  const { result: invoiceData } = useSelector(selectInvoiceFollowNumItems);
  const invoiceDate = invoiceData?.date;

  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (invoiceDate) {
      setInvoiceNumber(invoiceDate);
    }

    // Use setFieldsValue to dynamically update the number field
    form.setFieldsValue({
      number: invoiceNumber,
    });
  }, [invoiceDate, invoiceNumber]);

  useEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  let { entity } = config;

  const handelValuesChange = (changedValues, values) => {
    const items = values['items'];
    let subTotal = 0;
    let subOfferTotal = 0;

    if (items) {
      items.map((item) => {
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
    let isMounted = true; // Initialize a flag to track component mounting

    const fetchData = async () => {
      try {
        const { formattedInvoices } = await invoiceFollowNum();

        if (isMounted) {
          dispatch(erp.invoiceFollowNum({ date: formattedInvoices }));
        }
      } catch (error) {
        // Handle any errors here
      }
    };

    fetchData();

    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'create' }));
      setSubTotal(0);
      setOfferSubTotal(0);
      navigate(`/${entity.toLowerCase()}/read/${result._id}`);
    }
    return () => {
      isMounted = false;
    };
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    fieldsValue['number'] = invoiceDate == undefined ? `${year + month}/1001` : invoiceDate;

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
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={translate('New')}
        ghost={false}
        tags={<Tag color="gray">Draft</Tag>}
        // subTitle="This is create page"
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
          >
            {translate('Cancel')}
          </Button>,
          <SaveForm form={form} key={`${uniqueId()}`} />,
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
