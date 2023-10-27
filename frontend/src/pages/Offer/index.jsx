import dayjs from 'dayjs';
import { Tag } from 'antd';

import OfferDataTableModule from '@/modules/OfferModule/OfferDataTableModule';
import { useMoney } from '@/settings';
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';

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
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'SubTotal',
      dataIndex: 'subTotal',
      render: (amount) => moneyRowFormatter({ amount }),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (amount) => moneyRowFormatter({ amount }),
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

  const lang = useSelector(selectCurrentLang);

  const entity = 'offer';
  const Labels = {
    PANEL_TITLE: lang.offer,
    DATATABLE_TITLE: lang.offer_list,
    ADD_NEW_ENTITY: lang.add_new_offer,
    ENTITY_NAME: lang.offer,
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
  return <OfferDataTableModule config={config} />;
}
