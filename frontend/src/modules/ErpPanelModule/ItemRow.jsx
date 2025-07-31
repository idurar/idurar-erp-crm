import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney, useDate } from '@/settings';
import calculate from '@/utils/calculate';

export default function ItemRow({ field, remove, current = null }) {
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const money = useMoney();
  
  // Get form instance to update total field
  const form = Form.useFormInstance();
  
  const updateQt = (value) => {
    setQuantity(value || 0);
  };
  
  const updatePrice = (value) => {
    setPrice(value || 0);
  };

  useEffect(() => {
    if (current) {
      // When it accesses the /payment/ endpoint,
      // it receives an invoice.item instead of just item
      // and breaks the code, but now we can check if items exists,
      // and if it doesn't we can access invoice.items.

      const { items, invoice } = current;

      if (invoice) {
        const item = invoice[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      } else {
        const item = items[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      }
    }
  }, [current]);

  useEffect(() => {
    const currentTotal = calculate.multiply(price, quantity);
    setTotal(currentTotal);
    
    // IMPORTANT: Update the form field value for total
    if (form) {
      form.setFieldValue(['items', field.name, 'total'], currentTotal);
    }
  }, [price, quantity, form, field.name]);

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'itemName']}
          rules={[
            {
              required: true,
              message: 'Missing itemName name',
            },
            {
              pattern: /^(?!\s*$)[\s\S]+$/, // Regular expression to allow spaces, alphanumeric, and special characters, but not just spaces
              message: 'Item Name must contain alphanumeric or special characters',
            },
          ]}
        >
          <Input placeholder="Item Name" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={7}>
        <Form.Item name={[field.name, 'description']}>
          <Input placeholder="Description" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item 
          name={[field.name, 'quantity']} 
          rules={[
            { 
              required: true,
              message: 'Quantity is required'
            }
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            min={0} 
            onChange={updateQt}
            placeholder="0"
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item 
          name={[field.name, 'price']} 
          rules={[
            { 
              required: true,
              message: 'Price is required'
            }
          ]}
        >
          <InputNumber
            className="moneyInput"
            onChange={updatePrice}
            min={0}
            controls={false}
            placeholder="0.00"
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        {/* FIXED: Remove nested Form.Item and properly bind total field */}
        <Form.Item 
          name={[field.name, 'total']}
          rules={[
            { 
              required: true,
              message: 'Total is required'
            }
          ]}
        >
          <InputNumber
            readOnly
            className="moneyInput"
            value={totalState}
            min={0}
            controls={false}
            placeholder="0.00"
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
            formatter={(value) =>
              money.amountFormatter({ amount: value, currency_code: money.currency_code })
            }
          />
        </Form.Item>
      </Col>

      <div style={{ position: 'absolute', right: '-20px', top: ' 5px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
    </Row>
  );
}