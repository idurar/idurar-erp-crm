import { ErpLayout } from '@/layout';
import AdvancedCrudModule from '@/modules/AdvancedCrudModule';
import useLanguage from '@/locale/useLanguage';
import { CreditCardOutlined } from '@ant-design/icons';

export default function InvoiceDataTableModule({ config }) {
  const translate = useLanguage();
  return (
    <ErpLayout>
      <AdvancedCrudModule
        config={config}
        // extra={[
        //   {
        //     label: translate('Record Payment'),
        //     key: 'recordPayment',
        //     icon: <CreditCardOutlined />,
        //   },
        // ]}
      ></AdvancedCrudModule>
    </ErpLayout>
  );
}
