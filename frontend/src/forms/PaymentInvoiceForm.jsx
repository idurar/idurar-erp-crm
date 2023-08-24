import React from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber } from 'antd';
import { DatePicker } from '@/components/CustomAntd';
import SelectAsync from '@/components/SelectAsync';
import { useMoney } from '@/settings';
export default function PaymentInvoiceForm({ maxAmount = null, isUpdateForm = false }) {
  const { TextArea } = Input;
  const money = useMoney();
  return (
    <>
      <Form.Item
        label="Number"
        name="number"
        initialValue={1}
        rules={[
          {
            required: true,
          },
        ]}
        style={{ width: '50%', float: 'left', paddingRight: '20px' }}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="date"
        label="Date"
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
      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: 'Amount is required' }]}
      >
        {/* <InputNumber
          className="moneyInput"
          min={0}
          max={maxAmount}
          controls={false}
          addonAfter={money.currencyPosition === 'after' ? money.currencySymbol : undefined}
          addonBefore={money.currencyPosition === 'before' ? money.currencySymbol : undefined}
        /> */}
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={maxAmount}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        />
      </Form.Item>
      <Form.Item
        label="Payment Mode"
        name="paymentMode"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <SelectAsync entity={'paymentMode'} displayLabels={['name']}></SelectAsync>
      </Form.Item>
      <Form.Item label="Reference" name="ref">
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>
    </>
  );
}
