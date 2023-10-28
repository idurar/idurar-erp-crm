import React from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber } from 'antd';
import { DatePicker } from '@/components/CustomAntd';
import SelectAsync from '@/components/SelectAsync';
import { useMoney } from '@/settings';

import useLanguage from '@/lang/useLanguage';

export default function PaymentForm({ maxAmount = null, isUpdateForm = false }) {
  const getLang = useLanguage();
  const { TextArea } = Input;
  const money = useMoney();
  return (
    <>
      <Form.Item
        label={getLang('number')}
        name="number"
        initialValue={1}
        rules={[
          {
            required: true,
          },
        ]}
        style={{ width: '50%', float: 'left', paddingRight: '20px' }}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="date"
        label={getLang('date')}
        rules={[
          {
            required: true,
            type: 'object',
          },
        ]}
        initialValue={dayjs().add(30, 'days')}
        style={{ width: '50%' }}
      >
        <DatePicker format={'DD/MM/YYYY'} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label={getLang('amount')} name="amount" rules={[{ required: true }]}>
        <InputNumber
          className="moneyInput"
          min={0}
          controls={false}
          max={maxAmount}
          addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
          addonBefore={money.currency_position === 'before' ? money.currency_symbol : null}
        />
      </Form.Item>
      <Form.Item
        label={getLang('payment Mode')}
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
        ></SelectAsync>
      </Form.Item>
      <Form.Item label={getLang('Reference')} name="ref">
        <Input />
      </Form.Item>
      <Form.Item label={getLang('Description')} name="description">
        <TextArea />
      </Form.Item>
    </>
  );
}
