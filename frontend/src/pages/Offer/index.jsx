import dayjs from 'dayjs';
import { Tag } from 'antd';

import OfferDataTableModule from '@/modules/OfferModule/OfferDataTableModule';
import { useMoney } from '@/settings';
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

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
      render: (_, record) => formatDate(record.date),
    },
    {
      title: 'SubTotal',
      dataIndex: 'subTotal',
      onCell: (record, rowIndex) => moneyRowFormatter({ amount: record.subTotal }),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      onCell: (record, rowIndex) => moneyRowFormatter({ amount: record.total }),
    },

    {
      title: 'Note',
      dataIndex: 'note',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => {
        let color =
          record?.status === 'draft'
            ? 'cyan'
            : record?.status === 'sent'
            ? 'blue'
            : record?.status === 'accepted'
            ? 'green'
            : record?.status === 'expired'
            ? 'orange'
            : 'red';
        return <Tag color={color}>{record?.status && record?.status.toUpperCase()}</Tag>;
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
