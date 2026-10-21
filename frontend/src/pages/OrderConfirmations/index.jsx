import CrudModule from '@/modules/CrudModule/CrudModule';
import OrderConfirmationForm from '@/forms/OrderConfirmationForm';
import { FilePdfOutlined } from '@ant-design/icons';
import { request } from '@/request';

const fields = {
  number: { type: 'string', label: 'AB-Nummer' },
  client: { type: 'string', label: 'Kunde', dataIndex: ['client', 'name'] },
  date: { type: 'date', label: 'Datum' },
  status: { type: 'string', label: 'Status' },
  subTotal: { type: 'currency', label: 'Netto' },
  taxTotal: { type: 'currency', label: 'USt.' },
  total: { type: 'currency', label: 'Gesamt' },
  currency: { type: 'string', label: 'Währung', disableForTable: true },
  notes: { type: 'textarea', label: 'Notizen', disableForTable: true },
};

export default function OrderConfirmations() {
  const config = {
    entity: 'orderconfirmation',
    fields,
    PANEL_TITLE: 'Auftragsbestätigungen',
    DATATABLE_TITLE: 'Auftragsbestätigungen',
    ADD_NEW_ENTITY: 'Auftragsbestätigung anlegen',
    ENTITY_NAME: 'Auftragsbestätigung',
    SEARCH_PLACEHOLDER: 'AB-Nummer oder Kunde suchen …',
    searchConfig: { displayLabels: ['number'], searchFields: 'number' },
    deleteModalLabels: ['number'],
    tableExtra: [{
      key: 'downloadPdf',
      label: 'PDF herunterladen',
      icon: <FilePdfOutlined />,
      onClick: (record) => request.download({
        path: `download/orderconfirmation/orderconfirmation-${record._id}.pdf`,
        filename: `Auftragsbestaetigung-${record.number}.pdf`,
      }),
    }],
  };
  return <CrudModule createForm={<OrderConfirmationForm />} updateForm={<OrderConfirmationForm />} config={config} />;
}
