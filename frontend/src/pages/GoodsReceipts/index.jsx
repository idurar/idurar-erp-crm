import { useCallback, useEffect, useState } from 'react';
import { App, Button, DatePicker, Form, Input, InputNumber, Modal, Space, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import request from '@/request/request';

const RECEIVABLE_SEARCH_OPTIONS = Object.freeze({ receivable: 'true' });
const purchaseOrderLabel = (order) => {
  const positions = (order.items || []).map((item) => item.description).filter(Boolean).join(', ');
  return [order.number, order.supplier?.name, positions].filter(Boolean).join(' — ');
};

export default function GoodsReceipts() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await request.list({ entity: 'goodsreceipt', options: { page: 1, items: 100 } });
    if (response?.success) setItems(response.result || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const selectOrder = async (id) => {
    if (!id || id === 'redirectURL') return;
    const response = await request.get({ entity: `purchaseorder/receivable/${id}` });
    const receivable = response?.result?.items || [];
    setOrderItems(receivable);
    form.setFieldValue('items', receivable.map((item) => ({
      purchaseOrderLineId: item.purchaseOrderLineId,
      quantity: undefined,
    })));
  };

  const submit = async (values, selectedItems = values.items) => {
    const payload = { ...values, items: (selectedItems || []).filter((item) => Number(item.quantity) > 0) };
    if (!payload.items.length) return message.error('Bitte mindestens eine Liefermenge eintragen.');
    setSaving(true);
    const response = await request.create({ entity: 'goodsreceipt', jsonData: payload });
    setSaving(false);
    if (response?.success) { setOpen(false); form.resetFields(); setOrderItems([]); await load(); }
  };

  const submitLine = async (index) => {
    const values = await form.validateFields();
    const line = values.items?.[index];
    const orderItem = orderItems[index];
    if (!line || !orderItem) return message.error('Die Bestellposition wurde nicht gefunden.');
    if (line.quantity === undefined || line.quantity === null || line.quantity === '') {
      return Modal.confirm({
        title: `Sind Sie sicher, dass Sie den Wareneingang von ${orderItem.articleName || orderItem.description || 'diesem Artikel'} mit ${orderItem.remaining} ${orderItem.unit || ''} vollständig einbuchen möchten?`,
        okText: 'Bestätigen',
        cancelText: 'Abbrechen',
        onOk: () => submit(values, [{
          purchaseOrderLineId: line.purchaseOrderLineId,
          quantity: orderItem.remaining,
        }]),
      });
    }
    if (Number(line.quantity) <= 0) return message.error('Die gelieferte Menge muss größer als 0 sein.');
    return submit(values, [line]);
  };

  const submitAll = async () => {
    const allItems = orderItems.map((item) => ({
      purchaseOrderLineId: item.purchaseOrderLineId,
      quantity: item.remaining,
    }));
    form.setFieldValue('items', allItems);
    const values = await form.validateFields();
    return submit(values, allItems);
  };

  const columns = [
    { title: 'Wareneingang', dataIndex: 'number' },
    { title: 'Bestellung', dataIndex: 'purchaseOrder', render: (value) => value?.number || '—' },
    { title: 'Lieferant', dataIndex: 'supplier', render: (value) => value?.name || '—' },
    { title: 'Kommission', dataIndex: 'commission', render: (value, record) => value || record.purchaseOrder?.commission || (record.project ? `${record.project.number} · ${record.project.name}` : '—') },
    { title: 'Lieferschein', dataIndex: 'deliveryNoteNumber' },
    { title: 'Eingang', dataIndex: 'receivedAt', render: (value) => dayjs(value).format('DD.MM.YYYY') },
    { title: 'Positionen', dataIndex: 'items', render: (value) => value?.length || 0 },
  ];

  return <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
      <div><Typography.Title level={2}>Wareneingänge</Typography.Title><Typography.Text type="secondary">Teil- und Komplettlieferungen erhöhen automatisch den Lagerbestand.</Typography.Text></div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOrderItems([]); setOpen(true); }}>Wareneingang buchen</Button>
    </Space>
    <Table rowKey="_id" loading={loading} dataSource={items} columns={columns} pagination={{ pageSize: 20 }} />
    <Modal
      title="Wareneingang buchen"
      open={open}
      onCancel={() => setOpen(false)}
      width={980}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>Abbrechen</Button>,
        <Button key="all" loading={saving} disabled={!orderItems.length} onClick={submitAll}>Alle offenen Mengen verbindlich buchen</Button>,
        <Button key="selected" type="primary" loading={saving} onClick={() => form.submit()}>Ausgewählte Mengen verbindlich buchen</Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="number" label="Wareneingangsnummer" extra="Optional – wird automatisch vergeben, wenn das Feld leer bleibt."><Input placeholder="Wird automatisch vergeben" /></Form.Item>
        <Form.Item
          name="purchaseOrder"
          label="Bestellung"
          rules={[{ required: true }]}
          extra="Anzeige: Bestellnummer — Lieferant — bestellte Positionen"
        ><AutoCompleteAsync entity="purchaseorder" displayLabels={['number']} optionLabel={purchaseOrderLabel} searchFields="number,reference" searchOptions={RECEIVABLE_SEARCH_OPTIONS} onChange={selectOrder} /></Form.Item>
        <Form.Item name="receivedAt" label="Eingangsdatum" initialValue={dayjs()} rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="deliveryNoteNumber" label="Lieferscheinnummer"><Input /></Form.Item>
        <Form.List name="items">{(fields) => (
          <Table
            rowKey="key"
            pagination={false}
            dataSource={fields}
            size="small"
            columns={[
              {
                title: 'Artikelbezeichnung',
                render: (_, field, index) => {
                  const item = orderItems[index];
                  return <>
                    <Form.Item name={[field.name, 'purchaseOrderLineId']} hidden><Input /></Form.Item>
                    <Typography.Text strong>{item?.articleName || item?.description || 'Position'}</Typography.Text>
                    {item?.articleNumber && <><br /><Typography.Text type="secondary">{item.articleNumber}</Typography.Text></>}
                    {item?.description && item.description !== item.articleName && <><br /><Typography.Text type="secondary">{item.description}</Typography.Text></>}
                  </>;
                },
              },
              {
                title: 'Offene Menge',
                width: 150,
                render: (_, _field, index) => {
                  const item = orderItems[index];
                  return `${item?.remaining || 0} ${item?.unit || ''}`;
                },
              },
              {
                title: 'Gelieferte Menge',
                width: 180,
                render: (_, field, index) => (
                  <Form.Item name={[field.name, 'quantity']} style={{ margin: 0 }}>
                    <InputNumber min={0} max={orderItems[index]?.remaining || 0} precision={3} style={{ width: '100%' }} />
                  </Form.Item>
                ),
              },
              {
                title: '',
                width: 160,
                render: (_, _field, index) => (
                  <Button loading={saving} onClick={() => submitLine(index)}>Diese Menge buchen</Button>
                ),
              },
            ]}
          />
        )}</Form.List>
        <Form.Item name="notes" label="Notizen"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  </Space>;
}
