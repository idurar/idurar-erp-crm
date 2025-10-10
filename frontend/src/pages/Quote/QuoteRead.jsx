// Quote/QuoteRead.jsx
import useLanguage from '@/locale/useLanguage';
import ReadQuoteModule from '@/modules/QuoteModule/ReadQuoteModule';
import { Card } from 'antd';
import { FileTextOutlined, EyeOutlined } from '@ant-design/icons';

export default function QuoteRead() {
  const translate = useLanguage();
  const entity = 'quote';

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

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '28px', 
          fontWeight: 700,
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <EyeOutlined />
          {translate('view_proforma_invoice') || 'View Proforma Invoice'}
        </h1>
        <p style={{ 
          margin: '8px 0 0 0', 
          color: '#6b7280',
          fontSize: '16px'
        }}>
          {translate('view_proforma_invoice_description') || 'View proforma invoice details and information'}
        </p>
      </div>
      
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
      >
        <ReadQuoteModule config={configPage} />
      </Card>
    </div>
  );
}