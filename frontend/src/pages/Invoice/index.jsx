import dayjs from 'dayjs';
import { Tag } from 'antd';
import useLanguage from '@/locale/useLanguage';

import { useMoney, useDate } from '@/settings';
import InvoiceDataTableModule from '@/modules/InvoiceModule/InvoiceDataTableModule';

export default function Invoice() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'invoice';
  const { moneyFormatter } = useMoney();

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['number', 'client.name'];
  const dataTableColumns = [
    {
      title: translate('Number'),
      dataIndex: 'number',
      render: (number, record) =>
        number ? `${number}/${record.year || ''}` : <Tag color="gold">Noch nicht vergeben</Tag>,
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: 'Fällig am',
      dataIndex: 'expiredDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => {
        return moneyFormatter({ amount: total, currency_code: record.currency });
      },
    },
    {
      title: 'Offener Betrag',
      key: 'outstanding',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (_, record) => moneyFormatter({
        amount: Math.max(
          0,
          Number(record.total || 0) +
            Number(record.dunningFees || 0) -
            Number(record.discount || 0) -
            Number(record.credit || 0)
        ),
        currency_code: record.currency,
      }),
    },
    {
      title: translate('Payment'),
      dataIndex: 'paymentStatus',
      filters: [
        { text: 'Offen', value: 'unpaid' },
        { text: 'Teilbezahlt', value: 'partially' },
        { text: 'Bezahlt', value: 'paid' },
      ],
      render: (status) => (status ? translate(status) : status),
    },
    {
      title: 'Dokumentstatus',
      key: 'documentStatus',
      width: 140,
      filters: [
        { text: 'Entwurf', value: 'draft' },
        { text: 'Veröffentlicht', value: 'issued' },
      ],
      render: (_, record) =>
        record.issuedAt ? (
          <Tag color="blue">Veröffentlicht</Tag>
        ) : (
          <Tag color="gold">Entwurf</Tag>
        ),
    },
    {
      title: 'Wiederholung',
      key: 'recurrenceStatus',
      width: 170,
      filters: [
        { text: 'Aktiv', value: 'active' },
        { text: 'Pausiert', value: 'paused' },
        { text: 'Einmalig', value: 'once' },
      ],
      render: (_, record) => {
        if (!record.recurring || record.recurring === 'none') return <Tag>Einmalig</Tag>;
        const labels = {
          weekly: 'Wöchentlich',
          monthly: 'Monatlich',
          quarterly: 'Vierteljährlich',
          annually: 'Jährlich',
        };
        if (record.recurringLastError) return <Tag color="red">Fehler – pausiert</Tag>;
        if (record.recurringActive && !record.issuedAt) {
          return <Tag color="gold">Startet nach Veröffentlichung</Tag>;
        }
        return (
          <Tag color={record.recurringActive ? '#168568' : '#C58A22'}>
            {record.recurringActive ? labels[record.recurring] : 'Pausiert'}
          </Tag>
        );
      },
    },
    {
      title: 'Mahnwesen',
      key: 'dunning',
      render: (_, record) => {
        if (record.paymentStatus === 'paid') return <Tag color="#12559B">Bezahlt</Tag>;
        if (record.reminderLevel) return <Tag color="red">Mahnstufe {record.reminderLevel}</Tag>;
        if (record.isOverdue) return <Tag color="orange">Überfällig</Tag>;
        return <Tag>Keine Mahnung</Tag>;
      },
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    ENTITY_NAME: translate('invoice'),
    EMPTY_TEXT: 'Noch keine Rechnungen vorhanden',

    RECORD_ENTITY: translate('record_payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <InvoiceDataTableModule config={config} />;
}
