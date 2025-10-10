import React, { useState, useMemo } from 'react';
import useLanguage from '@/locale/useLanguage';
import { Switch, Table, Tag, Button, Space, Input, Select, DatePicker, Card, Statistic, Row, Col, Modal, Form, InputNumber, Popconfirm, message } from 'antd';
import { CloseOutlined, CheckOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, SyncOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule/CrudModule';
import TaxForm from '@/forms/TaxForm';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Multi-language translations
const translations = {
  en: {
    taxes: 'Taxes',
    taxes_list: 'Taxes List',
    add_new_tax: 'Add New Tax',
    name: 'Name',
    value: 'Value',
    default: 'Default',
    enabled: 'Enabled',
    status: 'Status',
    actions: 'Actions',
    search: 'Search',
    filter: 'Filter',
    active: 'Active',
    inactive: 'Inactive',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    export: 'Export',
    refresh: 'Refresh',
    apply: 'Apply',
    reset: 'Reset',
    created_date: 'Created Date',
    updated_date: 'Updated Date',
    description: 'Description',
    tax_type: 'Tax Type',
    percentage: 'Percentage',
    fixed_amount: 'Fixed Amount',
    compound: 'Compound',
    priority: 'Priority',
    region: 'Region',
    total_taxes: 'Total Taxes',
    active_taxes: 'Active Taxes',
    default_taxes: 'Default Taxes',
    total_tax_value: 'Total Tax Value',
    add_tax: 'Add Tax',
    bulk_actions: 'Bulk Actions',
    delete_selected: 'Delete Selected',
    enable_selected: 'Enable Selected',
    disable_selected: 'Disable Selected',
    are_you_sure: 'Are you sure?',
    yes: 'Yes',
    no: 'No',
    success: 'Success',
    error: 'Error',
    tax_created: 'Tax created successfully',
    tax_updated: 'Tax updated successfully',
    tax_deleted: 'Tax deleted successfully',
    select_all: 'Select All',
    clear_all: 'Clear All',
  },
  es: {
    taxes: 'Impuestos',
    taxes_list: 'Lista de Impuestos',
    add_new_tax: 'Agregar Nuevo Impuesto',
    name: 'Nombre',
    value: 'Valor',
    default: 'Por Defecto',
    enabled: 'Habilitado',
    status: 'Estado',
    actions: 'Acciones',
    search: 'Buscar',
    filter: 'Filtrar',
    active: 'Activo',
    inactive: 'Inactivo',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    export: 'Exportar',
    refresh: 'Actualizar',
    apply: 'Aplicar',
    reset: 'Reiniciar',
    created_date: 'Fecha de Creación',
    updated_date: 'Fecha de Actualización',
    description: 'Descripción',
    tax_type: 'Tipo de Impuesto',
    percentage: 'Porcentaje',
    fixed_amount: 'Monto Fijo',
    compound: 'Compuesto',
    priority: 'Prioridad',
    region: 'Región',
    total_taxes: 'Total de Impuestos',
    active_taxes: 'Impuestos Activos',
    default_taxes: 'Impuestos por Defecto',
    total_tax_value: 'Valor Total de Impuestos',
    add_tax: 'Agregar Impuesto',
    bulk_actions: 'Acciones Masivas',
    delete_selected: 'Eliminar Seleccionados',
    enable_selected: 'Habilitar Seleccionados',
    disable_selected: 'Deshabilitar Seleccionados',
    are_you_sure: '¿Estás seguro?',
    yes: 'Sí',
    no: 'No',
    success: 'Éxito',
    error: 'Error',
    tax_created: 'Impuesto creado exitosamente',
    tax_updated: 'Impuesto actualizado exitosamente',
    tax_deleted: 'Impuesto eliminado exitosamente',
    select_all: 'Seleccionar Todos',
    clear_all: 'Limpiar Todos',
  },
  fr: {
    taxes: 'Taxes',
    taxes_list: 'Liste des Taxes',
    add_new_tax: 'Ajouter une Nouvelle Taxe',
    name: 'Nom',
    value: 'Valeur',
    default: 'Défaut',
    enabled: 'Activé',
    status: 'Statut',
    actions: 'Actions',
    search: 'Rechercher',
    filter: 'Filtrer',
    active: 'Actif',
    inactive: 'Inactif',
    edit: 'Modifier',
    delete: 'Supprimer',
    view: 'Voir',
    export: 'Exporter',
    refresh: 'Rafraîchir',
    apply: 'Appliquer',
    reset: 'Réinitialiser',
    created_date: 'Date de Création',
    updated_date: 'Date de Mise à Jour',
    description: 'Description',
    tax_type: 'Type de Taxe',
    percentage: 'Pourcentage',
    fixed_amount: 'Montant Fixe',
    compound: 'Composé',
    priority: 'Priorité',
    region: 'Région',
    total_taxes: 'Total des Taxes',
    active_taxes: 'Taxes Actives',
    default_taxes: 'Taxes par Défaut',
    total_tax_value: 'Valeur Totale des Taxes',
    add_tax: 'Ajouter une Taxe',
    bulk_actions: 'Actions en Masse',
    delete_selected: 'Supprimer la Sélection',
    enable_selected: 'Activer la Sélection',
    disable_selected: 'Désactiver la Sélection',
    are_you_sure: 'Êtes-vous sûr?',
    yes: 'Oui',
    no: 'Non',
    success: 'Succès',
    error: 'Erreur',
    tax_created: 'Taxe créée avec succès',
    tax_updated: 'Taxe mise à jour avec succès',
    tax_deleted: 'Taxe supprimée avec succès',
    select_all: 'Tout Sélectionner',
    clear_all: 'Tout Effacer',
  }
};

// Currency configurations
const currencies = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
};

