import dayjs from 'dayjs';
import configPage from './config';
import PaymentInvoiceDataTableModule from '@/modules/PaymentInvoiceModule/PaymentInvoiceDataTableModule';

export default function PaymentInvoice() {
  const searchConfig = {
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['number'];
  const dataTableColumns = [
    {
      title: 'Number',

      dataIndex: 'number',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Invoice Number',
      dataIndex: ['invoice', 'number'],
    },
    {
      title: 'Invoice year',
      dataIndex: ['invoice', 'year'],
    },
    {
      title: 'Payment Mode',
      dataIndex: ['paymentMode', 'name'],
    },
  ];

  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <PaymentInvoiceDataTableModule config={config} />;
}
