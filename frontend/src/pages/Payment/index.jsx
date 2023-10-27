import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
import PaymentDataTableModule from '@/modules/PaymentModule/PaymentDataTableModule';

export default function Payment() {
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

  const lang = useSelector(selectCurrentLang);

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: lang.payment,
    DATATABLE_TITLE: lang.payment_list,
    ADD_NEW_ENTITY: lang.add_new_payment,
    ENTITY_NAME: lang.payment,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <PaymentDataTableModule config={config} />;
}
