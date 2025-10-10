import dayjs from 'dayjs';
import { Tag, Card, Statistic, Row, Col, Progress, Tooltip } from 'antd';
import { 
  DollarOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { tagColor } from '@/utils/statusTagColor';

import { useMoney, useDate } from '@/settings';
import InvoiceDataTableModule from '@/modules/InvoiceModule/InvoiceDataTableModule';
import { useState, useEffect } from 'react';

export default function Invoice() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'invoice';
  const { moneyFormatter } = useMoney();
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0
  });

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name', 'email'],
    searchFields: 'name,email,number',
    filterOptions: [
      {
        label: translate('Status'),
        field: 'status',
        options: [
          { label: translate('Paid'), value: 'paid' },
          { label: translate('Pending'), value: 'pending' },
          { label: translate('Overdue'), value: 'overdue' },
          { label: translate('Draft'), value: 'draft' }
        ]
      },
      {
        label: translate('Payment Status'),
        field: 'paymentStatus',
        options: [
          { label: translate('Paid'), value: 'paid' },
          { label: translate('Partial'), value: 'partial' },
          { label: translate('Unpaid'), value: 'unpaid' }
        ]
      }
    ]
  };

  const deleteModalLabels = ['number', 'client.name'];

  // Enhanced status tag renderer
  const renderStatusTag = (status) => {
    const statusConfig = {
      paid: { color: 'success', icon: <CheckCircleOutlined /> },
      pending: { color: 'processing', icon: <SyncOutlined spin /> },
      overdue: { color: 'error', icon: <CloseCircleOutlined /> },
      draft: { color: 'default', icon: <ClockCircleOutlined /> }
    };

    const config = statusConfig[status?.toLowerCase()] || { color: 'default', icon: null };
    
    return (
      <Tag 
        color={config.color} 
        icon={config.icon}
        style={{ 
          margin: 0, 
          fontWeight: 600,
          textTransform: 'capitalize'
        }}
      >
        {status}
      </Tag>
    );
  };

  // Enhanced payment status with progress
  const renderPaymentStatus = (paymentStatus, record) => {
    const paidPercentage = record.total > 0 ? (record.credit / record.total) * 100 : 0;
    
    const statusConfig = {
      paid: { color: '#52c41a', text: translate('Paid') },
      partial: { color: '#1890ff', text: translate('Partial') },
      unpaid: { color: '#ff4d4f', text: translate('Unpaid') }
    };

    const config = statusConfig[paymentStatus] || { color: '#d9d9d9', text: paymentStatus };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Progress 
          percent={Math.round(paidPercentage)} 
          size="small" 
          strokeColor={config.color}
          showInfo={false}
          style={{ margin: 0, flex: 1 }}
        />
        <Tag color={config.color} style={{ margin: 0, minWidth: 60, textAlign: 'center' }}>
          {config.text}
        </Tag>
      </div>
    );
  };

  const dataTableColumns = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined />
          {translate('Number')}
        </div>
      ),
      dataIndex: 'number',
      render: (number) => (
        <Tag color="blue" style={{ fontWeight: 600, fontSize: '12px' }}>
          #{number}
        </Tag>
      ),
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined />
          {translate('Client')}
        </div>
      ),
      dataIndex: ['client', 'name'],
      render: (name, record) => (
        <Tooltip title={record.client?.email}>
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Tooltip>
      ),
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarOutlined />
          {translate('Date')}
        </div>
      ),
      dataIndex: 'date',
      render: (date) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 500, fontSize: '12px' }}>
            {dayjs(date).format('DD MMM')}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {dayjs(date).format('YYYY')}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClockCircleOutlined />
          {translate('Due Date')}
        </div>
      ),
      dataIndex: 'expiredDate',
      render: (date, record) => {
        const isOverdue = dayjs().isAfter(dayjs(date)) && record.paymentStatus !== 'paid';
        return (
          <div style={{ 
            textAlign: 'center',
            color: isOverdue ? '#ff4d4f' : 'inherit'
          }}>
            <div style={{ 
              fontWeight: isOverdue ? 600 : 500, 
              fontSize: '12px' 
            }}>
              {dayjs(date).format('DD MMM')}
            </div>
            <div style={{ fontSize: '11px', color: isOverdue ? '#ff4d4f' : '#666' }}>
              {dayjs(date).format('YYYY')}
            </div>
            {isOverdue && (
              <Tag color="red" style={{ fontSize: '10px', marginTop: 2 }}>
                Overdue
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DollarOutlined />
          {translate('Total')}
        </div>
      ),
      dataIndex: 'total',
      render: (total, record) => (
        <div style={{ 
          textAlign: 'right',
          fontWeight: 600,
          color: '#1890ff'
        }}>
          {moneyFormatter({ amount: total, currency_code: record.currency })}
        </div>
      ),
    },
    {
      title: translate('Paid'),
      dataIndex: 'credit',
      render: (credit, record) => (
        <div style={{ 
          textAlign: 'right',
          fontWeight: 500,
          color: record.credit === record.total ? '#52c41a' : '#1890ff'
        }}>
          {moneyFormatter({ amount: credit, currency_code: record.currency })}
        </div>
      ),
    },
    {
      title: translate('Balance'),
      dataIndex: 'balance',
      render: (_, record) => {
        const balance = record.total - record.credit;
        return (
          <div style={{ 
            textAlign: 'right',
            fontWeight: 600,
            color: balance > 0 ? '#ff4d4f' : '#52c41a'
          }}>
            {moneyFormatter({ amount: balance, currency_code: record.currency })}
          </div>
        );
      },
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: renderStatusTag,
    },
    {
      title: translate('Payment'),
      dataIndex: 'paymentStatus',
      render: renderPaymentStatus,
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
    // Additional configuration for better UX
    enableBulkActions: true,
    enableExport: true,
    showQuickActions: true,
    pageSize: 15,
  };

  // Statistics Cards Component
  const StatisticsCards = () => (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Invoices"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Paid"
              value={stats.paid}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<SyncOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Overdue"
              value={stats.overdue}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16 
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '28px', 
              fontWeight: 700,
              color: '#1f2937'
            }}>
              {translate('invoice_management') || 'Invoice Management'}
            </h1>
            <p style={{ 
              margin: '8px 0 0 0', 
              color: '#6b7280',
              fontSize: '16px'
            }}>
              {translate('manage_invoices_and_payments') || 'Manage all your invoices and payment records'}
            </p>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <StatisticsCards />
      </div>

      {/* Invoice Data Table Module */}
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <InvoiceDataTableModule config={config} />
      </Card>
    </div>
  );
}