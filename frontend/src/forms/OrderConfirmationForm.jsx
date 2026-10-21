import { Button, Divider, Form, Input, InputNumber, Select, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';

const paymentTriggers = [
  { value: 'confirmation', label: 'Bei Auftragsbestätigung' },
  { value: 'work_start', label: 'Bei Arbeitsbeginn' },
  { value: 'progress', label: 'Nach Baufortschritt' },
  { value: 'completion', label: 'Bei Fertigstellung' },
  { value: 'fixed_date', label: 'Zu einem festen Datum' },
];

function DateInput({ value, onChange }) {
  return (
    <Input
      type="date"
      value={value ? dayjs(value).format('YYYY-MM-DD') : ''}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}

export default function OrderConfirmationForm() {
  return (
    <>
      <Space wrap size="middle" align="start">
        <Form.Item name="number" label="AB-Nummer"><Input placeholder="Wird automatisch vergeben" /></Form.Item>
        <Form.Item name="client" label="Kunde" rules={[{ required: true }]}>
          <AutoCompleteAsync entity="client" displayLabels={['name']} searchFields="name,email" />
        </Form.Item>
        <Form.Item name="date" label="Datum" initialValue={dayjs()} rules={[{ required: true }]}>
          <DateInput />
        </Form.Item>
        <Form.Item name="status" label="Status" initialValue="draft">
          <Select style={{ minWidth: 180 }} options={[
            { value: 'draft', label: 'Entwurf' },
            { value: 'confirmed', label: 'Bestätigt' },
            { value: 'partially_invoiced', label: 'Teilweise verrechnet' },
            { value: 'completed', label: 'Abgeschlossen' },
            { value: 'cancelled', label: 'Storniert' },
          ]} />
        </Form.Item>
        <Form.Item name="currency" label="Währung" initialValue="EUR"><Input style={{ width: 100 }} /></Form.Item>
        <Form.Item name="taxRate" label="USt. %" initialValue={20}><InputNumber min={0} max={100} /></Form.Item>
      </Space>

      <Divider orientation="left">Positionen</Divider>
      <Form.List name="items" initialValue={[{ quantity: 1, unit: 'Stk.', discount: 0, price: 0 }]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...rest }, index) => (
              <Space key={key} wrap align="start" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item {...rest} name={[name, 'itemName']} label={`Position ${index + 1}`} rules={[{ required: true }]}><Input placeholder="Leistung / Artikel" /></Form.Item>
                <Form.Item {...rest} name={[name, 'description']} label="Beschreibung"><Input /></Form.Item>
                <Form.Item {...rest} name={[name, 'quantity']} label="Menge" rules={[{ required: true }]}><InputNumber min={0.001} /></Form.Item>
                <Form.Item {...rest} name={[name, 'unit']} label="Einheit"><Input style={{ width: 80 }} /></Form.Item>
                <Form.Item {...rest} name={[name, 'price']} label="Einzelpreis" rules={[{ required: true }]}><InputNumber min={0} precision={2} /></Form.Item>
                <Form.Item {...rest} name={[name, 'discount']} label="Rabatt %"><InputNumber min={0} max={100} /></Form.Item>
                <Button danger type="text" aria-label="Position löschen" icon={<DeleteOutlined />} onClick={() => remove(name)} style={{ marginTop: 30 }} />
              </Space>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ quantity: 1, unit: 'Stk.', discount: 0, price: 0 })}>Position hinzufügen</Button>
          </>
        )}
      </Form.List>

      <Divider orientation="left">An- und Teilzahlungen</Divider>
      <Form.List name="paymentSchedule" initialValue={[
        { label: 'Anzahlung', percentage: 30, dueTrigger: 'confirmation' },
        { label: 'Restzahlung', percentage: 70, dueTrigger: 'completion' },
      ]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...rest }) => (
              <Space key={key} wrap align="start" style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item {...rest} name={[name, 'label']} label="Bezeichnung" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item {...rest} name={[name, 'percentage']} label="Anteil %" rules={[{ required: true }]}><InputNumber min={0.01} max={100} precision={2} /></Form.Item>
                <Form.Item {...rest} name={[name, 'dueTrigger']} label="Fälligkeit" rules={[{ required: true }]}><Select style={{ width: 220 }} options={paymentTriggers} /></Form.Item>
                <Form.Item noStyle shouldUpdate={(before, after) => before.paymentSchedule?.[name]?.dueTrigger !== after.paymentSchedule?.[name]?.dueTrigger}>
                  {({ getFieldValue }) => getFieldValue(['paymentSchedule', name, 'dueTrigger']) === 'fixed_date' ? (
                    <Form.Item {...rest} name={[name, 'dueDate']} label="Fällig am" rules={[{ required: true }]}><DateInput /></Form.Item>
                  ) : null}
                </Form.Item>
                <Button danger type="text" aria-label="Teilzahlung löschen" icon={<DeleteOutlined />} onClick={() => remove(name)} style={{ marginTop: 30 }} />
              </Space>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ label: 'Teilzahlung', percentage: 10, dueTrigger: 'progress' })}>Teilzahlung hinzufügen</Button>
          </>
        )}
      </Form.List>
      <div style={{ marginTop: 8, color: '#666' }}>Der Zahlungsplan muss zusammen genau 100 % ergeben.</div>
      <Form.Item name="notes" label="Notizen" style={{ marginTop: 16 }}><Input.TextArea rows={3} /></Form.Item>
    </>
  );
}
