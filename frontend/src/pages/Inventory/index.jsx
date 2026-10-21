import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert, App, Button, Card, Col, DatePicker, Divider, Empty, Form, Input, InputNumber, Modal,
  Row, Select, Space, Statistic, Switch, Table, Tag, Typography,
} from 'antd';
import { BoxPlotOutlined, CloseOutlined, DownloadOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import request from '@/request/request';
import { enhanceTableColumns } from '@/utils/tableColumns';
import { getCategoryOptions } from '@/utils/categoryHierarchy';

const { Title, Text } = Typography;
const money = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });
const parseDecimal = (value = '') => value.replace(/\s/g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
const decimalInputProps = {
  min: 0,
  precision: 2,
  step: 0.01,
  decimalSeparator: ',',
  parser: parseDecimal,
  style: { width: '100%' },
};
const weightUnits = ['g', 'kg', 'ml', 'l', 'deg', 'tonne'].map((value) => ({ value, label: value }));

export default function Inventory() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articleOpen, setArticleOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySaving, setCategorySaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [tableResetKey, setTableResetKey] = useState(0);
  const [hasTableFilters, setHasTableFilters] = useState(false);
  const [asOf, setAsOf] = useState(dayjs());
  const loadSequence = useRef(0);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [settingsForm] = Form.useForm();
  const purchasePackPrice = Form.useWatch('purchasePackPrice', form);
  const salesPackPrice = Form.useWatch('salesPackPrice', form);
  const packageQuantity = Form.useWatch('packageQuantity', form) || 1;
  const selectedCategory = Form.useWatch('category', form);
  const categoryForArticle = categories.find((item) => item._id === selectedCategory);
  const selectedCategoryTracksStock = categoryForArticle?.trackStock !== false &&
    categoryForArticle?.name?.toLocaleLowerCase('de') !== 'dienstleistung';
  const purchaseUnitPrice = (purchasePackPrice || 0) / packageQuantity;
  const salesUnitPrice = (salesPackPrice || 0) / packageQuantity;
  const margin = salesUnitPrice > 0
    ? ((salesUnitPrice - purchaseUnitPrice) / salesUnitPrice) * 100
    : 0;
  const categoryOptions = useMemo(() => getCategoryOptions(categories), [categories]);

  const load = useCallback(async (date = asOf) => {
    const sequence = ++loadSequence.current;
    setLoading(true);
    try {
      const [snapshot, categoryResult] = await Promise.all([
        request.get({ entity: `inventory/snapshot?asOf=${date.format('YYYY-MM-DD')}` }),
        request.listAll({ entity: 'articlecategory' }),
      ]);

      if (sequence !== loadSequence.current) return;
      if (!snapshot?.success || !categoryResult?.success) {
        message.error('Die Lagerdaten konnten nicht vollständig geladen werden.');
        return;
      }

      setArticles(snapshot.result || []);
      setCategories(categoryResult.result || []);
    } catch {
      if (sequence === loadSequence.current) {
        message.error('Die Lagerdaten konnten nicht geladen werden.');
      }
    } finally {
      if (sequence === loadSequence.current) setLoading(false);
    }
  }, [asOf, message]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => articles.filter((item) =>
    [item.name, item.number, item.supplierNumber, item.material, item.category?.name]
      .some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()))
  ), [articles, search]);

  const saveArticle = async (values) => {
    const quantity = Math.max(Number(values.packageQuantity) || 1, 0.01);
    const payload = {
      ...values,
      category: values.category || null,
      minimumStock: values.minimumStock ?? null,
      packageQuantity: quantity,
      purchasePrice: (Number(values.purchasePackPrice) || 0) / quantity,
      salesPrice: (Number(values.salesPackPrice) || 0) / quantity,
    };
    const result = editing
      ? await request.update({ entity: 'article', id: editing._id, jsonData: payload })
      : await request.create({ entity: 'article', jsonData: payload });
    if (result?.success) { setArticleOpen(false); form.resetFields(); setEditing(null); await load(); }
  };

  const editArticle = async (record) => {
    const response = await request.read({ entity: 'article', id: record._id });
    const current = response?.result || record;
    setEditing(current);
    const quantity = current.packageQuantity || 1;
    form.setFieldsValue({
      ...current,
      category: current.category?._id,
      packageQuantity: quantity,
      purchasePackPrice: current.purchasePackPrice ?? (current.purchasePrice || 0) * quantity,
      salesPackPrice: current.salesPackPrice ?? (current.salesPrice || 0) * quantity,
    });
    setArticleOpen(true);
  };

  const openCategoryCreate = () => {
    categoryForm.resetFields();
    categoryForm.setFieldsValue({ color: '#3287CE', trackStock: true });
    setCategoryOpen(true);
  };

  const addCategory = async (values) => {
    setCategorySaving(true);
    try {
      const result = await request.create({ entity: 'articlecategory', jsonData: values });
      if (result?.success && result.result) {
        const createdCategory = result.result;
        setCategories((current) => [...current, createdCategory]);
        form.setFieldValue('category', createdCategory._id);
        categoryForm.resetFields();
        setCategoryOpen(false);
        message.success('Kategorie wurde angelegt und ausgewählt.');
      }
    } finally {
      setCategorySaving(false);
    }
  };

  const openSettings = async () => {
    const response = await request.get({ entity: 'inventory/settings' });
    if (response?.success) {
      settingsForm.setFieldsValue(response.result || { prefix: 'ART-', nextNumber: 1000 });
      setSettingsOpen(true);
    }
  };

  const saveSettings = async ({ prefix, nextNumber }) => {
    const response = await request.post({
      entity: 'inventory/settings',
      jsonData: { prefix, nextNumber },
    });
    if (response?.success) {
      setSettingsOpen(false);
      message.success('Artikelnummernkreis wurde gespeichert.');
    }
  };

  const exportCsv = () => {
    const rows = [['Stichtag', asOf.format('DD.MM.YYYY')], [], ['Art.-Nr.', 'Name', 'Kategorie', 'Bestand', 'EK-Preis', 'Lagerwert']];
    filtered.forEach((a) => rows.push([a.number, a.name, a.category?.name || '', a.stock, a.purchasePrice || 0, (a.stock || 0) * (a.purchasePrice || 0)]));
    const csv = '\uFEFF' + rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `lagerstand-${asOf.format('YYYY-MM-DD')}.csv`; link.click(); URL.revokeObjectURL(link.href);
    message.success('Lagerstand wurde exportiert');
  };

  const stockValue = articles.reduce((sum, a) => sum + (a.stock || 0) * (a.purchasePrice || 0), 0);
  const lowStockArticles = articles.filter((article) =>
    article.trackStock !== false &&
    article.minimumStock != null &&
    Number(article.stock || 0) < Number(article.minimumStock)
  );
  const columns = [
    { title: 'Art.-Nr.', dataIndex: 'number', width: 130, render: (v) => <Text strong>{v}</Text> },
    { title: 'Artikel', dataIndex: 'name', render: (v, r) => <div><Text strong>{v}</Text><br /><Text type="secondary">{[r.material, r.weight != null ? `${Number(r.weight).toLocaleString('de-AT', { maximumFractionDigits: 2 })} ${r.weightUnit || 'kg'}` : null, r.packageQuantity > 1 ? `${r.packageQuantity}er-Pack` : null].filter(Boolean).join(' · ') || '—'}</Text></div> },
    { title: 'Kategorie', dataIndex: 'category', filterValue: (record) => record.category?.name, render: (v) => v ? <Tag color={v.color}>{v.name}</Tag> : '—' },
    { title: 'Lieferanten-Nr.', dataIndex: 'supplierNumber', render: (v) => v || '—' },
    { title: 'Bestand', dataIndex: 'stock', align: 'right', render: (v, record) => record.trackStock === false ? <Tag>Keine Lagerführung</Tag> : <div><Tag color={record.minimumStock != null && Number(v || 0) < Number(record.minimumStock) ? '#C8424C' : Number(v || 0) < 5 ? '#C58A22' : '#168568'}>{v || 0} Stk.</Tag>{record.minimumStock != null && <><br /><Text type="secondary">Meldebestand: {record.minimumStock}</Text></>}</div> },
    { title: 'EK / VK je Einheit', dataIndex: 'salesPrice', filterValue: (record) => `${record.purchasePrice || 0} ${record.salesPrice || 0}`, align: 'right', render: (_, r) => <>{money.format(r.purchasePrice || 0)}<br /><Text strong>{money.format(r.salesPrice || 0)}</Text>{r.packageQuantity > 1 && <><br /><Text type="secondary">Pack: {money.format(r.salesPackPrice || 0)}</Text></>}</> },
    { title: 'Marge', dataIndex: 'margin', align: 'right', render: (v) => `${Number(v || 0).toFixed(1)} %` },
    { title: '', width: 90, render: (_, r) => <Button type="link" onClick={() => editArticle(r)}>Bearbeiten</Button> },
  ];

  return <div className="inventory-page">
    <div className="inventory-hero">
      <div><Text className="eyebrow">WARENWIRTSCHAFT</Text><Title level={2}>Artikel & Lager</Title><Text type="secondary">Bestände einfach pflegen, nachvollziehen und zum Stichtag auswerten.</Text></div>
      <Space wrap><Button icon={<SettingOutlined />} onClick={openSettings}>Nummernkreis</Button><Button onClick={() => navigate('/inventory/categories')}>Kategorien</Button><Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); form.setFieldsValue({ weightUnit: 'kg', packageQuantity: 1, purchasePackPrice: 0, salesPackPrice: 0 }); setArticleOpen(true); }}>Neuer Artikel</Button></Space>
    </div>
    {lowStockArticles.length > 0 && <Alert
      className="inventory-stock-alert"
      type="warning"
      showIcon
      message={`${lowStockArticles.length} ${lowStockArticles.length === 1 ? 'Artikel hat' : 'Artikel haben'} den Meldebestand unterschritten`}
      description={<Space wrap size={[8, 8]}>{lowStockArticles.map((article) => <Tag color="orange" key={article._id}>{article.number} · {article.name}: {Number(article.stock || 0)} / {Number(article.minimumStock)} Stk.</Tag>)}</Space>}
    />}
    <Row gutter={[16, 16]} className="inventory-stats">
      <Col xs={24} md={8}><Card><Statistic title="Artikel" value={articles.length} prefix={<BoxPlotOutlined />} /></Card></Col>
      <Col xs={24} md={8}><Card><Statistic title="Gesamtbestand" value={articles.reduce((s, a) => s + (a.stock || 0), 0)} suffix="Stk." /></Card></Col>
      <Col xs={24} md={8}><Card><Statistic title="Lagerwert (EK)" value={stockValue} precision={2} suffix="€" /></Card></Col>
    </Row>
    <Card className="inventory-table-card" bordered={false}>
      <div className="inventory-toolbar"><Input.Search allowClear value={search} placeholder="Artikel, Nummer, Material …" onChange={(e) => setSearch(e.target.value)} /><Space><DatePicker value={asOf} onChange={(value) => setAsOf(value || dayjs())} /><Button icon={<DownloadOutlined />} onClick={exportCsv}>Stichtag exportieren</Button></Space></div>
      {(hasTableFilters || search) && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}><Button type="text" danger icon={<CloseOutlined />} onClick={() => { setSearch(''); setHasTableFilters(false); setTableResetKey((key) => key + 1); }}>Alle Filter löschen</Button></div>}
      <Table key={tableResetKey} rowKey="_id" loading={loading} dataSource={filtered} columns={enhanceTableColumns(columns)} pagination={{ pageSize: 10 }} onChange={(_, filters, sorter) => setHasTableFilters(Object.values(filters || {}).some((value) => value?.length) || Boolean(sorter?.order))} locale={{ emptyText: <Empty description="Noch keine Artikel angelegt" /> }} />
    </Card>
    <Modal title={editing ? 'Artikel bearbeiten' : 'Neuen Artikel anlegen'} open={articleOpen} onCancel={() => setArticleOpen(false)} onOk={() => form.submit()} width={820} okText="Speichern" cancelText="Abbrechen">
      <Form form={form} layout="vertical" onFinish={saveArticle}><Row gutter={16}>
        <Col span={16}><Form.Item name="name" label="Name" rules={[{ required: true }]}><Input placeholder="z. B. Fenstergriff Edelstahl" /></Form.Item></Col>
        <Col span={8}><Form.Item name="number" label="Unsere Art.-Nr."><Input placeholder="wird automatisch vergeben" disabled={!editing} /></Form.Item></Col>
        <Col span={8}><Form.Item name="supplierNumber" label="Art.-Nr. (Lieferant)"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item name="category" label="Kategorie"><Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="Kategorie auswählen"
          options={categoryOptions}
          dropdownRender={(menu) => <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Button type="text" icon={<PlusOutlined />} block onClick={openCategoryCreate}>
              Neue Kategorie anlegen
            </Button>
          </>}
        /></Form.Item></Col>
        <Col span={8}><Form.Item name="material" label="Material"><Input /></Form.Item></Col>
        <Col span={8}><Form.Item name="weight" label="Gewicht / Inhalt"><InputNumber {...decimalInputProps} addonAfter={<Form.Item name="weightUnit" noStyle><Select style={{ width: 82 }} options={weightUnits} /></Form.Item>} /></Form.Item></Col>
        {['length','width','height','depth'].map((key) => <Col span={8} key={key}><Form.Item name={key} label={({length:'Länge (mm)',width:'Breite (mm)',height:'Höhe (mm)',depth:'Tiefe (mm)'})[key]}><InputNumber {...decimalInputProps} /></Form.Item></Col>)}
        <Col span={8}><Form.Item name="packageQuantity" label="Inhalt pro Set / Packung" tooltip="Zum Beispiel 100 bei einer 100er-Packung Schrauben"><InputNumber {...decimalInputProps} min={0.01} addonAfter="Stk." /></Form.Item></Col>
        <Col span={8}><Form.Item name="purchasePackPrice" label="EK-Preis Set / Packung"><InputNumber {...decimalInputProps} addonAfter="€" /></Form.Item></Col>
        <Col span={8}><Form.Item name="salesPackPrice" label="VK-Preis Set / Packung"><InputNumber {...decimalInputProps} addonAfter="€" /></Form.Item></Col>
        <Col span={8}><Form.Item label="EK je Einheit"><Input value={money.format(purchaseUnitPrice)} readOnly /></Form.Item></Col>
        <Col span={8}><Form.Item label="VK je Einheit"><Input value={money.format(salesUnitPrice)} readOnly /></Form.Item></Col>
        <Col span={8}><Form.Item label="Marge"><Input value={`${margin.toFixed(1)} %`} readOnly /></Form.Item></Col>
        {selectedCategoryTracksStock && <Col span={8}><Form.Item name="stock" label={editing ? 'Aktueller Lagerstand' : 'Anfangsbestand'}><InputNumber style={{ width:'100%' }} /></Form.Item></Col>}
        {selectedCategoryTracksStock && <Col span={8}><Form.Item name="minimumStock" label="Meldebestand" tooltip="Bei Unterschreitung erscheint oben im Lager eine Warnung."><InputNumber min={0} style={{ width:'100%' }} placeholder="Optional" addonAfter="Stk." /></Form.Item></Col>}
        {selectedCategoryTracksStock && <Col span={8}><Form.Item name="stockNote" label="Notiz zur Bestandsänderung"><Input placeholder="z. B. Inventur, Wareneingang" /></Form.Item></Col>}
      </Row></Form>
    </Modal>
    <Modal title="Kategorie anlegen" open={categoryOpen} onCancel={() => setCategoryOpen(false)} onOk={() => categoryForm.submit()} okText="Anlegen" cancelText="Abbrechen" confirmLoading={categorySaving}><Form form={categoryForm} layout="vertical" onFinish={addCategory}><Form.Item name="name" label="Bezeichnung" rules={[{ required: true, message: 'Bitte eine Bezeichnung eingeben.' }]}><Input placeholder="z. B. Rollladenwelle" autoFocus /></Form.Item><Form.Item name="parent" label="Überkategorie"><Select allowClear showSearch optionFilterProp="label" placeholder="Keine (Hauptkategorie)" options={categoryOptions} /></Form.Item><Form.Item name="color" label="Farbe"><Input type="color" /></Form.Item><Form.Item name="trackStock" label="Lagerbestand führen" valuePropName="checked"><Switch checkedChildren="Ja" unCheckedChildren="Nein" /></Form.Item></Form></Modal>
    <Modal title="Artikelnummern" open={settingsOpen} onCancel={() => setSettingsOpen(false)} onOk={() => settingsForm.submit()} okText="Speichern"><Form form={settingsForm} layout="vertical" onFinish={saveSettings}><Form.Item name="prefix" label="Präfix / Starttext" rules={[{required:true}]}><Input placeholder="ART-" /></Form.Item><Form.Item name="nextNumber" label="Nächste fortlaufende Nummer" rules={[{required:true}]}><InputNumber min={1} style={{width:'100%'}} /></Form.Item></Form></Modal>
  </div>;
}
