import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';

export default function ItemRow({
  field,
  remove,

  current = null,
}) {
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const money = useMoney();
  const updateQt = (value) => {
    setQuantity(value);
  };
  const updatePrice = (value) => {
    setPrice(value);
  };

  useEffect(() => {
    if (current) {
      const { items } = current;
      const item = items[field.fieldKey];
      if (item) {
        setQuantity(item.quantity);
        setPrice(item.price);
      }
    }
  }, [current]);

  useEffect(() => {
    const currentTotal = price * quantity;

    setTotal(currentTotal.toFixed(2));
  }, [price, quantity]);

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'itemName']}
          fieldKey={[field.fieldKey, 'itemName']}
          rules={[{ required: true, message: 'Missing itemName name' }]}
        >
          <Input placeholder="Item Name" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={7}>
        <Form.Item name={[field.name, 'description']} fieldKey={[field.fieldKey, 'description']}>
          <Input placeholder="description Name" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item
          name={[field.name, 'quantity']}
          fieldKey={[field.fieldKey, 'quantity']}
          rules={[{ required: true, message: 'Missing item quantity' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'price']}
          fieldKey={[field.fieldKey, 'price']}
          rules={[{ required: true, message: 'Missing item price' }]}
        >
          <InputNumber
            className="moneyInput"
            onChange={updatePrice}
            min={0}
            controls={false}
            addonAfter={money.currencyPosition === 'after' ? money.currencySymbol : undefined}
            addonBefore={money.currencyPosition === 'before' ? money.currencySymbol : undefined}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, 'total']}>
          <Form.Item>
            <InputNumber
              readOnly
              className="moneyInput"
              value={totalState}
              min={0}
              controls={false}
              addonAfter={money.currencyPosition === 'after' ? money.currencySymbol : undefined}
              addonBefore={money.currencyPosition === 'before' ? money.currencySymbol : undefined}
              formatter={(value) => money.amountFormatter({ amount: value })}
            />
          </Form.Item>
        </Form.Item>
      </Col>

      <div style={{ position: 'absolute', right: '-20px', top: ' 5px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
    </Row>
  );
}
