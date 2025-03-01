import { Form, InputNumber } from 'antd';
import { useMoney } from '@/settings';

export default function MoneyInputFormItem({ updatePrice, value = 0, readOnly = false }) {
  const { amountFormatter, currency_symbol, currency_position, cent_precision, currency_code } =
    useMoney();

  return (
    <Form.Item>
      <InputNumber
        readOnly={readOnly}
        className="moneyInput"
        onChange={updatePrice}
        precision={cent_precision ? cent_precision : 2}
        value={amountFormatter({ amount: value, currency_code: currency_code })}
        controls={false}
        addonAfter={currency_position === 'after' ? currency_symbol : undefined}
        addonBefore={currency_position === 'before' ? currency_symbol : undefined}
        formatter={(value) => amountFormatter({ amount: value, currency_code })}
      />
    </Form.Item>
  );
}
