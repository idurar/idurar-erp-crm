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
        addonAfter={money.currencyPosition === 'after' ? money.currencySymbol : undefined}
        addonBefore={money.currencyPosition === 'before' ? money.currencySymbol : undefined}
        formatter={(value) => money.amountFormatter({ amount: value })}
      />
    </Form.Item>
  );
}
