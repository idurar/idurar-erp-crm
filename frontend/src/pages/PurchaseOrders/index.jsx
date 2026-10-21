import CrudModule from '@/modules/CrudModule/CrudModule';
import PurchaseOrderForm from '@/forms/PurchaseOrderForm';
import { FilePdfOutlined, MailOutlined, WarningOutlined } from '@ant-design/icons';
import { Modal, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { request } from '@/request';
import { useDate, useMoney } from '@/settings';

const fields = {
  number: { type: 'string', label: 'Bestellnummer' },
  supplier: { type: 'string', label: 'Lieferant', dataIndex: ['supplier', 'name'] },
  commission: { type: 'string', label: 'Kommission' },
  orderDate: { type: 'date', label: 'Bestelldatum' },
  expectedDate: { type: 'date', label: 'Liefertermin' },
  netTotal: { type: 'currency', label: 'Netto' },
  grossTotal: { type: 'currency', label: 'Brutto' },
};
export default function PurchaseOrders() {
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  const dataTableColumns = [
    { title: 'Bestellnummer', dataIndex: 'number' },
    { title: 'Lieferant', dataIndex: ['supplier', 'name'] },
    { title: 'Kommission', dataIndex: 'commission' },
    { title: 'Bestelldatum', dataIndex: 'orderDate', render: (value) => dayjs(value).format(dateFormat) },
    {
      title: 'Lieferstatus',
      key: 'deliverySummary',
      width: 360,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          {(record.deliverySummary?.lines || []).map((line) => (
            <div key={line.purchaseOrderLineId}>
              <Typography.Text strong>{[line.articleNumber, line.description].filter(Boolean).join(' · ')}</Typography.Text>
              <br />
              <Space size={4} wrap>
                <Tag color="#12559B">Geliefert: {line.received} {line.unit}</Tag>
                {line.open > 0
                  ? <Tag color="#C58A22">Offen: {line.open} {line.unit}</Tag>
                  : <Tag color="#12559B">Vollständig</Tag>}
              </Space>
            </div>
          ))}
        </Space>
      ),
    },
    { title: 'Netto', dataIndex: 'netTotal', align: 'right', render: (value, record) => moneyFormatter({ amount: value, currency_code: record.currency }) },
    { title: 'Brutto', dataIndex: 'grossTotal', align: 'right', render: (value, record) => moneyFormatter({ amount: value, currency_code: record.currency }) },
  ];
  const config = {
    entity: 'purchaseorder',
    fields,
    dataTableColumns,
    PANEL_TITLE: 'Einkauf & Bestellungen',
    DATATABLE_TITLE: 'Bestellungen',
    ADD_NEW_ENTITY: 'Bestellung anlegen',
    ENTITY_NAME: 'Bestellung',
    searchConfig: { displayLabels: ['number'], searchFields: 'number,reference' },
    deleteModalLabels: ['number'],
    tableExtra: [
      {
        key: 'downloadPdf',
        label: 'PDF herunterladen',
        icon: <FilePdfOutlined />,
        onClick: (record) => request.download({
          path: `download/purchaseorder/purchaseorder-${record._id}.pdf`,
          filename: `Bestellung-${record.number}.pdf`,
        }),
      },
      {
        key: 'sendMail',
        label: 'Per E-Mail an Lieferanten',
        icon: <MailOutlined />,
        onClick: (record) => request.mail({
          entity: 'purchaseorder',
          jsonData: { id: record._id },
        }),
      },
      {
        key: 'missingDelivery',
        label: 'Fehlende Lieferung reklamieren',
        icon: <WarningOutlined />,
        hidden: (record) => record.status !== 'partially_received',
        onClick: (record) => Modal.confirm({
          title: 'Fehlende Lieferung per E-Mail reklamieren?',
          content: `Der Lieferant ${record.supplier?.name || ''} erhält eine Liste aller noch offenen Positionen der Bestellung ${record.number}.`,
          okText: 'E-Mail senden',
          cancelText: 'Abbrechen',
          onOk: async () => {
            const response = await request.post({
              entity: `purchaseorder/missing-delivery/${record._id}`,
              jsonData: {},
            });
            if (response?.success) Modal.success({ title: 'E-Mail wurde versendet' });
          },
        }),
      },
    ],
  };
  return <CrudModule createForm={<PurchaseOrderForm />} updateForm={<PurchaseOrderForm />} config={config} />;
}
