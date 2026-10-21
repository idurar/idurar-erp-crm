import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';
import useLanguage from '@/locale/useLanguage';
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  StopOutlined,
  UndoOutlined,
  CopyOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';
import { request } from '@/request';
import { useNavigate } from 'react-router-dom';

export default function InvoiceDataTableModule({ config }) {
  const translate = useLanguage();
  const navigate = useNavigate();
  const invoiceLabel = (record) =>
    record.number ? `${record.number}/${record.year || ''}` : 'Entwurf';
  const cancelInvoice = (record, refresh) => {
    let reason = '';
    Modal.confirm({
      title: `Rechnung ${invoiceLabel(record)} stornieren?`,
      content: (
        <input
          style={{ width: '100%', padding: 8 }}
          placeholder="Stornogrund"
          onChange={(event) => {
            reason = event.target.value;
          }}
        />
      ),
      okText: 'Stornieren',
      okButtonProps: { danger: true },
      cancelText: 'Abbrechen',
      onOk: async () => {
        const response = await request.patch({
          entity: `invoice/cancel/${record._id}`,
          jsonData: { reason },
        });
        if (response?.success) refresh();
      },
    });
  };
  const issueInvoice = (record, refresh) =>
    Modal.confirm({
      title: `Rechnung ${invoiceLabel(record)} verbindlich ausstellen?`,
      content: 'Danach ist die Rechnung nicht mehr bearbeitbar und Lagerartikel werden ausgebucht.',
      okText: 'Ausstellen',
      cancelText: 'Abbrechen',
      onOk: async () => {
        const response = await request.patch({
          entity: `invoice/issue/${record._id}`,
          jsonData: {},
        });
        if (response?.success) refresh();
        else throw new Error(response?.message || 'Rechnung konnte nicht ausgestellt werden');
      },
    });
  const createCreditNote = (record, refresh) => {
    let reason = '';
    Modal.confirm({
      title: `Gutschrift zu Rechnung ${invoiceLabel(record)} erstellen?`,
      content: (
        <input
          style={{ width: '100%', padding: 8 }}
          placeholder="Grund der Gutschrift"
          onChange={(event) => {
            reason = event.target.value;
          }}
        />
      ),
      okText: 'Gutschrift erstellen',
      cancelText: 'Abbrechen',
      onOk: async () => {
        const response = await request.post({
          entity: `invoice/credit-note/${record._id}`,
          jsonData: { reason },
        });
        if (response?.success) refresh();
        else throw new Error(response?.message || 'Gutschrift konnte nicht erstellt werden');
      },
    });
  };
  const configureRecurrence = (record, refresh) => {
    if (record.recurringActive) {
      return request
        .patch({
          entity: `invoice/recurrence/${record._id}`,
          jsonData: {
            recurring: record.recurring,
            recurringActive: false,
            nextRecurringDate: record.nextRecurringDate,
            recurringEndDate: record.recurringEndDate,
          },
        })
        .then((response) => response?.success && refresh());
    }

    let recurring = record.recurring && record.recurring !== 'none' ? record.recurring : 'monthly';
    let nextRecurringDate = new Date();
    nextRecurringDate.setMonth(nextRecurringDate.getMonth() + 1);
    let nextDate = nextRecurringDate.toISOString().slice(0, 10);
    let endDate = record.recurringEndDate
      ? new Date(record.recurringEndDate).toISOString().slice(0, 10)
      : '';
    return Modal.confirm({
      title: `Wiederkehrende Rechnung für ${record.client?.name || invoiceLabel(record)}`,
      content: (
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          <label>
            Intervall
            <select
              defaultValue={recurring}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
              onChange={(event) => {
                recurring = event.target.value;
              }}
            >
              <option value="weekly">Wöchentlich</option>
              <option value="monthly">Monatlich</option>
              <option value="quarterly">Vierteljährlich</option>
              <option value="annually">Jährlich</option>
            </select>
          </label>
          <label>
            Nächste Erstellung
            <input
              type="date"
              defaultValue={nextDate}
              min={new Date().toISOString().slice(0, 10)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
              onChange={(event) => {
                nextDate = event.target.value;
              }}
            />
          </label>
          <label>
            Enddatum (optional)
            <input
              type="date"
              defaultValue={endDate}
              min={nextDate}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
              onChange={(event) => {
                endDate = event.target.value;
              }}
            />
          </label>
        </div>
      ),
      okText: 'Aktivieren',
      cancelText: 'Abbrechen',
      onOk: async () => {
        const response = await request.patch({
          entity: `invoice/recurrence/${record._id}`,
          jsonData: {
            recurring,
            recurringActive: true,
            nextRecurringDate: nextDate,
            recurringEndDate: endDate || null,
          },
        });
        if (response?.success) refresh();
        else throw new Error(response?.message || 'Wiederholung konnte nicht gespeichert werden');
      },
    });
  };
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        extra={[
          {
            label: 'Als neue Rechnung verwenden',
            key: 'duplicateInvoice',
            icon: <CopyOutlined />,
            disabled: (record) => record.documentType === 'credit_note',
            onClick: (record) => navigate(`/invoice/create?from=${record._id}`),
          },
          {
            label: (record) =>
              record.recurringActive ? 'Wiederholung pausieren' : 'Wiederholung einrichten',
            key: 'recurringInvoice',
            icon: <SyncOutlined spin={false} />,
            disabled: (record) =>
              record.documentType === 'credit_note' ||
              ['cancelled', 'refunded'].includes(record.status),
            onClick: configureRecurrence,
          },
          {
            label: 'Gutschrift erstellen',
            key: 'creditNote',
            icon: <UndoOutlined />,
            disabled: (record) =>
              !record.issuedAt ||
              record.documentType === 'credit_note' ||
              ['cancelled', 'refunded'].includes(record.status) ||
              Number(record.credit) > 0,
            onClick: createCreditNote,
          },
          {
            label: 'Verbindlich ausstellen',
            key: 'issueInvoice',
            icon: <CheckCircleOutlined />,
            disabled: (record) =>
              Boolean(record.issuedAt) || ['cancelled', 'refunded'].includes(record.status),
            onClick: issueInvoice,
          },
          {
            label: translate('Record Payment'),
            key: 'recordPayment',
            icon: <CreditCardOutlined />,
            disabled: (record) =>
              !record.issuedAt ||
              record.paymentStatus === 'paid' ||
              record.documentType === 'credit_note' ||
              ['cancelled', 'refunded'].includes(record.status),
          },
          {
            label: 'Stornieren',
            key: 'cancelInvoice',
            icon: <StopOutlined />,
            disabled: (record) =>
              !record.issuedAt || record.status === 'cancelled' || Number(record.credit) > 0,
            onClick: cancelInvoice,
          },
        ]}
      ></ErpPanel>
    </ErpLayout>
  );
}
