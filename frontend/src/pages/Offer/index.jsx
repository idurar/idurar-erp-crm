import dayjs from 'dayjs';
import { Tag } from 'antd';

import OfferDataTableModule from '@/modules/OfferModule/OfferDataTableModule';
import { useMoney } from '@/settings';
import useLanguage from '@/lang/useLanguage';

export default function Offer() {
  const { moneyRowFormatter } = useMoney();

  const searchConfig = {
    displayLabels: ['company'],
    searchFields: 'company',
  };
  const entityDisplayLabels = ['number', 'lead.company'];
  const dataTableColumns = [
    {
      title: 'Number',
      dataIndex: 'number',
    },
    {
      title: 'Company Name',
      dataIndex: ['lead', 'company'],
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'SubTotal',
      dataIndex: 'subTotal',
      onCell: (subTotal) => moneyRowFormatter({ amount: subTotal }),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      onCell: (total) => moneyRowFormatter({ amount: total }),
    },

    {
      title: 'Note',
      dataIndex: 'note',
    },
    {
      title: 'Status',
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

  const getLang = useLanguage();

  const entity = 'offer';
  const Labels = {
    PANEL_TITLE: getLang('offer'),
    DATATABLE_TITLE: getLang('offer_list'),
    ADD_NEW_ENTITY: getLang('add_new_offer'),
    ENTITY_NAME: getLang('offer'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
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
  return <OfferDataTableModule config={config} />;
}
