import { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, DatePicker, Dropdown, message, Modal, Progress, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, EllipsisOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import CrudModule from '@/modules/CrudModule/CrudModule';
import request from '@/request/request';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import TimeEntryForm from './TimeEntryForm';
import './style.css';

const entryTypes = [
  { value: 'work', label: 'Arbeitszeit' },
  { value: 'vacation', label: 'Urlaub' },
  { value: 'sick', label: 'Krankenstand' },
  { value: 'holiday', label: 'Feiertag' },
  { value: 'overtime', label: 'Überstunden' },
  { value: 'correction', label: 'Korrekturbuchung' },
];

const formatHours = (value) => `${Number(value || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Std.`;

export default function TimeEntries() {
  const [period, setPeriod] = useState(dayjs());
  const [accounts, setAccounts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resetEmployee, setResetEmployee] = useState(null);
  const [resetDate, setResetDate] = useState(dayjs());
  const [resetting, setResetting] = useState(false);
  const currentAdmin = useSelector(selectCurrentAdmin);
  const canManageAll = ['owner', 'admin'].includes(currentAdmin?.role);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    const response = await request.get({ entity: `timeentry/summary-control?year=${period.year()}&month=${period.month() + 1}` });
    if (response?.success) setAccounts(response.result || []);
    setLoading(false);
  }, [period]);
  useEffect(() => { loadAccounts(); }, [loadAccounts]);
  useEffect(() => {
    if (!canManageAll) return;
    request.get({ entity: 'admin/list' }).then((response) => {
      if (response?.success) setEmployees((response.result || []).filter((employee) => employee.enabled));
    });
  }, [canManageAll]);

  const fields = {
    ...(canManageAll ? {
      employee: {
        type: 'select',
        label: 'Mitarbeiter',
        required: true,
        options: employees.map((employee) => ({
          value: employee._id,
          label: `${employee.name || ''} ${employee.surname || ''} (${employee.email})`.trim(),
        })),
      },
    } : {}),
    entryType: { type: 'select', label: 'Zeitart', required: true, defaultValue: 'work', options: entryTypes },
    project: { type: 'async', label: 'Projekt (optional)', entity: 'project', displayLabels: ['number', 'name'], outputValue: '_id' },
    workDate: { type: 'date', label: 'Arbeitstag', required: true },
    startTime: { type: 'string', label: 'Kommt' },
    breakMinutes: { type: 'number', label: 'Pause (Min.)' },
    endTime: { type: 'string', label: 'Geht' },
    hours: { type: 'number', label: 'Arbeitszeit', required: true },
    description: { type: 'textarea', label: 'Tätigkeit / Notiz' },
    billable: { type: 'boolean', label: 'Abrechenbar', defaultValue: true },
  };

  const totals = accounts.reduce((sum, item) => ({
    target: sum.target + Number(item.targetHours || 0),
    actual: sum.actual + Number(item.actualHours || 0),
    balance: sum.balance + Number(item.balance || 0),
  }), { target: 0, actual: 0, balance: 0 });
  const completion = totals.target > 0 ? Math.min(100, Math.round((totals.actual / totals.target) * 100)) : 0;
  const personalAccount = !canManageAll ? accounts[0] : null;
  const performReset = async () => {
    if (!resetEmployee || !resetDate) return;
    setResetting(true);
    const response = await request.post({
      entity: `timeentry/reset/${resetEmployee._id}`,
      jsonData: {
        resetDate: resetDate.format('YYYY-MM-DD'),
        confirmation: resetEmployee.email,
      },
    });
    setResetting(false);
    if (response?.success) {
      setResetEmployee(null);
      await loadAccounts();
      message.success(response.message || 'Zeitkonto wurde zurückgesetzt.');
    }
  };

  const resetTimeAccount = async () => {
    if (!resetEmployee || !resetDate) return;
    setResetting(true);
    const safeName = `${resetEmployee.name || 'mitarbeiter'}-${resetEmployee.surname || ''}`
      .normalize('NFKD').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const backup = await request.download({
      apiPath: `timeentry/backup/${resetEmployee._id}`,
      filename: `zeitbackup-${safeName || 'mitarbeiter'}-${dayjs().format('YYYY-MM-DD')}.csv`,
      silentErrors: true,
    });
    if (!backup?.success) {
      setResetting(false);
      Modal.confirm({
        title: 'Ohne Backup zurücksetzen?',
        content: `Für ${resetEmployee.name || ''} ${resetEmployee.surname || ''} konnte kein Backup heruntergeladen werden. Wenn Sie fortfahren, wird das Zeitkonto trotzdem zurückgesetzt.`,
        okText: 'Ja, ohne Backup zurücksetzen',
        cancelText: 'Abbrechen',
        okButtonProps: { danger: true },
        centered: true,
        onOk: performReset,
      });
      return;
    }
    await performReset();
  };
  const columns = [
    {
      title: 'Mitarbeiter',
      render: (_, item) => {
        const name = `${item.employee?.name || ''} ${item.employee?.surname || ''}`.trim();
        return <Space><Avatar size="small">{name.charAt(0).toUpperCase()}</Avatar><div><div className="time-employee-name">{name}</div><Typography.Text type="secondary">{Number(item.employee?.weeklyTargetHours ?? 40).toLocaleString('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Std./Woche</Typography.Text></div></Space>;
      },
    },
    { title: 'Soll', dataIndex: 'targetHours', render: formatHours },
    { title: 'Erfasst', dataIndex: 'actualHours', render: formatHours },
    { title: 'Saldo', dataIndex: 'balance', render: (value) => <Tag className="time-balance-tag" color={Number(value) < 0 ? 'error' : '#12559B'}>{Number(value) >= 0 ? '+' : ''}{formatHours(value)}</Tag> },
    { title: 'Urlaub', render: (_, item) => <span><strong>{item.vacationRemaining}</strong> von {item.vacationEntitlement} Tagen verfügbar</span> },
    ...(canManageAll ? [{
      title: '',
      width: 52,
      align: 'right',
      render: (_, item) => <Dropdown menu={{ items: [{ key: 'reset', icon: <ReloadOutlined />, danger: true, label: 'Zeitkonto zurücksetzen' }], onClick: () => { setResetDate(dayjs()); setResetEmployee(item.employee); } }} trigger={['click']}><Button type="text" aria-label={`Aktionen für ${item.employee?.name || 'Mitarbeiter'}`} icon={<EllipsisOutlined />} /></Dropdown>,
    }] : []),
  ];
  const config = {
    entity: 'timeentry', fields, PANEL_TITLE: 'Zeiterfassung', DATATABLE_TITLE: 'Arbeitszeiten',
    ADD_NEW_ENTITY: 'Zeit erfassen', ENTITY_NAME: 'Zeiteintrag', SEARCH_PLACEHOLDER: 'Tätigkeiten suchen …',
    searchConfig: { displayLabels: ['description'], searchFields: 'description' }, deleteModalLabels: ['description'],
    allowEdit: canManageAll,
    allowDelete: canManageAll,
    hideBackButton: true,
    hideRefreshButton: true,
    EMPTY_TEXT: 'Für diesen Zeitraum wurden noch keine Zeiten erfasst.',
  };

  return <div className="time-page">
    <header className="time-page-header">
      <div>
        <Typography.Text className="time-eyebrow">ARBEITSZEIT</Typography.Text>
        <Typography.Title level={2}>Zeiterfassung</Typography.Title>
        <Typography.Text type="secondary">Arbeitszeit erfassen und den Monat im Blick behalten.</Typography.Text>
      </div>
      <div className="time-period-picker">
        <CalendarOutlined />
        <DatePicker picker="month" allowClear={false} value={period} onChange={(value) => value && setPeriod(value)} bordered={false} format="MMMM YYYY" />
      </div>
    </header>

    <Row gutter={[16, 16]} className="time-metrics">
      <Col xs={24} md={8}><Card className="time-metric-card"><Statistic title="Sollzeit" value={totals.target} precision={2} suffix="Std." prefix={<ClockCircleOutlined />} /><Progress percent={completion} showInfo={false} strokeColor="#3287CE" trailColor="#E8F3FC" /></Card></Col>
      <Col xs={24} sm={12} md={8}><Card className="time-metric-card"><Statistic title="Erfasste Zeit" value={totals.actual} precision={2} suffix="Std." prefix={<CheckCircleOutlined />} /><Typography.Text type="secondary">{completion}% des Monatssolls</Typography.Text></Card></Col>
      <Col xs={24} sm={12} md={8}><Card className={`time-metric-card time-balance-card ${totals.balance < 0 ? 'is-negative' : 'is-positive'}`}><Statistic title="Monatssaldo" value={totals.balance} precision={2} prefix={totals.balance > 0 ? '+' : ''} suffix="Std." /><Typography.Text type="secondary">Erfasste Zeit minus Sollzeit</Typography.Text></Card></Col>
    </Row>

    {canManageAll ? <Card className="time-overview-card" title="Teamübersicht" bordered={false}>
      <Table rowKey={(item) => item.employee?._id} loading={loading} dataSource={accounts} columns={columns} pagination={false} scroll={{ x: 760 }} />
    </Card> : personalAccount && <Card className="time-personal-card" bordered={false}>
      <div><Typography.Text type="secondary">Urlaubsstand</Typography.Text><Typography.Title level={4}>{personalAccount.vacationRemaining} Tage verfügbar</Typography.Title></div>
      <Typography.Text type="secondary">{personalAccount.vacationUsed} genommen · {personalAccount.vacationEntitlement} Tage gesamt</Typography.Text>
    </Card>}

    <section className="time-entry-section">
      <CrudModule
        createForm={<TimeEntryForm canManageAll={canManageAll} employees={employees} entryTypes={entryTypes} />}
        updateForm={<TimeEntryForm canManageAll={canManageAll} employees={employees} entryTypes={entryTypes} />}
        config={config}
      />
    </section>

    <Modal
      title="Zeitkonto zurücksetzen?"
      open={Boolean(resetEmployee)}
      okText="Backup laden & zurücksetzen"
      cancelText="Abbrechen"
      okButtonProps={{ danger: true }}
      confirmLoading={resetting}
      onOk={resetTimeAccount}
      onCancel={() => !resetting && setResetEmployee(null)}
      closable={!resetting}
      maskClosable={false}
    >
      <Typography.Paragraph>
        Vor dem Zurücksetzen wird automatisch ein CSV-Backup aller vorhandenen Arbeitszeiten von <strong>{resetEmployee?.name} {resetEmployee?.surname}</strong> heruntergeladen.
      </Typography.Paragraph>
      <Typography.Paragraph type="danger">
        Danach werden alle bisherigen Zeiteinträge archiviert sowie Startsaldo und Resturlaub aus dem Vorjahr auf 0 gesetzt. Dieser Vorgang betrifft ausschließlich diesen Mitarbeiter.
      </Typography.Paragraph>
      <Typography.Text strong>Neustart des Zeitkontos ab</Typography.Text>
      <DatePicker value={resetDate} onChange={setResetDate} allowClear={false} format="DD.MM.YYYY" style={{ width: '100%', marginTop: 8 }} />
      <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
        Ab diesem Datum entstehen wieder reguläre Sollstunden. Bei einem Neustart ohne heutige Sollstunden bitte den nächsten Arbeitstag wählen.
      </Typography.Paragraph>
    </Modal>
  </div>;
}
