import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';

import { CreditCardOutlined } from '@ant-design/icons';

export default function InvoiceDataTableModule({ config }) {
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        extra={[
          {
            label: 'Record Payment',
            key: 'recordPayment',
            icon: <CreditCardOutlined />,
          },
        ]}
      ></ErpPanel>
    </ErpLayout>
  );
}
