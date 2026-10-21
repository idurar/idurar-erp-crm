import { useEffect, useMemo } from 'react';
import { Alert, Col, DatePicker, Form, Input, Row, Select, Switch, TimePicker, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import SelectAsync from '@/components/SelectAsync';

const BREAK_OPTIONS = [
  { label: 'Keine Pause', value: 0 },
  { label: '30 Min.', value: 30 },
  { label: '45 Min.', value: 45 },
  { label: '1 Std.', value: 60 },
  { label: '1,5 Std.', value: 90 },
  { label: '2 Std.', value: 120 },
];

const minutesFromTime = (value) => {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatDuration = (minutes) => {
  if (!Number.isFinite(minutes) || minutes < 0) return '–';
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}:${String(remainder).padStart(2, '0')} Std.`;
};

function ClockInput({ value, onChange, placeholder }) {
  const [hours, minutes] = value?.split(':').map(Number) || [];
  const pickerValue = Number.isFinite(hours) && Number.isFinite(minutes)
    ? dayjs().hour(hours).minute(minutes).second(0).millisecond(0)
    : null;
  return <TimePicker value={pickerValue} onChange={(time) => onChange?.(time ? time.format('HH:mm') : undefined)} format="HH:mm" minuteStep={5} allowClear placeholder={placeholder} suffixIcon={<ClockCircleOutlined />} style={{ width: '100%' }} />;
}

export default function TimeEntryForm({ canManageAll, employees, entryTypes }) {
  const form = Form.useFormInstance();
  const startTime = Form.useWatch('startTime', form);
  const endTime = Form.useWatch('endTime', form);
  const selectedBreak = Form.useWatch('breakMinutes', form) ?? 0;

  const calculation = useMemo(() => {
    const start = minutesFromTime(startTime);
    const end = minutesFromTime(endTime);
    if (start === null || end === null || end <= start) return null;
    const gross = end - start;
    const breakMinutes = gross >= 360 ? Math.max(30, selectedBreak) : selectedBreak;
    return { gross, breakMinutes, net: gross - breakMinutes, automaticBreak: gross >= 360 && selectedBreak < 30 };
  }, [startTime, endTime, selectedBreak]);

  useEffect(() => {
    if (!calculation || calculation.net <= 0) {
      form.setFieldValue('hours', undefined);
      return;
    }
    if (calculation.automaticBreak) form.setFieldValue('breakMinutes', 30);
    form.setFieldValue('hours', Number((calculation.net / 60).toFixed(2)));
  }, [calculation, form]);

  return <div className="time-capture-form">
    {canManageAll && <Form.Item name="employee" label="Mitarbeiter" rules={[{ required: true, message: 'Bitte einen Mitarbeiter auswählen.' }]}>
      <Select showSearch optionFilterProp="label" placeholder="Mitarbeiter auswählen" options={employees.map((employee) => ({ value: employee._id, label: `${employee.name || ''} ${employee.surname || ''} (${employee.email})`.trim() }))} />
    </Form.Item>}

    <Form.Item name="project" label="Projekt">
      <SelectAsync entity="project" displayLabels={['number', 'name']} outputValue="_id" placeholder="Projekt suchen (optional)" />
    </Form.Item>

    <Row gutter={14}>
      <Col xs={24} md={12}><Form.Item name="entryType" label="Zeitart" initialValue="work" rules={[{ required: true }]}><Select options={entryTypes} /></Form.Item></Col>
      <Col xs={24} md={12}><Form.Item name="workDate" label="Arbeitstag" initialValue={dayjs()} rules={[{ required: true, message: 'Bitte den Arbeitstag wählen.' }]}><DatePicker format="DD.MM.YYYY" allowClear={false} style={{ width: '100%' }} /></Form.Item></Col>
    </Row>

    <div className="time-clock-panel">
      <Typography.Text className="time-clock-heading">Arbeitszeit</Typography.Text>
      <div className="time-clock-fields">
        <Form.Item name="startTime" label="Kommt" rules={[{ required: true, message: 'Startzeit fehlt.' }]}><ClockInput placeholder="08:00" /></Form.Item>
        <Form.Item name="endTime" label="Geht" dependencies={['startTime']} rules={[
          { required: true, message: 'Endzeit fehlt.' },
          ({ getFieldValue }) => ({ validator(_, value) {
            const start = minutesFromTime(getFieldValue('startTime'));
            if (!value || start === null || minutesFromTime(value) > start) return Promise.resolve();
            return Promise.reject(new Error('Die Endzeit muss nach der Startzeit liegen.'));
          } }),
        ]}><ClockInput placeholder="16:30" /></Form.Item>
      </div>

      <Form.Item
        name="breakMinutes"
        label="Pause"
        initialValue={0}
        className="time-break-field"
        dependencies={['startTime', 'endTime']}
        rules={[({ getFieldValue }) => ({ validator(_, value) {
          const start = minutesFromTime(getFieldValue('startTime'));
          const end = minutesFromTime(getFieldValue('endTime'));
          if (start === null || end === null || end <= start || Number(value) < end - start) return Promise.resolve();
          return Promise.reject(new Error('Die Pause muss kürzer als die Anwesenheitszeit sein.'));
        } })]}
      ><Select options={BREAK_OPTIONS} /></Form.Item>
      {calculation?.gross >= 360 && <Alert type="info" showIcon message="Ab 6 Stunden werden mindestens 30 Minuten Pause berücksichtigt." />}
      <div className="time-total-box"><span>Gesamtarbeitszeit</span><strong>{formatDuration(calculation?.net)}</strong></div>
      <div className="time-calculation-summary">
        <div><span>ANWESENHEIT</span><strong>{formatDuration(calculation?.gross)}</strong></div>
        <div><span>PAUSE</span><strong>{formatDuration(calculation?.breakMinutes)}</strong></div>
        <div><span>ARBEITSZEIT</span><strong>{formatDuration(calculation?.net)}</strong></div>
      </div>
    </div>

    <Form.Item name="hours" hidden><Input /></Form.Item>
    <Form.Item name="description" label="Tätigkeit / Notiz"><Input.TextArea rows={4} placeholder="Was wurde erledigt?" showCount maxLength={1000} /></Form.Item>
    <Form.Item name="billable" label="Abrechenbar" valuePropName="checked" initialValue><Switch /></Form.Item>
  </div>;
}
