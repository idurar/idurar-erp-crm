import { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import SupplierSelect from '@/components/SupplierSelect';
import { request } from '@/request';
import './purchase-order-form.css';

function PurchaseOrderItemFields({ field, index, remove }) {
  const form = Form.useFormInstance();
  const articleValue = Form.useWatch(['items', field.name, 'article'], form);
  const [averagePurchasePrice, setAveragePurchasePrice] = useState(null);

  useEffect(() => {
    const articleId = articleValue?._id || articleValue;
    if (!articleId) {
      setAveragePurchasePrice(null);
      return;
    }
    let active = true;
    request.read({ entity: 'article', id: articleId }).then((response) => {
      if (active) setAveragePurchasePrice(response?.success ? Number(response.result.purchasePrice) || 0 : null);
    });
    return () => { active = false; };
  }, [articleValue]);

  const pricePlaceholder = averagePurchasePrice === null
    ? 'Optional'
    : `Aktueller Ø-EK: ${averagePurchasePrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

  return <div className="purchase-order-item">
    <div className="purchase-order-item-title">Position {index + 1}</div>
    <Button className="purchase-order-item-delete" danger type="text" aria-label={`Position ${index + 1} löschen`} icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
    <Form.Item className="purchase-order-item-article" {...field.rest} name={[field.name, 'article']} label="Lagerartikel"><AutoCompleteAsync entity="article" displayLabels={['number', 'name']} searchFields="number,name,supplierNumber" /></Form.Item>
    <Form.Item className="purchase-order-item-description" {...field.rest} name={[field.name, 'description']} label="Beschreibung" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item {...field.rest} name={[field.name, 'quantity']} label="Menge" rules={[{ required: true }]}><InputNumber min={0.001} /></Form.Item>
    <Form.Item {...field.rest} name={[field.name, 'unit']} label="Einheit"><Input /></Form.Item>
    <Form.Item {...field.rest} name={[field.name, 'unitPrice']} label="Einzelpreis"><InputNumber min={0} precision={2} placeholder={pricePlaceholder} /></Form.Item>
    <Form.Item {...field.rest} name={[field.name, 'taxRate']} label="Steuer %"><InputNumber min={0} max={100} /></Form.Item>
  </div>;
}

export default function PurchaseOrderForm() {
  return <div className="purchase-order-form">
    <div className="purchase-order-meta">
      <Form.Item name="number" label="Bestellnummer"><Input placeholder="Wird bei Bedarf automatisch vergeben" /></Form.Item>
      <Form.Item name="supplier" label="Lieferant" rules={[{ required: true }]}><SupplierSelect /></Form.Item>
      <Form.Item className="purchase-order-project" name="commission" label="Kommission / Projekt"><Input placeholder="z. B. Komm. Ender" /></Form.Item>
      <Form.Item name="orderDate" label="Bestelldatum" initialValue={dayjs()} rules={[{ required: true }]}><DatePicker /></Form.Item>
      <Form.Item name="expectedDate" label="Erwartete Lieferung"><DatePicker /></Form.Item>
      <Form.Item name="reference" label="Lieferantenreferenz"><Input /></Form.Item>
    </div>
    <Form.List name="items" initialValue={[{ quantity: 1, unit: 'Stk.', taxRate: 20 }]}>
      {(fields, { add, remove }) => <div className="purchase-order-items">
        {fields.map(({ key, name, ...rest }, index) => <PurchaseOrderItemFields key={key} field={{ name, rest }} index={index} remove={remove} />)}
        <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add({ quantity: 1, unit: 'Stk.', taxRate: 20 })}>Position hinzufügen</Button>
      </div>}
    </Form.List>
    <Form.Item name="notes" label="Notizen" style={{ marginTop: 16 }}><Input.TextArea rows={3} /></Form.Item>
  </div>;
}
