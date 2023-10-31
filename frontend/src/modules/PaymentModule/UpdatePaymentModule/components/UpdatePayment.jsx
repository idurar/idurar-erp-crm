import { useState, useEffect } from 'react';
import { Form, Button } from 'antd';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectUpdatedItem } from '@/redux/erp/selectors';

import useLanguage from '@/locale/useLanguage';

import Loading from '@/components/Loading';

import calculate from '@/utils/calculate';
import PaymentForm from '@/forms/PaymentForm';
export default function UpdatePayment({ config, currentInvoice }) {
  const translate = useLanguage();
  let { entity } = config;
  const dispatch = useDispatch();

  const { isLoading, isSuccess } = useSelector(selectUpdatedItem);

  const [form] = Form.useForm();

  const [maxAmount, setMaxAmount] = useState(0);

  useEffect(() => {
    if (currentInvoice) {
      const { credit, total, discount, amount } = currentInvoice;

      setMaxAmount(
        calculate.sub(calculate.sub(total, discount), calculate.sub(calculate.sub(credit, amount)))
      );
      if (currentInvoice.date) {
        currentInvoice.date = dayjs(currentInvoice.date);
      }
      form.setFieldsValue(currentInvoice);
    }
  }, [currentInvoice]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'recordPayment' }));
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
      erp.update({
        entity,
        id: currentInvoice._id,
        jsonData: fieldsValue,
      })
    );
  };

  return (
    <>
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <PaymentForm maxAmount={maxAmount} />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {translate('Update')}
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </>
  );
}
