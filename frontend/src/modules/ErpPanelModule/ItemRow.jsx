import { useEffect, useState } from 'react';
import { Alert, AutoComplete, Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';
import calculate from '@/utils/calculate';
import useLanguage from '@/locale/useLanguage';
import request from '@/request/request';
import { getCategoryOptions } from '@/utils/categoryHierarchy';
import { htmlToPlainText } from '@/utils/plainText';

const normalize = (value) => String(value || '').toLocaleLowerCase('de').trim();

export default function ItemRow({ field, remove }) {
  const translate = useLanguage();
  const money = useMoney();
  const form = Form.useFormInstance();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [creatingArticle, setCreatingArticle] = useState(false);
  const [quickForm] = Form.useForm();
  const quantity = Form.useWatch(['items', field.name, 'quantity'], form) || 0;
  const price = Form.useWatch(['items', field.name, 'price'], form) || 0;
  const discount = Form.useWatch(['items', field.name, 'discount'], form) || 0;
  const selectedArticleId = Form.useWatch(['items', field.name, 'article'], form);
  const invoiceItems = Form.useWatch('items', form) || [];
  const displayedPrice = calculate.round(price);
  const total = calculate.multiply(calculate.multiply(displayedPrice, quantity), 1 - discount / 100);
  const parseMoney = (value = '') => String(value)
    .replaceAll(money.thousand_sep || '.', '')
    .replace(money.decimal_sep || ',', '.')
    .replace(/[^0-9.-]/g, '');
  const selectedArticle = articles.find((article) => article._id === selectedArticleId);
  const requestedQuantity = invoiceItems.reduce(
    (sum, item) => String(item?.article || '') === String(selectedArticleId || '')
      ? sum + Number(item?.quantity || 0)
      : sum,
    0
  );
  const articleTracksStock = selectedArticle &&
    selectedArticle.category?.trackStock !== false &&
    selectedArticle.category?.name?.toLocaleLowerCase('de') !== 'dienstleistung';
  const insufficientStock = articleTracksStock && requestedQuantity > Number(selectedArticle.stock || 0);

  useEffect(() => {
    form.setFieldValue(['items', field.name, 'total'], total);
  }, [form, field.name, total]);

  useEffect(() => {
    Promise.all([
      request.listAll({ entity: 'article' }),
      request.listAll({ entity: 'articlecategory' }),
    ]).then(([articleResponse, categoryResponse]) => {
      setArticles(articleResponse?.result || []);
      setCategories(categoryResponse?.result || []);
    });
  }, []);

  const applyArticle = (article) => {
    if (!article) return;
    const path = ['items', field.name];
    form.setFieldValue([...path, 'article'], article._id);
    form.setFieldValue([...path, 'itemName'], article.name);
    form.setFieldValue([...path, 'description'], [article.number, article.material].filter(Boolean).join(' · '));
    form.setFieldValue([...path, 'price'], calculate.round(article.salesPrice || 0));
    form.setFieldValue([...path, 'unit'], 'Stk.');
  };

  const selectArticle = (_, option) => {
    if (option.createArticle) {
      quickForm.setFieldsValue({ name: searchText, salesPrice: price || undefined });
      setQuickCreateOpen(true);
      return;
    }
    applyArticle(articles.find((item) => item._id === option.articleId));
  };

  const query = normalize(searchText);
  const matchingArticles = articles
    .map((article) => {
      const name = normalize(article.name);
      const searchable = normalize([article.number, article.name, article.material, article.supplierNumber].join(' '));
      const score = name === query ? 0 : name.startsWith(query) ? 1 : searchable.includes(query) ? 2 : 3;
      return { article, score };
    })
    .filter(({ score }) => !query || score < 3)
    .sort((a, b) => a.score - b.score)
    .slice(0, 8)
    .map(({ article }) => ({
      value: article.name,
      articleId: article._id,
      label: `${article.number} · ${article.name}${article.material ? ` · ${article.material}` : ''} (${article.stock || 0} Stk.)`,
    }));

  const hasExactMatch = articles.some((article) => normalize(article.name) === query);
  const articleOptions = [
    ...matchingArticles,
    ...(query && !hasExactMatch ? [{
      value: `+ ${searchText}`,
      createArticle: true,
      label: <span><PlusOutlined /> <strong>„{searchText}“ als Artikel anlegen</strong></span>,
    }] : []),
  ];

  const createArticle = async (values) => {
    setCreatingArticle(true);
    const response = await request.create({
      entity: 'article',
      jsonData: { ...values, stock: 0, purchasePrice: values.purchasePrice || 0 },
    });
    setCreatingArticle(false);
    if (!response?.success) return;
    const article = response.result;
    setArticles((current) => [...current, article]);
    applyArticle(article);
    setSearchText(article.name);
    setQuickCreateOpen(false);
    quickForm.resetFields();
  };

  return (
    <div className="invoice-line">
      <Row gutter={[10, 4]} align="top">
        <Col xs={24} lg={7}>
          <Form.Item name={[field.name, 'article']} hidden><Input /></Form.Item>
          <Form.Item name={[field.name, 'itemName']} rules={[{ required: true, message: translate('Missing itemName name') }]}>
            <AutoComplete placeholder="Artikel oder freie Beschreibung eingeben" options={articleOptions} onSearch={setSearchText} onSelect={selectArticle} filterOption={false} />
          </Form.Item>
        </Col>
        <Col xs={8} lg={3}><Form.Item name={[field.name, 'quantity']} rules={[{ required: true }]} initialValue={1}><InputNumber aria-label="Menge" min={0} style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={8} lg={3}><Form.Item name={[field.name, 'unit']} initialValue="Stk."><Select aria-label="Einheit" options={['Stk.', 'Std.', 'm', 'm²', 'lfm', 'kg', 'Pauschal'].map((value) => ({ value, label: value }))} /></Form.Item></Col>
        <Col xs={8} lg={3}><Form.Item name={[field.name, 'price']} rules={[{ required: true }]}><InputNumber aria-label="Preis" min={0} precision={2} controls={false} className="moneyInput" addonAfter={money.currency_symbol} decimalSeparator={money.decimal_sep || ','} formatter={(value) => value === '' || value == null ? '' : money.amountFormatter({ amount: value })} parser={parseMoney} /></Form.Item></Col>
        <Col xs={10} lg={3}><Form.Item name={[field.name, 'discount']} initialValue={0}><InputNumber aria-label="Rabatt" min={0} max={100} addonAfter="%" style={{ width: '100%' }} /></Form.Item></Col>
        <Col xs={12} lg={4}><Form.Item name={[field.name, 'total']}><InputNumber aria-label="Gesamt" readOnly precision={2} controls={false} className="moneyInput" addonAfter={money.currency_symbol} decimalSeparator={money.decimal_sep || ','} formatter={(value) => money.amountFormatter({ amount: value || 0 })} parser={parseMoney} /></Form.Item></Col>
        <Col xs={2} lg={1}><Button type="text" danger aria-label="Position löschen" icon={<DeleteOutlined />} onClick={() => remove(field.name)} /></Col>
      </Row>
      {insufficientStock && (
        <Alert
          className="invoice-stock-warning"
          type="error"
          showIcon
          message={`Nicht genügend Bestand: ${selectedArticle.name}`}
          description={`Benötigt: ${requestedQuantity} Stk. · Verfügbar: ${Number(selectedArticle.stock || 0)} Stk.`}
          action={(
            <Link to={`/inventory?search=${encodeURIComponent(selectedArticle.number || selectedArticle.name)}`}>
              Artikel im Lager öffnen
            </Link>
          )}
        />
      )}
      <Form.Item
        name={[field.name, 'description']}
        className="invoice-description-editor"
        getValueProps={(value) => ({ value: htmlToPlainText(value) })}
      >
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 8 }} placeholder="Beschreibungstext, Leistungsumfang oder zusätzliche Hinweise …" />
      </Form.Item>
      <Modal title="Artikel schnell anlegen" open={quickCreateOpen} onCancel={() => { setQuickCreateOpen(false); quickForm.resetFields(); }} onOk={() => quickForm.submit()} okText="Anlegen und übernehmen" cancelText="Abbrechen" confirmLoading={creatingArticle} destroyOnClose>
        <Form form={quickForm} layout="vertical" onFinish={createArticle} preserve={false}>
          <Form.Item name="name" label="Artikelbezeichnung" rules={[{ required: true, whitespace: true, message: 'Bitte eine Bezeichnung eingeben' }]}><Input autoFocus /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="salesPrice" label="Verkaufspreis" rules={[{ required: true, message: 'Bitte einen Verkaufspreis eingeben' }]}><InputNumber min={0} precision={2} addonAfter={money.currency_symbol} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="purchasePrice" label="Einkaufspreis"><InputNumber min={0} precision={2} addonAfter={money.currency_symbol} style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Form.Item name="material" label="Kurzbeschreibung / Material"><Input placeholder="Optional" /></Form.Item>
          <Form.Item name="category" label="Kategorie">
            <Select
              allowClear
              placeholder="z. B. Dienstleistung"
              options={getCategoryOptions(categories)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
