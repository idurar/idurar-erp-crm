import { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { request } from '@/request';

const optionFromSupplier = (supplier) => ({
  value: supplier._id,
  label: supplier.supplierNumber ? `${supplier.name} (${supplier.supplierNumber})` : supplier.name,
});

export default function SupplierSelect({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const selectedId = typeof value === 'object' ? value?._id : value;
  const selectedOption = useMemo(
    () => (value && typeof value === 'object' ? optionFromSupplier(value) : null),
    [value]
  );

  useEffect(() => {
    if (value && typeof value === 'object' && value._id) onChange?.(value._id);
  }, [onChange, value]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      const response = await request.search({
        entity: 'supplier',
        options: { q: search, fields: 'name,supplierNumber,email' },
      });
      if (active && response?.success) setOptions(response.result.map(optionFromSupplier));
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search]);

  const visibleOptions = selectedOption && !options.some(({ value: id }) => id === selectedOption.value)
    ? [selectedOption, ...options]
    : options;

  const createSupplier = async () => {
    const values = await form.validateFields();
    setSaving(true);
    const response = await request.create({ entity: 'supplier', jsonData: values });
    setSaving(false);
    if (!response?.success) return;
    const createdOption = optionFromSupplier(response.result);
    setOptions((current) => [createdOption, ...current]);
    onChange?.(response.result._id);
    form.resetFields();
    setOpen(false);
  };

  const openCreateSupplier = () => {
    form.setFieldsValue({ name: search.trim() });
    setOpen(true);
  };

  return (
    <>
      <Space.Compact style={{ width: '100%' }}>
        <Select
          showSearch
          allowClear
          filterOption={false}
          value={selectedId}
          options={visibleOptions}
          onSearch={setSearch}
          onFocus={() => setSearch('')}
          onChange={onChange}
          placeholder="Lieferant suchen"
          style={{ width: '100%' }}
        />
        <Button icon={<PlusOutlined />} onClick={openCreateSupplier}>
          Neu
        </Button>
      </Space.Compact>
      <Modal
        title="Lieferant direkt anlegen"
        open={open}
        okText="Anlegen und auswählen"
        cancelText="Abbrechen"
        confirmLoading={saving}
        onOk={createSupplier}
        onCancel={() => setOpen(false)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="name" label="Firmenname" rules={[{ required: true, whitespace: true }]}>
            <Input autoFocus />
          </Form.Item>
          <Form.Item name="supplierNumber" label="Lieferantennummer"><Input /></Form.Item>
          <Form.Item name="contactName" label="Ansprechperson"><Input /></Form.Item>
          <Form.Item name="email" label="E-Mail" rules={[{ type: 'email' }]}><Input /></Form.Item>
          <Form.Item name="phone" label="Telefon"><Input /></Form.Item>
          <Form.Item name="paymentTerms" label="Zahlungskonditionen"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
}
