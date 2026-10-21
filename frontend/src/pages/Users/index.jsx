import { useCallback, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import request from '@/request/request';
import dayjs from 'dayjs';

const roles = [
  { value: 'owner', label: 'Eigentümer' },
  { value: 'admin', label: 'Administrator' },
  { value: 'accounting', label: 'Buchhaltung' },
  { value: 'sales', label: 'Vertrieb' },
  { value: 'warehouse', label: 'Lager' },
  { value: 'technician', label: 'Monteur' },
  { value: 'viewer', label: 'Nur lesen' },
];

const employmentTypes = [
  { value: 'full_time', label: 'Vollzeit' },
  { value: 'part_time', label: 'Teilzeit' },
  { value: 'marginal', label: 'Geringfügig' },
  { value: 'custom', label: 'Benutzerdefiniert' },
];

const vacationModels = [
  { value: 'five_weeks', label: '5 Wochen' },
  { value: 'six_weeks', label: '6 Wochen' },
  { value: 'custom', label: 'Benutzerdefiniert' },
];

const formatDecimal = (value, digits = 2) => Number(value || 0).toLocaleString('de-AT', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
});

export default function Users({ employeeMode = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    const response = await request.get({ entity: 'admin/list' });
    if (response?.success) setItems(response.result || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ role: 'viewer', employmentType: 'full_time', weeklyTargetHours: 40, workDaysPerWeek: 5, vacationModel: 'five_weeks', annualVacationDays: 25, initialTimeBalance: 0, vacationCarryover: 0 });
    setOpen(true);
  };

  const showEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({ ...record, employmentStart: record.employmentStart ? dayjs(record.employmentStart) : null });
    setOpen(true);
  };

  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    const response = editing
      ? await request.patch({ entity: `admin/update/${editing._id}`, jsonData: values })
      : await request.post({ entity: 'admin/create', jsonData: values });
    setSaving(false);
    if (response?.success) {
      setOpen(false);
      await load();
    }
  };

  const toggleEnabled = async (record, enabled) => {
    const response = await request.patch({
      entity: `admin/update/${record._id}`,
      jsonData: { enabled },
    });
    if (response?.success) await load();
  };

  const columns = [
    { title: 'Name', render: (_, item) => `${item.name} ${item.surname || ''}`.trim() },
    { title: 'E-Mail', dataIndex: 'email' },
    {
      title: 'Zeitmodell',
      render: (_, item) => `${employmentTypes.find((type) => type.value === item.employmentType)?.label || 'Vollzeit'} · ${formatDecimal(item.weeklyTargetHours ?? 40)} Std./Woche`,
    },
    {
      title: 'Urlaub',
      render: (_, item) => `${item.annualVacationDays ?? 25} Tage/Jahr`,
    },
    {
      title: 'Rolle',
      dataIndex: 'role',
      render: (role) => <Tag>{roles.find((item) => item.value === role)?.label || role}</Tag>,
    },
    {
      title: 'Aktiv',
      dataIndex: 'enabled',
      render: (enabled, record) => (
        <Switch checked={enabled} onChange={(checked) => toggleEnabled(record, checked)} />
      ),
    },
    {
      title: '',
      render: (_, record) => <Button onClick={() => showEdit(record)}>Bearbeiten</Button>,
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <div>
          <Typography.Title level={2}>{employeeMode ? 'Mitarbeiter' : 'Benutzer & Rollen'}</Typography.Title>
          <Typography.Text type="secondary">
            {employeeMode ? 'Arbeitszeitmodell, Sollstunden und Urlaubsanspruch je Mitarbeiter.' : 'Zugänge werden pro Person vergeben. Gemeinsame Konten sollten nicht verwendet werden.'}
          </Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreate}>
          {employeeMode ? 'Mitarbeiter anlegen' : 'Benutzer anlegen'}
        </Button>
      </Space>
      <Table rowKey="_id" loading={loading} dataSource={items} columns={columns} pagination={false} />
      <Modal
        title={editing ? (employeeMode ? 'Mitarbeiter bearbeiten' : 'Benutzer bearbeiten') : (employeeMode ? 'Mitarbeiter anlegen' : 'Benutzer anlegen')}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={save}
        confirmLoading={saving}
        okText="Speichern"
        cancelText="Abbrechen"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Vorname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="surname" label="Nachname">
            <Input />
          </Form.Item>
          {!editing && (
            <>
              <Form.Item name="email" label="E-Mail" rules={[{ required: true, type: 'email' }]}>
                <Input autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Startpasswort"
                rules={[{ required: true, min: 12, message: 'Mindestens 12 Zeichen' }]}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </>
          )}
          <Form.Item name="role" label="Rolle" rules={[{ required: true }]}>
            <Select options={roles} />
          </Form.Item>
          <Typography.Title level={5}>Arbeitszeitmodell</Typography.Title>
          <Form.Item name="employmentType" label="Beschäftigungsart" rules={[{ required: true }]}>
            <Select options={employmentTypes} />
          </Form.Item>
          <Space size="middle" style={{ display: 'flex' }} align="start">
            <Form.Item name="weeklyTargetHours" label="Sollstunden pro Woche" rules={[{ required: true }]}>
              <InputNumber min={0} max={168} precision={2} decimalSeparator="," />
            </Form.Item>
            <Form.Item name="workDaysPerWeek" label="Arbeitstage pro Woche" rules={[{ required: true }]}>
              <InputNumber min={1} max={7} precision={0} />
            </Form.Item>
          </Space>
          <Form.Item name="employmentStart" label="Eintrittsdatum"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="vacationModel" label="Urlaubsmodell" rules={[{ required: true }]}>
            <Select options={vacationModels} onChange={(value) => {
              const days = Number(form.getFieldValue('workDaysPerWeek')) || 5;
              if (value === 'five_weeks') form.setFieldValue('annualVacationDays', days * 5);
              if (value === 'six_weeks') form.setFieldValue('annualVacationDays', days * 6);
            }} />
          </Form.Item>
          <Form.Item name="annualVacationDays" label="Urlaubstage pro Jahr" rules={[{ required: true }]}>
            <InputNumber min={0} max={366} precision={1} decimalSeparator="," style={{ width: '100%' }} />
          </Form.Item>
          <Space size="middle" style={{ display: 'flex' }} align="start">
            <Form.Item name="initialTimeBalance" label="Startsaldo Stunden"><InputNumber precision={2} decimalSeparator="," /></Form.Item>
            <Form.Item name="vacationCarryover" label="Resturlaub Vorjahr"><InputNumber precision={1} decimalSeparator="," /></Form.Item>
          </Space>
        </Form>
      </Modal>
    </Space>
  );
}
