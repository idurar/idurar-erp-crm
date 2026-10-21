import dayjs from 'dayjs';
import { Button, Form, Input, InputNumber, Space } from 'antd';
import { DatePicker } from 'antd';
import SelectAsync from '@/components/SelectAsync';
import { useMoney, useDate } from '@/settings';

import useLanguage from '@/locale/useLanguage';

export default function PaymentForm({ maxAmount = null, isUpdateForm = false }) {
  const translate = useLanguage();
  const { TextArea } = Input;
  const money = useMoney();
  const { dateFormat } = useDate();
  const form = Form.useFormInstance();

  const applyDepositPercentage = (percentage) => {
    if (maxAmount === null || maxAmount === undefined || percentage === null) return;
    const amount = Math.round(((maxAmount * percentage) / 100 + Number.EPSILON) * 100) / 100;
    form.setFieldValue('amount', amount);
  };
  return (
    <>
      {isUpdateForm && (
        <Form.Item label={translate('number')} name="number">
          <InputNumber disabled style={{ width: '100%' }} />
        </Form.Item>
      )}
      <Form.Item
        name="date"
        label={translate('date')}
        rules={[
          {
            required: true,
            type: 'object',
          },
        ]}
        initialValue={dayjs()}
        style={{ width: '100%' }}
      >
        <DatePicker format={dateFormat} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label={translate('amount')} name="amount" rules={[{ required: true }]}>
        <InputNumber
          className="moneyInput"
          min={0}
          controls={false}
          max={maxAmount}
          addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
          addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
        />
      </Form.Item>
      {!isUpdateForm && maxAmount !== null && (
        <Space.Compact block style={{ marginTop: -12, marginBottom: 20 }}>
          <Form.Item name="depositPercentage" noStyle>
            <InputNumber
              min={0}
              max={100}
              suffix="%"
              placeholder={translate('deposit_percentage')}
              onChange={applyDepositPercentage}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Button onClick={() => form.setFieldValue('amount', maxAmount)}>
            {translate('use_remaining_amount')}
          </Button>
        </Space.Compact>
      )}
      <Form.Item
        label={translate('payment Mode')}
        name="paymentMode"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <SelectAsync
          entity={'paymentMode'}
          displayLabels={['name']}
          withRedirect={true}
          urlToRedirect="/payment/mode"
          redirectLabel="Add Payment Mode"
          requestOptions={{ filter: 'enabled', equal: true, items: 20 }}
        ></SelectAsync>
      </Form.Item>
      <Form.Item label={translate('Reference')} name="ref">
        <Input />
      </Form.Item>
      <Form.Item label={translate('Description')} name="description">
        <TextArea />
      </Form.Item>
    </>
  );
}
