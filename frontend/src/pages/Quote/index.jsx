// Quote/index.jsx
import dayjs from 'dayjs';
import { Tag, Card, Statistic, Row, Col, Tooltip, Badge } from 'antd';
import { 
  FileTextOutlined, 
  UserOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  PlusOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { tagColor } from '@/utils/statusTagColor';
import QuoteDataTableModule from '@/modules/QuoteModule/QuoteDataTableModule';
import { useMoney, useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';

export default function Quote() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'quote';
  const { moneyFormatter } = useMoney();

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name', 'email'],
    searchFields: 'name,email,number',
    filterOptions: [
      {
        label: translate('Status'),
        field: 'status',
        options: [
          { label: translate('Draft'), value: 'draft' },
          { label: translate('Sent'), value: 'sent' },
          { label: translate('Accepted'), value: 'accepted' },
          { label: translate('Expired'), value: 'expired' },
          { label: translate('Declined'), value: 'declined' }
        ]
      }
    ]
  };

  const deleteModalLabels = ['number', 'client.name'];

  // Enhanced status tag renderer
  const renderStatusTag = (status) => {
    const statusConfig = {
      draft: { color: 'default', icon: <FileTextOutlined /> },
      sent: { color: 'processing', icon: <ClockCircleOutlined /> },
      accepted: { color: 'success', icon: <CheckCircleOutlined /> },
      expired: { color: 'warning', icon: <ClockCircleOutlined /> },
      declined: { color: 'error', icon: <CloseCircleOutlined /> }
    };

    const config = statusConfig[status?.toLowerCase()] || { color: 'default', icon: <FileTextOutlined /> };
    
    return (
      <Tag 
        color={config.color} 
        icon={config.icon}
        style={{ 
          margin: 0, 
          fontWeight: 600,
          textTransform: 'capitalize',
          fontSize: '12px'
        }}
      >
        {status}
      </Tag>
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
          {translate('Expiry Date')}
        </div>
      ),
      dataIndex: 'expiredDate',
      render: (date, record) => {
        const isExpired = dayjs().isAfter(dayjs(date)) && record.status !== 'accepted';
        return (
          <div style={{ 
            textAlign: 'center',
            color: isExpired ? '#ff4d4f' : 'inherit'
          }}>
            <div style={{ 
              fontWeight: isExpired ? 600 : 500, 
              fontSize: '12px' 
            }}>
              {dayjs(date).format('DD MMM')}
            </div>
            <div style={{ fontSize: '11px', color: isExpired ? '#ff4d4f' : '#666' }}>
              {dayjs(date).format('YYYY')}
            </div>
            {isExpired && (
              <Tag color="red" style={{ fontSize: '10px', marginTop: 2 }}>
                Expired
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
          {translate('Sub Total')}
        </div>
      ),
      dataIndex: 'subTotal',
      render: (subTotal, record) => (
        <div style={{ 
          textAlign: 'right',
          fontWeight: 500,
          color: '#666'
        }}>
          {moneyFormatter({ amount: subTotal, currency_code: record.currency })}
        </div>
      ),
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
      title: translate('Status'),
      dataIndex: 'status',
      render: renderStatusTag,
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('proforma_invoice') || 'Proforma Invoice',
    DATATABLE_TITLE: translate('proforma_invoice_list') || 'Proforma Invoice List',
    ADD_NEW_ENTITY: translate('add_new_proforma_invoice') || 'Add New Proforma Invoice',
    ENTITY_NAME: translate('proforma_invoice') || 'Proforma Invoice',
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
    // Additional configuration
    enableBulkActions: true,
    enableExport: true,
    showQuickActions: true,
    pageSize: 10,
  };

  // Statistics Cards Component
  const StatisticsCards = () => (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Quotes"
              value={0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Draft"
              value={0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sent"
              value={0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Accepted"
              value={0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
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
              {translate('proforma_invoice_management') || 'Proforma Invoice Management'}
            </h1>
            <p style={{ 
              margin: '8px 0 0 0', 
              color: '#6b7280',
              fontSize: '16px'
            }}>
              {translate('manage_proforma_invoices') || 'Manage all your proforma invoices and quotes'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={styles.exportButton}>
              <ExportOutlined /> Export
            </button>
            <button style={styles.addButton}>
              <PlusOutlined /> {translate('add_new_proforma_invoice') || 'Add New Proforma Invoice'}
            </button>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <StatisticsCards />
      </div>

      {/* Quote Data Table Module */}
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <QuoteDataTableModule config={config} />
      </Card>
    </div>
  );
}

const styles = {
  addButton: {
    padding: '12px 20px',
    background: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s'
  },
  exportButton: {
    padding: '12px 20px',
    background: 'white',
    color: '#1890ff',
    border: '1px solid #1890ff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s'
  }
};