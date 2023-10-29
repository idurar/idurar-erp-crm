import dayjs from 'dayjs';
import { Tag } from 'antd';

import OfferDataTableModule from '@/modules/OfferModule/OfferDataTableModule';
import { useMoney } from '@/settings';
import useLanguage from '@/lang/useLanguage';

export default function Offer() {
  const translate = useLanguage();
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
      title: translate('Total'),
      dataIndex: 'total',
      onCell: (total) => moneyRowFormatter({ amount: total }),
    },

    {
      title: 'Note',
      dataIndex: 'note',
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

  const entity = 'offer';
  const Labels = {
    PANEL_TITLE: translate('offer'),
    DATATABLE_TITLE: translate('offer_list'),
    ADD_NEW_ENTITY: translate('add_new_offer'),
    ENTITY_NAME: translate('offer'),
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
  return <OfferDataTableModule config={config} />;
}
