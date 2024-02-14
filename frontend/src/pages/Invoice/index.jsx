import dayjs from 'dayjs';
import { Tag } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { tagColor } from '@/utils/statusTagColor';

import { useMoney, useDate } from '@/settings';
import InvoiceDataTableModule from '@/modules/InvoiceModule/InvoiceDataTableModule';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { erp } from '@/redux/erp/actions';
import { useDispatch } from 'react-redux';

export default function Invoice() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'invoice';
  const { moneyFormatter } = useMoney();
  const [sortDirectionName, setSortDirectionName] = useState('asc');
  const [sortDirectionTotal, setSortDirectionTotal] = useState('asc');

  const [sortDirectionNumber, setSortDirectionNumber] = useState('asc');

  const dispatch = useDispatch()

  //function to handle 
  const handleSortByNumber = () => {
    setSortDirectionNumber(sortDirectionNumber === 'asc' ? 'desc' : 'asc');
    dispatch(erp.sort({ entity, sortBy: { field: 'number', direction: sortDirectionNumber } }));
  };
  const handleSortByClient = () => {
    setSortDirectionName(sortDirectionName === 'asc' ? 'desc' : 'asc');
    dispatch(erp.sort({ entity, sortBy: { field: 'client.name', direction: sortDirectionName } }));

  };
  const handleSortByTotal = () => {
    setSortDirectionTotal(sortDirectionTotal === 'asc' ? 'desc' : 'asc');
    dispatch(erp.sort({ entity, sortBy: { field: 'total', direction: sortDirectionTotal } }));
  };




  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['number', 'client.name'];
  const dataTableColumns = [
    {
      title: <div style={{ display: "flex" }}><span style={{ paddingRight: 10 }}>{translate('Number')}</span>
        {
          sortDirectionNumber === "asc" ? <SortAscendingOutlined style={{ cursor: "pointer" }} onClick={() => {
            handleSortByNumber()
          }} /> : <SortDescendingOutlined style={{ cursor: "pointer" }} onClick={() => {
            handleSortByNumber()
          }} />

        }
      </div>,
      dataIndex: 'number',
    },
    {
      title: <div style={{ display: "flex" }}><span style={{ paddingRight: 10 }}>{translate('Client')}</span>
        {
          sortDirectionName === "asc" ? <SortAscendingOutlined style={{ cursor: "pointer" }} onClick={() => {
            handleSortByClient()
          }} /> : <SortDescendingOutlined style={{ cursor: "pointer" }} onClick={() => {
            handleSortByClient()
          }} />

        }
      </div>,
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
      title: translate('expired Date'),
      dataIndex: 'expiredDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: <div style={{ display: "flex" }}><span style={{ paddingRight: 10 }}>{translate('Total')}</span>
        {
          sortDirectionTotal === "asc" ? <SortAscendingOutlined style={{ cursor: "pointer" }} onClick={() => {
            handleSortByTotal()
          }} /> : <SortDescendingOutlined style={{ cursor: "pointer" }} onClick={() => {
            handleSortByTotal()
          }} />

        }
      </div>,
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
          },
        };
      },
      render: (total) => moneyFormatter({ amount: total }),
    },
    {
      title: translate('credit'),
      dataIndex: 'credit',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
          },
        };
      },
      render: (credit) => moneyFormatter({ amount: credit }),
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
