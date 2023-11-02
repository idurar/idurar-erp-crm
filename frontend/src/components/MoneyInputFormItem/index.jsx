import { Form, InputNumber } from 'antd';
import { useMoney } from '@/settings';

export default function MoneyInputFormItem({ updatePrice, value = 0, readOnly = false }) {
  const money = useMoney();

  return (
    <Form.Item>
      <InputNumber
        readOnly={readOnly}
        className="moneyInput"
        onChange={updatePrice}
        value={value}
        controls={false}
        addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
        addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
        formatter={(value) => money.amountFormatter({ amount: value })}
      />
    </Form.Item>
  );
}