export default function Taxes() {
  const defaultTranslate = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewTaxData, setViewTaxData] = useState(null);

  const translate = useMemo(() => {
    return (key) => translations[currentLanguage]?.[key] || translations.en[key] || key;
  }, [currentLanguage]);

  const entity = 'taxes';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const deleteModalLabels = ['name'];

  const readColumns = [
    {
      title: translate('name'),
      dataIndex: 'taxName',
    },
    {
      title: translate('value'),
      dataIndex: 'taxValue',
    },
    {
      title: translate('default'),
      dataIndex: 'isDefault',
    },
    {
      title: translate('enabled'),
      dataIndex: 'enabled',
    },
  ];

  const handleView = (record) => {
    setViewTaxData(record);
    setIsModalVisible(true);
  };

  const handleBulkAction = () => {
    if (bulkAction === 'delete' && selectedRows.length > 0) {
      message.success(`${translate('success')}: ${selectedRows.length} ${translate('taxes')} ${translate('delete_selected').toLowerCase()}`);
      setSelectedRows([]);
    } else if (bulkAction === 'enable' && selectedRows.length > 0) {
      message.success(`${translate('success')}: ${selectedRows.length} ${translate('taxes')} ${translate('enable_selected').toLowerCase()}`);
      setSelectedRows([]);
    } else if (bulkAction === 'disable' && selectedRows.length > 0) {
      message.success(`${translate('success')}: ${selectedRows.length} ${translate('taxes')} ${translate('disable_selected').toLowerCase()}`);
      setSelectedRows([]);
    }
    setBulkAction('');
  };

  const dataTableColumns = [
    {
      title: translate('name'),
      dataIndex: 'taxName',
      sorter: (a, b) => a.taxName.localeCompare(b.taxName),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: translate('value'),
      dataIndex: 'taxValue',
      sorter: (a, b) => a.taxValue - b.taxValue,
      render: (value, record) => (
        <Tag color={value > 20 ? 'red' : value > 10 ? 'orange' : 'green'}>
          {value}%
        </Tag>
      ),
    },
    {
      title: translate('tax_type'),
      dataIndex: 'taxType',
      render: (type) => (
        <Tag color={type === 'percentage' ? 'blue' : 'purple'}>
          {type === 'percentage' ? translate('percentage') : translate('fixed_amount')}
        </Tag>
      ),
      filters: [
        { text: translate('percentage'), value: 'percentage' },
        { text: translate('fixed_amount'), value: 'fixed_amount' },
      ],
      onFilter: (value, record) => record.taxType === value,
    },
    {
      title: translate('default'),
      dataIndex: 'isDefault',
      render: (isDefault) => (
        <Tag color={isDefault ? 'green' : 'default'}>
          {isDefault ? translate('yes') : translate('no')}
        </Tag>
      ),
    },
    {
      title: translate('enabled'),
      dataIndex: 'enabled',
      render: (enabled, record) => (
        <Switch
          checked={enabled}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked) => message.info(`${record.taxName} ${checked ? translate('enabled') : translate('disabled')}`)}
        />
      ),
    },
    {
      title: translate('status'),
      dataIndex: 'enabled',
      render: (enabled) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? translate('active') : translate('inactive')}
        </Tag>
      ),
      filters: [
        { text: translate('active'), value: true },
        { text: translate('inactive'), value: false },
      ],
      onFilter: (value, record) => record.enabled === value,
    },
    {
      title: translate('region'),
      dataIndex: 'region',
      render: (region) => region || 'Global',
    },
    {
      title: translate('created_date'),
      dataIndex: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: translate('actions'),
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
            size="small"
          >
            {translate('view')}
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            size="small"
          >
            {translate('edit')}
          </Button>
          <Popconfirm
            title={`${translate('are_you_sure')} ${translate('delete')}?`}
            onConfirm={() => message.success(translate('tax_deleted'))}
            okText={translate('yes')}
            cancelText={translate('no')}
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              {translate('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('taxes'),
    DATATABLE_TITLE: translate('taxes_list'),
    ADD_NEW_ENTITY: translate('add_new_tax'),
    ENTITY_NAME: translate('taxes'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  // Sample data for demonstration
  const sampleTaxData = [
    {
      key: '1',
      taxName: 'VAT',
      taxValue: 20,
      taxType: 'percentage',
      isDefault: true,
      enabled: true,
      region: 'Europe',
      createdAt: '2024-01-15',
      description: 'Value Added Tax'
    },
    {
      key: '2',
      taxName: 'GST',
      taxValue: 18,
      taxType: 'percentage',
      isDefault: false,
      enabled: true,
      region: 'India',
      createdAt: '2024-01-10',
      description: 'Goods and Services Tax'
    },
    {
      key: '3',
      taxName: 'Sales Tax',
      taxValue: 8,
      taxType: 'percentage',
      isDefault: false,
      enabled: true,
      region: 'USA',
      createdAt: '2024-01-05',
      description: 'State Sales Tax'
    },
    {
      key: '4',
      taxName: 'Fixed Tax',
      taxValue: 5,
      taxType: 'fixed_amount',
      isDefault: false,
      enabled: false,
      region: 'Global',
      createdAt: '2024-01-01',
      description: 'Fixed Amount Tax'
    },
  ];

  const filteredData = sampleTaxData.filter(tax => {
    const matchesSearch = tax.taxName.toLowerCase().includes(searchText.toLowerCase()) ||
                         tax.region.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && tax.enabled) ||
                         (statusFilter === 'inactive' && !tax.enabled);
    const matchesType = typeFilter === 'all' || tax.taxType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: filteredData.length,
    active: filteredData.filter(tax => tax.enabled).length,
    default: filteredData.filter(tax => tax.isDefault).length,
    totalValue: filteredData.reduce((sum, tax) => sum + tax.taxValue, 0),
  };

  return (
    <div>
      {/* Header with Language and Currency Controls */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <h2>{translate('taxes')}</h2>
            <p>{translate('taxes_list')}</p>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Select 
                value={currentLanguage} 
                onChange={setCurrentLanguage}
                style={{ width: 120 }}
              >
                <Option value="en">English</Option>
                <Option value="es">Español</Option>
                <Option value="fr">Français</Option>
              </Select>
              <Select 
                value={currentCurrency} 
                onChange={setCurrentCurrency}
                style={{ width: 120 }}
              >
                {Object.entries(currencies).map(([code, currency]) => (
                  <Option key={code} value={code}>
                    {code} - {currency.symbol}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title={translate('total_taxes')} value={stats.total} prefix={<SyncOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={translate('active_taxes')} value={stats.active} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={translate('default_taxes')} value={stats.default} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={translate('total_tax_value')} value={stats.totalValue} suffix="%" />
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder={translate('search')}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select 
              value={statusFilter} 
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder={translate('status')}
            >
              <Option value="all">{translate('all')}</Option>
              <Option value="active">{translate('active')}</Option>
              <Option value="inactive">{translate('inactive')}</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select 
              value={typeFilter} 
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              placeholder={translate('tax_type')}
            >
              <Option value="all">{translate('all')}</Option>
              <Option value="percentage">{translate('percentage')}</Option>
              <Option value="fixed_amount">{translate('fixed_amount')}</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker 
              style={{ width: '100%' }}
              onChange={setDateRange}
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button type="primary" icon={<FilterOutlined />}>
                {translate('apply')}
              </Button>
              <Button onClick={() => {
                setSearchText('');
                setStatusFilter('all');
                setTypeFilter('all');
                setDateRange([]);
              }}>
                {translate('reset')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col span={18}>
              <Space>
                <span>{selectedRows.length} {translate('taxes')} {translate('selected')}</span>
                <Select 
                  value={bulkAction} 
                  onChange={setBulkAction}
                  placeholder={translate('bulk_actions')}
                  style={{ width: 200 }}
                >
                  <Option value="enable">{translate('enable_selected')}</Option>
                  <Option value="disable">{translate('disable_selected')}</Option>
                  <Option value="delete">{translate('delete_selected')}</Option>
                </Select>
                <Button type="primary" onClick={handleBulkAction}>
                  {translate('apply')}
                </Button>
              </Space>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Button onClick={() => setSelectedRows([])}>
                {translate('clear_all')}
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      {/* Main Table */}
      <Card>
        <Table
          columns={dataTableColumns}
          dataSource={filteredData}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${translate('showing')} ${range[0]}-${range[1]} ${translate('of')} ${total} ${translate('items')}`
          }}
          rowSelection={{
            selectedRowKeys: selectedRows.map(row => row.key),
            onChange: (selectedRowKeys, selectedRows) => setSelectedRows(selectedRows),
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* View Tax Modal */}
      <Modal
        title={translate('tax_details')}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            {translate('close')}
          </Button>
        ]}
      >
        {viewTaxData && (
          <div>
            <p><strong>{translate('name')}:</strong> {viewTaxData.taxName}</p>
            <p><strong>{translate('value')}:</strong> {viewTaxData.taxValue}%</p>
            <p><strong>{translate('tax_type')}:</strong> {viewTaxData.taxType}</p>
            <p><strong>{translate('status')}:</strong> 
              <Tag color={viewTaxData.enabled ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                {viewTaxData.enabled ? translate('active') : translate('inactive')}
              </Tag>
            </p>
            <p><strong>{translate('default')}:</strong> 
              <Tag color={viewTaxData.isDefault ? 'green' : 'default'} style={{ marginLeft: 8 }}>
                {viewTaxData.isDefault ? translate('yes') : translate('no')}
              </Tag>
            </p>
            <p><strong>{translate('region')}:</strong> {viewTaxData.region}</p>
            <p><strong>{translate('description')}:</strong> {viewTaxData.description}</p>
            <p><strong>{translate('created_date')}:</strong> {dayjs(viewTaxData.createdAt).format('DD/MM/YYYY HH:mm')}</p>
          </div>
        )}
      </Modal>

      {/* Original CrudModule */}
      <CrudModule
        createForm={<TaxForm />}
        updateForm={<TaxForm isUpdateForm={true} />}
        config={config}
      />
    </div>
  );
}