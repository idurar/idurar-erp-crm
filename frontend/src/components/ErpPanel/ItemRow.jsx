import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Space, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default function ItemRow({
  field,
  remove,

  current = null,
}) {
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

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
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={[field.name, 'itemName']}
          fieldKey={[field.fieldKey, 'itemName']}
          rules={[{ required: true, message: 'Missing itemName name' }]}
        >
          <Input placeholder="Item Name" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={8}>
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
          <InputNumber style={{ width: '100%' }} min={1} onChange={updateQt} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item
          name={[field.name, 'price']}
          fieldKey={[field.fieldKey, 'price']}
          rules={[{ required: true, message: 'Missing item price' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            onChange={updatePrice}
            min={0}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, 'total']}>
          <Form.Item noStyle>
            <InputNumber
              readOnly
              style={{ width: '100%' }}
              value={totalState}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
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
