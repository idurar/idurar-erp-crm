import { useState, useEffect } from 'react';

import { Alert, Button, Tag, Form, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';

import useLanguage from '@/locale/useLanguage';

import { settingsAction } from '@/redux/settings/actions';
import { erp } from '@/redux/erp/actions';
import { selectCreatedItem } from '@/redux/erp/selectors';

import calculate from '@/utils/calculate';
import dayjs from 'dayjs';

import Loading from '@/components/Loading';
import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { request } from '@/request';

function SaveForm({ form, label, disabled = false }) {
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button disabled={disabled} onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {label}
    </Button>
  );
}

export default function CreateItem({ config, CreateForm }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { entity } = config;
  const [searchParams] = useSearchParams();
  const sourceInvoiceId = entity === 'invoice' ? searchParams.get('from') : null;

  useEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, [dispatch]);
  const { isLoading, isSuccess, result } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [offerSubTotal, setOfferSubTotal] = useState(0);
  const [template, setTemplate] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(Boolean(sourceInvoiceId));
  const [templateError, setTemplateError] = useState('');

  useEffect(() => {
    if (!sourceInvoiceId) return;
    let active = true;
    const loadTemplate = async () => {
      try {
        const response = await request.read({ entity: 'invoice', id: sourceInvoiceId });
        if (!active) return;
        if (!response?.success || !response.result) {
          setTemplateError('Die Rechnungsvorlage konnte nicht geladen werden.');
          return;
        }
        const source = response.result;
        const invoiceDate = dayjs();
        const paymentTermDays = Math.max(
          0,
          dayjs(source.expiredDate).diff(dayjs(source.date), 'day')
        );
        const values = {
          client: source.client,
          clientVatNumber: source.clientVatNumber,
          date: invoiceDate,
          year: invoiceDate.year(),
          serviceDate: invoiceDate,
          expiredDate: invoiceDate.add(paymentTermDays || 14, 'day'),
          items: source.items?.map(
            ({ article, itemName, description, unit, discount, quantity, price }) => ({
              article,
              itemName,
              description,
              unit,
              discount,
              quantity,
              price,
            })
          ),
          taxRate: source.taxRate,
          notes: source.notes,
          paymentTermsText: source.paymentTermsText,
          footerText: source.footerText,
          recurring: 'none',
          recurringActive: false,
        };
        setTemplate(values);
        form.setFieldsValue(values);
        setSubTotal(Number(source.subTotal || 0));
      } catch {
        if (active) setTemplateError('Die Rechnungsvorlage konnte nicht geladen werden.');
      } finally {
        if (active) setTemplateLoading(false);
      }
    };
    loadTemplate();
    return () => {
      active = false;
    };
  }, [form, sourceInvoiceId]);
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
            let total = calculate.multiply(
              calculate.multiply(item['quantity'], calculate.round(item['price'])),
              1 - (Number(item.discount) || 0) / 100
            );
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
      navigate(`/${entity.toLowerCase()}/read/${result._id}`);
    }
    return () => {};
  }, [dispatch, entity, form, isSuccess, navigate, result?._id]);

  const onSubmit = (fieldsValue) => {
    if (entity === 'invoice' && fieldsValue.date?.year) {
      fieldsValue.year = fieldsValue.date.year();
    }
    if (fieldsValue) {
      if (fieldsValue.items) {
        let newList = [...fieldsValue.items];
        newList.map((item) => {
          item.total = calculate.multiply(
            calculate.multiply(item.quantity, calculate.round(item.price)),
            1 - (Number(item.discount) || 0) / 100
          );
          item.price = calculate.round(item.price);
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
    <Form form={form} layout="vertical" onFinish={onSubmit} onValuesChange={handelValuesChange}>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        backIcon={<ArrowLeftOutlined />}
        title={
          entity === 'invoice'
              ? sourceInvoiceId
                ? 'Neue Rechnung aus Vorlage'
                : 'Neue Rechnung'
            : entity === 'quote'
              ? 'Neues Angebot'
              : `${translate('New')} ${config.ENTITY_NAME}`
        }
        ghost={false}
        tags={<Tag>{translate('Draft')}</Tag>}
        // subTitle="This is create page"
        extra={[
          <Button
            key="cancel"
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
          >
            {translate('Cancel')}
          </Button>,
          <SaveForm
            form={form}
            label={entity === 'invoice' ? 'Als Entwurf speichern' : translate('Save')}
            disabled={templateLoading || Boolean(templateError)}
            key="save"
          />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      {templateError && <Alert type="error" showIcon message={templateError} />}
      <Loading isLoading={isLoading || templateLoading}>
        <CreateForm subTotal={subTotal} offerTotal={offerSubTotal} current={template} />
      </Loading>
    </Form>
  );
}
