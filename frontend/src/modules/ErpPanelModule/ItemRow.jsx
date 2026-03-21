import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney, useDate } from '@/settings';
import calculate from '@/utils/calculate';
import useLanguage from '@/locale/useLanguage';

export default function ItemRow({ field, remove, current = null }) {
  const translate = useLanguage();
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
  }, [price, quantity]);

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" xs={24} sm={12} md={5}>
        <Form.Item
          name={[field.name, 'itemName']}
          label={translate('Item Name')} // Add label here
          rules={[
            {
              required: true,
              message: 'Missing itemName name',
            },
            {
              pattern: /^(?!\s*$)[\s\S]+$/,
              message: 'Item Name must contain alphanumeric or special characters',
            },
          ]}
        >
          <Input placeholder="Item Name" />
        </Form.Item>
      </Col>

      <Col className="gutter-row" xs={24} sm={12} md={7}>
        <Form.Item
          name={[field.name, 'description']}
          label={translate('Description')} // Add label here
        >
          <Input placeholder="Description" />
        </Form.Item>
      </Col>

      <Col className="gutter-row" xs={12} sm={6} md={3}>
        <Form.Item
          name={[field.name, 'quantity']}
          label={translate('Quantity')} // Add label here
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />
        </Form.Item>
      </Col>

      <Col className="gutter-row" xs={12} sm={6} md={4}>
        <Form.Item
          name={[field.name, 'price']}
          label={translate('Price')} // Add label here
          rules={[{ required: true }]}
        >
          <InputNumber
            className="moneyInput"
            onChange={updatePrice}
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        </Form.Item>
      </Col>

      <Col className="gutter-row" xs={24} sm={12} md={5}>
        <Form.Item
          name={[field.name, 'total']}
          label={translate('Total')} // Add label here
        >
          <InputNumber
            readOnly
            className="moneyInput"
            value={totalState}
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
            formatter={(value) =>
              money.amountFormatter({ amount: value, currency_code: money.currency_code })
            }
          />
        </Form.Item>
      </Col>

      <div style={{ position: 'absolute', right: '-10px', top: '3px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} 
        style={{
            fontSize: '18px',
            cursor: 'pointer',
        }}/>
      </div>
    </Row>

  );
}
