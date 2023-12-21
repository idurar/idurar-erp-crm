import { Form, InputNumber } from 'antd';
import { useMoney, useDate } from '@/settings';

export default function MoneyInputFormItem({ updatePrice, value = 0, readOnly = false }) {
  const money = useMoney();

  return (
    <Form.Item>
      <InputNumber
        readOnly={readOnly}
        className="moneyInput"
        onChange={updatePrice}
        precision={money.cent_precision ? money.cent_precision : 2}
        value={money.amountFormatter({ amount: value })}
        controls={false}
        addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
        addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
      />
    </Form.Item>
  );
}
