import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, TagsOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import request from '@/request/request';
import {
  categoryId,
  getCategoryDescendantIds,
  getCategoryOptions,
  sortCategoriesByHierarchy,
} from '@/utils/categoryHierarchy';

const { Title, Text } = Typography;
const money = new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' });

export default function InventoryCategories() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [asOf, setAsOf] = useState(dayjs());
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [snapshot, categoryResult] = await Promise.all([
        request.get({ entity: `inventory/snapshot?asOf=${asOf.format('YYYY-MM-DD')}` }),
        request.listAll({ entity: 'articlecategory' }),
      ]);
      if (!snapshot?.success || !categoryResult?.success) {
        message.error('Die Kategorien konnten nicht vollständig geladen werden.');
        return;
      }
      setArticles(snapshot.result || []);
      setCategories(categoryResult.result || []);
    } catch {
      message.error('Die Kategorien konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, [asOf, message]);

  useEffect(() => {
    load();
  }, [load]);

  const rows = useMemo(() => {
    const categoryRows = sortCategoriesByHierarchy(categories).map((category) => {
      const categoryArticles = articles.filter(
        (article) => String(article.category?._id || article.category || '') === String(category._id)
      );
      const trackedArticles = categoryArticles.filter((article) => article.trackStock !== false);
      return {
        ...category,
        key: category._id,
        articles: categoryArticles,
        articleCount: categoryArticles.length,
        totalStock: trackedArticles.reduce((sum, article) => sum + Number(article.stock || 0), 0),
        stockValue: trackedArticles.reduce(
          (sum, article) => sum + Number(article.stock || 0) * Number(article.purchasePrice || 0),
          0
        ),
      };
    });

    const uncategorized = articles.filter((article) => !article.category?._id && !article.category);
    if (uncategorized.length) {
      categoryRows.push({
        key: 'uncategorized',
        name: 'Ohne Kategorie',
        color: 'default',
        trackStock: true,
        virtual: true,
        articles: uncategorized,
        articleCount: uncategorized.length,
        totalStock: uncategorized.reduce((sum, article) => sum + Number(article.stock || 0), 0),
        stockValue: uncategorized.reduce(
          (sum, article) => sum + Number(article.stock || 0) * Number(article.purchasePrice || 0),
          0
        ),
      });
    }
    return categoryRows;
  }, [articles, categories]);

  const unavailableParentIds = useMemo(() => {
    if (!editing) return new Set();
    return new Set([
      categoryId(editing),
      ...getCategoryDescendantIds(editing, categories),
    ]);
  }, [categories, editing]);
  const parentOptions = useMemo(
    () => getCategoryOptions(categories, unavailableParentIds),
    [categories, unavailableParentIds]
  );

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ color: '#3287CE', trackStock: true });
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    form.setFieldsValue({
      name: category.name,
      parent: categoryId(category.parent) || undefined,
      description: category.description,
      color: category.color || '#3287CE',
      trackStock: category.trackStock !== false,
    });
    setModalOpen(true);
  };

  const saveCategory = async (values) => {
    const payload = { ...values, parent: values.parent || null };
    const result = editing
      ? await request.update({ entity: 'articlecategory', id: editing._id, jsonData: payload })
      : await request.create({ entity: 'articlecategory', jsonData: payload });
    if (result?.success) {
      message.success(editing ? 'Kategorie wurde gespeichert.' : 'Kategorie wurde angelegt.');
      setModalOpen(false);
      form.resetFields();
      setEditing(null);
      await load();
    }
  };

  const articleColumns = [
    { title: 'Art.-Nr.', dataIndex: 'number', width: 140, render: (value) => value || '—' },
    { title: 'Artikel', dataIndex: 'name', render: (value) => <Text strong>{value}</Text> },
    {
      title: 'Bestand',
      dataIndex: 'stock',
      align: 'right',
      render: (value, article) => article.trackStock === false
        ? <Tag>Keine Lagerführung</Tag>
        : <Tag color={Number(value) <= 0 ? '#C8424C' : Number(value) < 5 ? '#C58A22' : '#168568'}>{Number(value || 0)} Stk.</Tag>,
    },
    {
      title: 'Lagerwert (EK)',
      align: 'right',
      render: (_, article) => article.trackStock === false
        ? '—'
        : money.format(Number(article.stock || 0) * Number(article.purchasePrice || 0)),
    },
  ];

  const columns = [
    {
      title: 'Kategorie',
      dataIndex: 'name',
      render: (name, category) => (
        <Space direction="vertical" size={2}>
          <div style={{ paddingLeft: category.hierarchyDepth * 24 }}>
            <Tag color={category.color}>{category.hierarchyDepth > 0 ? '↳ ' : ''}{name}</Tag>
          </div>
          {category.description && <Text type="secondary">{category.description}</Text>}
        </Space>
      ),
    },
    {
      title: 'Überkategorie',
      dataIndex: 'parent',
      width: 180,
      render: (parent) => parent?.name || categories.find((item) => categoryId(item) === categoryId(parent))?.name || '—',
    },
    { title: 'Artikel', dataIndex: 'articleCount', align: 'right', width: 110 },
    {
      title: 'Lagerführung',
      dataIndex: 'trackStock',
      width: 150,
      render: (value) => <Tag color={value === false ? 'default' : '#12559B'}>{value === false ? 'Nein' : 'Ja'}</Tag>,
    },
    {
      title: 'Gesamtbestand',
      dataIndex: 'totalStock',
      align: 'right',
      width: 150,
      render: (value, category) => category.trackStock === false ? '—' : `${Number(value || 0)} Stk.`,
    },
    {
      title: 'Lagerwert (EK)',
      dataIndex: 'stockValue',
      align: 'right',
      width: 160,
      render: (value, category) => category.trackStock === false ? '—' : money.format(value || 0),
    },
    {
      title: '',
      width: 110,
      render: (_, category) => category.virtual
        ? null
        : <Button type="link" onClick={() => openEdit(category)}>Bearbeiten</Button>,
    },
  ];

  return (
    <div className="inventory-page inventory-categories-page">
      <div className="inventory-hero">
        <div>
          <Text className="eyebrow">WARENWIRTSCHAFT</Text>
          <Title level={2}>Lagerkategorien</Title>
          <Text type="secondary">Kategorien, zugeordnete Artikel und Bestände auf einen Blick.</Text>
        </div>
        <Space wrap>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/inventory')}>Zurück zum Lager</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Neue Kategorie</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="inventory-stats">
        <Col xs={24} md={8}><Card><Statistic title="Kategorien" value={categories.length} prefix={<TagsOutlined />} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Zugeordnete Artikel" value={articles.filter((article) => article.category).length} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Artikel ohne Kategorie" value={articles.filter((article) => !article.category).length} /></Card></Col>
      </Row>

      <Card className="inventory-table-card" bordered={false}>
        <div className="inventory-toolbar inventory-category-toolbar">
          <Text type="secondary">Zeile aufklappen, um die zugehörigen Artikel zu sehen.</Text>
          <Space><Text type="secondary">Bestand zum</Text><DatePicker value={asOf} onChange={(value) => setAsOf(value || dayjs())} /></Space>
        </div>
        <Table
          rowKey="key"
          loading={loading}
          dataSource={rows}
          columns={columns}
          pagination={false}
          expandable={{
            rowExpandable: (record) => record.articles.length > 0,
            expandedRowRender: (record) => (
              <Table
                rowKey="_id"
                size="small"
                columns={articleColumns}
                dataSource={record.articles}
                pagination={false}
              />
            ),
          }}
          locale={{ emptyText: <Empty description="Noch keine Kategorien angelegt" /> }}
        />
      </Card>

      <Modal
        title={editing ? 'Kategorie bearbeiten' : 'Kategorie anlegen'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Speichern"
        cancelText="Abbrechen"
      >
        <Form form={form} layout="vertical" onFinish={saveCategory}>
          <Form.Item name="name" label="Bezeichnung" rules={[{ required: true, message: 'Bitte eine Bezeichnung eingeben.' }]}>
            <Input placeholder="z. B. Fenster oder Dienstleistung" />
          </Form.Item>
          <Form.Item name="description" label="Beschreibung">
            <Input.TextArea rows={3} placeholder="Optionaler Hinweis zur Kategorie" />
          </Form.Item>
          <Form.Item name="parent" label="Überkategorie">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Keine (Hauptkategorie)"
              options={parentOptions}
            />
          </Form.Item>
          <Form.Item name="color" label="Farbe">
            <Input type="color" />
          </Form.Item>
          <Form.Item name="trackStock" label="Lagerbestand führen" valuePropName="checked">
            <Switch checkedChildren="Ja" unCheckedChildren="Nein" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
