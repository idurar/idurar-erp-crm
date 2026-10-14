import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import QuoteDataTableModule from '@/modules/QuoteModule/QuoteDataTableModule';
import { useDate, useMoney } from '@/settings';
import quoteConfig from './config';

export default function Quote() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  const dataTableColumns = [
    { title: translate('Number'), dataIndex: 'number' },
    { title: translate('Client'), dataIndex: ['client', 'name'] },
    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date) => dayjs(date).format(dateFormat),
    },
    {
      title: translate('Expire Date'),
      dataIndex: 'expiredDate',
      render: (date) => dayjs(date).format(dateFormat),
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      render: (total, record) =>
        moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => (status ? translate(status) : status),
    },
  ];
  const config = {
    ...quoteConfig(translate),
    searchConfig: {
      entity: 'client',
      displayLabels: ['name'],
      searchFields: 'name',
    },
    deleteModalLabels: ['number', 'client.name'],
    dataTableColumns,
  };

  return <QuoteDataTableModule config={config} />;
}
