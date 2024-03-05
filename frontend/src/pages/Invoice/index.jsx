import { useDate, useMoney } from '@/settings';

import InvoiceDataTableModule from '@/modules/InvoiceModule/InvoiceDataTableModule';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { tagColor } from '@/utils/statusTagColor';
import useLanguage from '@/locale/useLanguage';

export default function Invoice() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'invoice';
  const { moneyFormatter } = useMoney();

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name,total',
  };
  const deleteModalLabels = ['number', 'client.name'];

  const dataTableColumns = [
    {
      title: translate('Inv.No.'),
      dataIndex: 'number',
      render: (invNo) => {
        var invNo = invNo.toString();
        console.log('invNo', invNo);
        if (invNo.includes('INV-')) {
          return <span>{invNo}</span>;
        } else {
          // Get the current date and time
          var prefix = 'INV-';
          var now = new Date();
          // Extract date components
          var year = now.getFullYear().toString().slice(-2); // Get last 2 digits of the year
          var month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
          var day = now.getDate().toString().padStart(2, '0');

          // Generate a random number (optional)
          var randomNumber = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0'); // 3-digit random number

          // Combine components to form the invoice number
          var invoiceNumber = prefix + year + month + day + randomNumber;
          return <span>{invoiceNumber}</span>;
        }
      },
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
      title: translate('Due Date'),
      dataIndex: 'expiredDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Discount'),
      dataIndex: 'discount',
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
      title: translate('paid'),
      dataIndex: 'credit',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => {
        let tagStatus = tagColor(status);

        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {status && translate(tagStatus.label)}
          </Tag>
        );
      },
    },
    {
      title: translate('Document Type'),
      dataIndex: 'documentType',
      render: (documentType) => {
        let tagStatus = tagColor(documentType);

        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {documentType && translate(tagStatus.label)}
          </Tag>
        );
      },
    },
    {
      title: translate('Payment'),
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => {
        let tagStatus = tagColor(paymentStatus);

        return (
          <Tag color={tagStatus.color}>
            {/* {tagStatus.icon + ' '} */}
            {paymentStatus && translate(paymentStatus)}
          </Tag>
        );
      },
    },
    {
      title: translate('Created By'),
      dataIndex: ['createdBy', 'name'],
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    ENTITY_NAME: translate('invoice'),

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
