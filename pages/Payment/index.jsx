import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import PaymentDataTableModule from '@/modules/PaymentModule/PaymentDataTableModule';
import { useMoney, useDate } from '@/settings';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function Payment() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  
  const searchConfig = {
    entity: 'client',
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const deleteModalLabels = ['number'];
  
  const dataTableColumns = [
    {
      title: translate('Number'),
      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Amount'),
      dataIndex: 'amount',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (amount, record) =>
        moneyFormatter({ amount: amount, currency_code: record.currency }),
    },
    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Number'),
      dataIndex: ['invoice', 'number'],
    },
    {
      title: translate('year'),
      dataIndex: ['invoice', 'year'],
    },
    {
      title: translate('Payment Mode'),
      dataIndex: ['paymentMode', 'name'],
    },
  ];

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: translate('payment'),
    DATATABLE_TITLE: translate('payment_list'),
    ADD_NEW_ENTITY: translate('add_new_payment'),
    ENTITY_NAME: translate('payment'),
  };

  // Custom header with upload button
  const CustomHeader = () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
      // In your Payment/index.jsx, update the create button:
      <Button 
  type="primary" 
  icon={<PlusOutlined />}
  onClick={() => navigate('/payment/create')} // Change this to use navigation
>
  {config.ADD_NEW_ENTITY}
</Button>
    </div>
  );

  const handleUploadClick = () => {
    // This will trigger the upload functionality
    // You might want to open a modal or navigate to upload page
    console.log('Upload button clicked');
    // For now, we'll add this to the config and handle it in the module
  };

  const configPage = {
    entity,
    ...Labels,
  };
  
  const config = {
    ...configPage,
    disableAdd: false, // Changed to false to enable adding payments
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
    customHeader: <CustomHeader />,
    enableUpload: true, // New flag to enable upload functionality
  };
  
  return <PaymentDataTableModule config={config} />;
}