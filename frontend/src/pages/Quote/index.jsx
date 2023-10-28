import dayjs from 'dayjs';
import { Tag } from 'antd';

import QuoteDataTableModule from '@/modules/QuoteModule/QuoteDataTableModule';
import { useMoney } from '@/settings';
import useLanguage from '@/lang/useLanguage';

export default function Quote() {
  const entity = 'quote';
  const { moneyRowFormatter } = useMoney();

  const searchConfig = {
    displayLabels: ['name', 'surname'],
    searchFields: 'name,surname,birthday',
  };
  const entityDisplayLabels = ['number', 'client.company'];
  const dataTableColumns = [
    {
      title: 'Number',
      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Due date',
      dataIndex: 'expiredDate',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'SubTotal',
      dataIndex: 'subTotal',
      onCell: (subTotal) => moneyRowFormatter({ amount: subTotal }),
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: (total) => moneyRowFormatter({ amount: total }),
    },

    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => {
        let color =
          status === 'draft'
            ? 'cyan'
            : status === 'sent'
            ? 'blue'
            : status === 'accepted'
            ? 'green'
            : status === 'expired'
            ? 'orange'
            : 'red';
        return <Tag color={color}>{status && status.toUpperCase()}</Tag>;
      },
    },
  ];

  const translate = useLanguage();

  const Labels = {
    PANEL_TITLE: translate('quote'),
    DATATABLE_TITLE: translate('quote_list'),
    ADD_NEW_ENTITY: translate('add_new_quote'),
    ENTITY_NAME: translate('quote'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
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
  return <QuoteDataTableModule config={config} />;
}
