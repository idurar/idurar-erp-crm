import React, { useState, useMemo, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Select, 
  DatePicker,
  Progress,
  Avatar,
  List,
  Timeline,
  Badge,
  Tooltip,
  Switch,
  Dropdown,
  Menu,
  Grid,
  Layout,
  Typography,
  Alert,
  Modal,
  Form,
  Input,
  InputNumber,
  Divider,
  Popconfirm,
  message,
  Radio,
  Tabs,
  Empty,
  Spin,
  Result
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  SyncOutlined,
  FilterOutlined,
  SettingOutlined,
  DownloadOutlined,
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TeamOutlined,
  ShoppingOutlined,
  WalletOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CrownOutlined,
  RocketOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

// Enhanced Multi-language translations
const translations = {
  en: {
    dashboard: 'Dashboard',
    welcome: 'Welcome back,',
    revenue: 'Revenue',
    customers: 'Customers',
    orders: 'Orders',
    growth: 'Growth',
    this_month: 'This Month',
    total_revenue: 'Total Revenue',
    new_customers: 'New Customers',
    pending_orders: 'Pending Orders',
    completed_orders: 'Completed Orders',
    sales_performance: 'Sales Performance',
    recent_activities: 'Recent Activities',
    top_products: 'Top Products',
    payment_methods: 'Payment Methods',
    quick_actions: 'Quick Actions',
    view_all: 'View All',
    language: 'Language',
    currency: 'Currency',
    settings: 'Settings',
    notifications: 'Notifications',
    profile: 'Profile',
    logout: 'Logout',
    today: 'Today',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    all_time: 'All Time',
    status: 'Status',
    amount: 'Amount',
    date: 'Date',
    customer: 'Customer',
    product: 'Product',
    quantity: 'Quantity',
    price: 'Price',
    total: 'Total',
    completed: 'Completed',
    pending: 'Pending',
    cancelled: 'Cancelled',
    processing: 'Processing',
    paid: 'Paid',
    unpaid: 'Unpaid',
    active: 'Active',
    inactive: 'Inactive',
    view_details: 'View Details',
    edit: 'Edit',
    delete: 'Delete',
    add_new: 'Add New',
    export_data: 'Export Data',
    refresh: 'Refresh',
    search: 'Search',
    filter: 'Filter',
    apply: 'Apply',
    reset: 'Reset',
    cash: 'Cash',
    card: 'Card',
    transfer: 'Transfer',
    wallet: 'Wallet',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    critical: 'Critical',
    overview: 'Overview',
    analytics: 'Analytics',
    reports: 'Reports',
    all: 'All',
    loading: 'Loading...',
    no_data: 'No data available',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    update: 'Update',
    create: 'Create',
    manage: 'Manage',
    dashboard_stats: 'Dashboard Statistics',
    recent_transactions: 'Recent Transactions',
    performance_metrics: 'Performance Metrics',
    system_health: 'System Health',
    user_management: 'User Management',
    product_management: 'Product Management',
    order_management: 'Order Management',
    financial_reports: 'Financial Reports',
    customer_insights: 'Customer Insights',
    inventory_status: 'Inventory Status',
    sales_analytics: 'Sales Analytics',
    marketing_campaigns: 'Marketing Campaigns',
    support_tickets: 'Support Tickets',
    api_usage: 'API Usage',
    security_logs: 'Security Logs',
    backup_status: 'Backup Status',
    system_settings: 'System Settings'
  },
  es: {
    dashboard: 'Tablero',
    welcome: 'Bienvenido de nuevo,',
    revenue: 'Ingresos',
    customers: 'Clientes',
    orders: 'Pedidos',
    growth: 'Crecimiento',
    this_month: 'Este Mes',
    total_revenue: 'Ingresos Totales',
    new_customers: 'Nuevos Clientes',
    pending_orders: 'Pedidos Pendientes',
    completed_orders: 'Pedidos Completados',
    sales_performance: 'Rendimiento de Ventas',
    recent_activities: 'Actividades Recientes',
    top_products: 'Productos Principales',
    payment_methods: 'Métodos de Pago',
    quick_actions: 'Acciones Rápidas',
    view_all: 'Ver Todo',
    language: 'Idioma',
    currency: 'Moneda',
    settings: 'Configuración',
    notifications: 'Notificaciones',
    profile: 'Perfil',
    logout: 'Cerrar Sesión',
    today: 'Hoy',
    week: 'Semana',
    month: 'Mes',
    year: 'Año',
    all_time: 'Todo el Tiempo',
    status: 'Estado',
    amount: 'Cantidad',
    date: 'Fecha',
    customer: 'Cliente',
    product: 'Producto',
    quantity: 'Cantidad',
    price: 'Precio',
    total: 'Total',
    completed: 'Completado',
    pending: 'Pendiente',
    cancelled: 'Cancelado',
    processing: 'Procesando',
    paid: 'Pagado',
    unpaid: 'No Pagado',
    active: 'Activo',
    inactive: 'Inactivo',
    view_details: 'Ver Detalles',
    edit: 'Editar',
    delete: 'Eliminar',
    add_new: 'Agregar Nuevo',
    export_data: 'Exportar Datos',
    refresh: 'Actualizar',
    search: 'Buscar',
    filter: 'Filtrar',
    apply: 'Aplicar',
    reset: 'Reiniciar',
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    wallet: 'Billetera',
    high: 'Alto',
    medium: 'Medio',
    low: 'Bajo',
    critical: 'Crítico',
    overview: 'Resumen',
    analytics: 'Analíticas',
    reports: 'Reportes',
    all: 'Todos',
    loading: 'Cargando...',
    no_data: 'No hay datos disponibles',
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    save: 'Guardar',
    update: 'Actualizar',
    create: 'Crear',
    manage: 'Gestionar',
    dashboard_stats: 'Estadísticas del Tablero',
    recent_transactions: 'Transacciones Recientes',
    performance_metrics: 'Métricas de Rendimiento',
    system_health: 'Salud del Sistema',
    user_management: 'Gestión de Usuarios',
    product_management: 'Gestión de Productos',
    order_management: 'Gestión de Pedidos',
    financial_reports: 'Reportes Financieros',
    customer_insights: 'Información del Cliente',
    inventory_status: 'Estado del Inventario',
    sales_analytics: 'Analíticas de Ventas',
    marketing_campaigns: 'Campañas de Marketing',
    support_tickets: 'Tickets de Soporte',
    api_usage: 'Uso de API',
    security_logs: 'Registros de Seguridad',
    backup_status: 'Estado de Copias de Seguridad',
    system_settings: 'Configuración del Sistema'
  },
  fr: {
    dashboard: 'Tableau de Bord',
    welcome: 'Bon retour,',
    revenue: 'Revenu',
    customers: 'Clients',
    orders: 'Commandes',
    growth: 'Croissance',
    this_month: 'Ce Mois',
    total_revenue: 'Revenu Total',
    new_customers: 'Nouveaux Clients',
    pending_orders: 'Commandes en Attente',
    completed_orders: 'Commandes Terminées',
    sales_performance: 'Performance des Ventes',
    recent_activities: 'Activités Récentes',
    top_products: 'Meilleurs Produits',
    payment_methods: 'Méthodes de Paiement',
    quick_actions: 'Actions Rapides',
    view_all: 'Voir Tout',
    language: 'Langue',
    currency: 'Devise',
    settings: 'Paramètres',
    notifications: 'Notifications',
    profile: 'Profil',
    logout: 'Déconnexion',
    today: "Aujourd'hui",
    week: 'Semaine',
    month: 'Mois',
    year: 'Année',
    all_time: 'Tout le Temps',
    status: 'Statut',
    amount: 'Montant',
    date: 'Date',
    customer: 'Client',
    product: 'Produit',
    quantity: 'Quantité',
    price: 'Prix',
    total: 'Total',
    completed: 'Terminé',
    pending: 'En Attente',
    cancelled: 'Annulé',
    processing: 'En Cours',
    paid: 'Payé',
    unpaid: 'Impayé',
    active: 'Actif',
    inactive: 'Inactif',
    view_details: 'Voir Détails',
    edit: 'Modifier',
    delete: 'Supprimer',
    add_new: 'Ajouter Nouveau',
    export_data: 'Exporter Données',
    refresh: 'Rafraîchir',
    search: 'Rechercher',
    filter: 'Filtrer',
    apply: 'Appliquer',
    reset: 'Réinitialiser',
    cash: 'Espèces',
    card: 'Carte',
    transfer: 'Virement',
    wallet: 'Portefeuille',
    high: 'Élevé',
    medium: 'Moyen',
    low: 'Faible',
    critical: 'Critique',
    overview: 'Aperçu',
    analytics: 'Analytiques',
    reports: 'Rapports',
    all: 'Tous',
    loading: 'Chargement...',
    no_data: 'Aucune donnée disponible',
    success: 'Succès',
    error: 'Erreur',
    warning: 'Avertissement',
    info: 'Information',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    update: 'Mettre à jour',
    create: 'Créer',
    manage: 'Gérer',
    dashboard_stats: 'Statistiques du Tableau de Bord',
    recent_transactions: 'Transactions Récentes',
    performance_metrics: 'Métriques de Performance',
    system_health: 'État du Système',
    user_management: 'Gestion des Utilisateurs',
    product_management: 'Gestion des Produits',
    order_management: 'Gestion des Commandes',
    financial_reports: 'Rapports Financiers',
    customer_insights: 'Informations Clients',
    inventory_status: 'État des Stocks',
    sales_analytics: 'Analytiques des Ventes',
    marketing_campaigns: 'Campagnes Marketing',
    support_tickets: 'Tickets de Support',
    api_usage: 'Utilisation API',
    security_logs: 'Journaux de Sécurité',
    backup_status: 'État des Sauvegardes',
    system_settings: 'Paramètres du Système'
  }
};

// Enhanced Currency configurations with proper formatting
const currencies = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar', rate: 1, locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro', rate: 0.85, locale: 'de-DE' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound', rate: 0.73, locale: 'en-GB' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen', rate: 110, locale: 'ja-JP' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', rate: 1.25, locale: 'en-CA' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar', rate: 1.35, locale: 'en-AU' }
};

// Enhanced Sample Data with realistic structure
const generateSampleData = () => ({
  stats: {
    revenue: { current: 125430, previous: 112000, change: 12.0 },
    customers: { current: 2845, previous: 2650, change: 7.4 },
    orders: { current: 892, previous: 810, change: 10.1 },
    growth: { current: 12.5, previous: 10.2, change: 2.3 }
  },
  recentOrders: [
    {
      id: 'ORD-001',
      customer: 'John Smith',
      product: 'MacBook Pro 16"',
      amount: 2499,
      status: 'completed',
      date: '2024-01-15T14:30:00',
      payment: 'card',
      quantity: 1,
      priority: 'high'
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Johnson',
      product: 'iPhone 15 Pro',
      amount: 1199,
      status: 'pending',
      date: '2024-01-15T11:20:00',
      payment: 'wallet',
      quantity: 2,
      priority: 'medium'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Brown',
      product: 'iPad Air 5th Gen',
      amount: 749,
      status: 'processing',
      date: '2024-01-14T16:45:00',
      payment: 'transfer',
      quantity: 1,
      priority: 'medium'
    },
    {
      id: 'ORD-004',
      customer: 'Emily Davis',
      product: 'AirPods Pro 2nd Gen',
      amount: 249,
      status: 'completed',
      date: '2024-01-14T09:15:00',
      payment: 'card',
      quantity: 3,
      priority: 'low'
    },
    {
      id: 'ORD-005',
      customer: 'David Wilson',
      product: 'Apple Watch Series 9',
      amount: 429,
      status: 'cancelled',
      date: '2024-01-13T13:10:00',
      payment: 'cash',
      quantity: 1,
      priority: 'critical'
    },
    {
      id: 'ORD-006',
      customer: 'Lisa Anderson',
      product: 'Mac Mini M2',
      amount: 699,
      status: 'completed',
      date: '2024-01-13T10:05:00',
      payment: 'transfer',
      quantity: 1,
      priority: 'medium'
    }
  ],
  activities: [
    {
      id: 1,
      type: 'order',
      message: 'New order #ORD-007 received from Robert Taylor',
      time: '2024-01-15T10:30:00',
      priority: 'high',
      icon: 'shopping'
    },
    {
      id: 2,
      type: 'payment',
      message: 'Payment of $2,499.00 received for order #ORD-001',
      time: '2024-01-15T09:15:00',
      priority: 'medium',
      icon: 'dollar'
    },
    {
      id: 3,
      type: 'customer',
      message: 'New customer registration: Jennifer Lopez',
      time: '2024-01-14T16:45:00',
      priority: 'low',
      icon: 'user'
    },
    {
      id: 4,
      type: 'system',
      message: 'System backup completed successfully',
      time: '2024-01-14T02:00:00',
      priority: 'medium',
      icon: 'sync'
    },
    {
      id: 5,
      type: 'alert',
      message: 'Low inventory alert for iPhone 15 Pro',
      time: '2024-01-13T14:20:00',
      priority: 'critical',
      icon: 'warning'
    }
  ],
  topProducts: [
    { id: 1, name: 'MacBook Pro 16"', sales: 45, revenue: 112455, growth: 15 },
    { id: 2, name: 'iPhone 15 Pro', sales: 89, revenue: 106711, growth: 22 },
    { id: 3, name: 'iPad Air 5th Gen', sales: 32, revenue: 23968, growth: 8 },
    { id: 4, name: 'AirPods Pro 2nd Gen', sales: 67, revenue: 16683, growth: 12 },
    { id: 5, name: 'Apple Watch Series 9', sales: 23, revenue: 9867, growth: 5 }
  ],
  paymentMethods: [
    { method: 'card', percentage: 45, amount: 56443, trend: 'up' },
    { method: 'wallet', percentage: 25, amount: 31357, trend: 'up' },
    { method: 'transfer', percentage: 20, amount: 25086, trend: 'stable' },
    { method: 'cash', percentage: 10, amount: 12543, trend: 'down' }
  ],
  systemHealth: {
    cpu: 65,
    memory: 78,
    storage: 45,
    network: 92
  }
});

const AdvancedDashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const screens = useBreakpoint();
  const [sampleData, setSampleData] = useState(generateSampleData());

  const translate = useMemo(() => {
    return (key) => translations[currentLanguage]?.[key] || translations.en[key] || key;
  }, [currentLanguage]);

  const formatCurrency = useMemo(() => {
    return (amount) => {
      const currency = currencies[currentCurrency];
      const convertedAmount = amount * currency.rate;
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currentCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(convertedAmount);
    };
  }, [currentCurrency]);

  const filteredOrders = useMemo(() => {
    return sampleData.recentOrders.filter(order => {
      const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || order.priority === selectedPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchQuery, selectedStatus, selectedPriority, sampleData.recentOrders]);

  const statusColors = {
    completed: 'green',
    pending: 'orange',
    processing: 'blue',
    cancelled: 'red'
  };

  const priorityColors = {
    high: 'red',
    medium: 'orange',
    low: 'green',
    critical: 'purple'
  };

  const trendIcons = {
    up: <ArrowUpOutlined style={{ color: '#52c41a' }} />,
    down: <ArrowDownOutlined style={{ color: '#ff4d4f' }} />,
    stable: <SyncOutlined style={{ color: '#1890ff' }} />
  };

  const activityIcons = {
    shopping: <ShoppingCartOutlined />,
    dollar: <DollarOutlined />,
    user: <UserOutlined />,
    sync: <SyncOutlined />,
    warning: <ExclamationCircleOutlined />
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSampleData(generateSampleData());
    setRefreshKey(prev => prev + 1);
    setLoading(false);
    message.success(translate('success'));
  };

  const handleExportData = () => {
    message.success(`${translate('export_data')} - ${filteredOrders.length} ${translate('orders')}`);
  };

  const handleAddNew = () => {
    message.info(translate('add_new'));
  };

  const handleDeleteOrder = (orderId) => {
    setSampleData(prev => ({
      ...prev,
      recentOrders: prev.recentOrders.filter(order => order.id !== orderId)
    }));
    message.success(`${translate('success')}: ${translate('order')} ${orderId} ${translate('delete')}`);
  };

  const handleViewDetails = (order) => {
    Modal.info({
      title: `${translate('order')} ${order.id}`,
      width: 600,
      content: (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <p><strong>{translate('customer')}:</strong> {order.customer}</p>
              <p><strong>{translate('product')}:</strong> {order.product}</p>
              <p><strong>{translate('quantity')}:</strong> {order.quantity}</p>
            </Col>
            <Col span={12}>
              <p><strong>{translate('amount')}:</strong> {formatCurrency(order.amount)}</p>
              <p><strong>{translate('status')}:</strong> <Tag color={statusColors[order.status]}>{translate(order.status)}</Tag></p>
              <p><strong>{translate('date')}:</strong> {dayjs(order.date).format('MMM DD, YYYY HH:mm')}</p>
            </Col>
          </Row>
        </div>
      ),
    });
  };

  const notificationMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <Space>
              <BellOutlined />
              <span>New order received</span>
            </Space>
          ),
        },
        {
          key: '2',
          label: (
            <Space>
              <DollarOutlined />
              <span>Payment completed</span>
            </Space>
          ),
        },
        {
          key: '3',
          label: (
            <Space>
              <SyncOutlined />
              <span>System update available</span>
            </Space>
          ),
        },
        {
          type: 'divider',
        },
        {
          key: '4',
          label: translate('view_all'),
        },
      ]}
    />
  );

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <Space>
              <UserOutlined />
              <span>{translate('profile')}</span>
            </Space>
          ),
        },
        {
          key: '2',
          label: (
            <Space>
              <SettingOutlined />
              <span>{translate('settings')}</span>
            </Space>
          ),
          onClick: () => setIsSettingsModalVisible(true),
        },
        {
          type: 'divider',
        },
        {
          key: '3',
          label: (
            <Space>
              <CloseCircleOutlined />
              <span>{translate('logout')}</span>
            </Space>
          ),
        },
      ]}
    />
  );

  const quickActions = [
    {
      title: translate('add_new'),
      description: 'Create new product',
      icon: <PlusOutlined />,
      color: '#52c41a',
      action: handleAddNew
    },
    {
      title: translate('export_data'),
      description: 'Export all data',
      icon: <DownloadOutlined />,
      color: '#1890ff',
      action: handleExportData
    },
    {
      title: 'Generate Report',
      description: 'Create sales report',
      icon: <FileTextOutlined />,
      color: '#722ed1',
      action: () => message.info('Generating report...')
    },
    {
      title: 'Manage Users',
      description: 'User management',
      icon: <TeamOutlined />,
      color: '#fa8c16',
      action: () => message.info('Opening user management...')
    }
  ];

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <Text strong style={{ color: darkMode ? '#fff' : '#000' }}>{text}</Text>,
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: translate('customer'),
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
      sorter: (a, b) => a.customer.localeCompare(b.customer)
    },
    {
      title: translate('product'),
      dataIndex: 'product',
      key: 'product',
      width: 180,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>
    },
    {
      title: translate('amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: translate('status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={statusColors[status]} style={{ margin: 0 }}>
          {translate(status)}
        </Tag>
      ),
      filters: [
        { text: translate('completed'), value: 'completed' },
        { text: translate('pending'), value: 'pending' },
        { text: translate('processing'), value: 'processing' },
        { text: translate('cancelled'), value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => (
        <Tag color={priorityColors[priority]} style={{ margin: 0 }}>
          {translate(priority)}
        </Tag>
      )
    },
    {
      title: translate('date'),
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
    },
    {
      title: translate('actions'),
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => handleViewDetails(record)}
            style={{ padding: 0 }}
          >
            {translate('view_details')}
          </Button>
          <Space size="small">
            <Tooltip title={translate('edit')}>
              <Button 
                type="link" 
                icon={<EditOutlined />} 
                size="small" 
                style={{ padding: 0, color: '#1890ff' }}
              />
            </Tooltip>
            <Popconfirm
              title={`${translate('confirm')} ${translate('delete')}`}
              description={`${translate('are_you_sure')} ${translate('delete')} ${record.id}?`}
              onConfirm={() => handleDeleteOrder(record.id)}
              okText={translate('yes')}
              cancelText={translate('no')}
            >
              <Tooltip title={translate('delete')}>
                <Button 
                  type="link" 
                  danger 
                  icon={<DeleteOutlined />} 
                  size="small" 
                  style={{ padding: 0 }}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        </Space>
      )
    }
  ];

  const StatCard = ({ title, value, previous, change, prefix, suffix, color }) => (
    <Card 
      size="small" 
      style={{ height: '100%' }}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <Text type="secondary" style={{ fontSize: '14px' }}>{title}</Text>
        <Tag color={change >= 0 ? 'green' : 'red'} style={{ margin: 0 }}>
          {change >= 0 ? '+' : ''}{change}%
        </Tag>
      </div>
      <Statistic
        value={value}
        formatter={value => (
          <span style={{ color: darkMode ? '#fff' : '#000', fontSize: '24px', fontWeight: 'bold' }}>
            {prefix}{value}{suffix}
          </span>
        )}
      />
      <div style={{ marginTop: 8 }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {translate('previous')}: {prefix}{previous}{suffix}
        </Text>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: darkMode ? '#141414' : '#f0f2f5'
      }}>
        <Spin size="large" tip={translate('loading')} />
      </div>
    );
  }

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: darkMode ? '#141414' : '#f0f2f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <Header style={{ 
        background: darkMode ? '#1f1f1f' : '#fff', 
        padding: '0 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Space>
          <RocketOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Title level={3} style={{ 
            color: darkMode ? '#fff' : '#000', 
            margin: 0,
            fontSize: screens.xs ? '18px' : '20px'
          }}>
            {translate('dashboard')}
          </Title>
        </Space>
        
        <Space size="middle" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Input
            placeholder={translate('search')}
            prefix={<SearchOutlined />}
            style={{ width: screens.xs ? '120px' : '200px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
          
          <Select
            value={currentLanguage}
            onChange={setCurrentLanguage}
            style={{ width: screens.xs ? '80px' : '100px' }}
            size="small"
          >
            <Option value="en">🇺🇸 EN</Option>
            <Option value="es">🇪🇸 ES</Option>
            <Option value="fr">🇫🇷 FR</Option>
          </Select>
          
          <Select
            value={currentCurrency}
            onChange={setCurrentCurrency}
            style={{ width: screens.xs ? '80px' : '100px' }}
            size="small"
          >
            {Object.keys(currencies).map(currency => (
              <Option key={currency} value={currency}>{currency}</Option>
            ))}
          </Select>
          
          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <Switch
              checkedChildren="🌙"
              unCheckedChildren="☀️"
              checked={darkMode}
              onChange={setDarkMode}
              size="small"
            />
          </Tooltip>
          
          <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
            <Badge count={5} size="small" offset={[-5, 5]}>
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                size="middle"
                style={{ color: darkMode ? '#fff' : '#000' }}
              />
            </Badge>
          </Dropdown>
          
          <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
            <Button 
              type="text" 
              icon={<UserOutlined />} 
              size="middle"
              style={{ color: darkMode ? '#fff' : '#000' }}
            />
          </Dropdown>
        </Space>
      </Header>

      <Content style={{ 
        padding: screens.xs ? '16px' : '24px', 
        marginTop: '16px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Welcome Alert */}
        <Alert
          message={
            <Space>
              <ThunderboltOutlined />
              <span>
                {translate('welcome')} <strong>Admin</strong>! {translate('dashboard_stats')}
              </span>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" type="text" onClick={handleRefresh}>
              {translate('refresh')}
            </Button>
          }
        />

        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} xl={6}>
            <StatCard
              title={translate('total_revenue')}
              value={sampleData.stats.revenue.current}
              previous={sampleData.stats.revenue.previous}
              change={sampleData.stats.revenue.change}
              prefix={currencies[currentCurrency].symbol}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatCard
              title={translate('customers')}
              value={sampleData.stats.customers.current}
              previous={sampleData.stats.customers.previous}
              change={sampleData.stats.customers.change}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatCard
              title={translate('orders')}
              value={sampleData.stats.orders.current}
              previous={sampleData.stats.orders.previous}
              change={sampleData.stats.orders.change}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatCard
              title={translate('growth')}
              value={sampleData.stats.growth.current}
              previous={sampleData.stats.growth.previous}
              change={sampleData.stats.growth.change}
              suffix="%"
            />
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: (
                <Space>
                  <BarChartOutlined />
                  {translate('overview')}
                </Space>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {/* Recent Orders Table */}
                  <Col xs={24} xl={16}>
                    <Card 
                      title={
                        <Space>
                          <ShoppingCartOutlined />
                          {translate('recent_transactions')}
                        </Space>
                      }
                      extra={
                        <Space wrap>
                          <Select
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            style={{ width: '120px' }}
                            size="small"
                            placeholder={translate('status')}
                          >
                            <Option value="all">{translate('all')}</Option>
                            <Option value="completed">{translate('completed')}</Option>
                            <Option value="pending">{translate('pending')}</Option>
                            <Option value="processing">{translate('processing')}</Option>
                            <Option value="cancelled">{translate('cancelled')}</Option>
                          </Select>
                          <Select
                            value={selectedPriority}
                            onChange={setSelectedPriority}
                            style={{ width: '120px' }}
                            size="small"
                            placeholder="Priority"
                          >
                            <Option value="all">{translate('all')}</Option>
                            <Option value="high">{translate('high')}</Option>
                            <Option value="medium">{translate('medium')}</Option>
                            <Option value="low">{translate('low')}</Option>
                            <Option value="critical">{translate('critical')}</Option>
                          </Select>
                          <RangePicker 
                            value={dateRange} 
                            onChange={setDateRange}
                            size="small"
                          />
                          <Button 
                            icon={<SyncOutlined />} 
                            onClick={handleRefresh}
                            size="small"
                          >
                            {translate('refresh')}
                          </Button>
                        </Space>
                      }
                      style={{ height: '100%' }}
                    >
                      {filteredOrders.length > 0 ? (
                        <Table
                          columns={orderColumns}
                          dataSource={filteredOrders}
                          pagination={{ 
                            pageSize: 5,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                              `${range[0]}-${range[1]} of ${total} items`
                          }}
                          size="middle"
                          scroll={{ x: 1000 }}
                          rowKey="id"
                        />
                      ) : (
                        <Empty description={translate('no_data')} />
                      )}
                    </Card>
                  </Col>

                  {/* Sidebar Content */}
                  <Col xs={24} xl={8}>
                    <Row gutter={[16, 16]}>
                      {/* Recent Activities */}
                      <Col span={24}>
                        <Card 
                          title={
                            <Space>
                              <CalendarOutlined />
                              {translate('recent_activities')}
                            </Space>
                          }
                          size="small"
                        >
                          <Timeline>
                            {sampleData.activities.map(activity => (
                              <Timeline.Item
                                key={activity.id}
                                color={priorityColors[activity.priority]}
                                dot={activityIcons[activity.icon]}
                              >
                                <div>
                                  <Text style={{ fontSize: '13px', display: 'block' }}>
                                    {activity.message}
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: '11px' }}>
                                    {dayjs(activity.time).fromNow()}
                                  </Text>
                                </div>
                              </Timeline.Item>
                            ))}
                          </Timeline>
                        </Card>
                      </Col>

                      {/* Top Products */}
                      <Col span={24}>
                        <Card 
                          title={
                            <Space>
                              <CrownOutlined />
                              {translate('top_products')}
                            </Space>
                          }
                          size="small"
                        >
                          <List
                            dataSource={sampleData.topProducts}
                            renderItem={(product, index) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={
                                    <Avatar 
                                      style={{ 
                                        backgroundColor: index < 3 ? '#1890ff' : '#d9d9d9',
                                        color: '#fff'
                                      }}
                                    >
                                      {index + 1}
                                    </Avatar>
                                  }
                                  title={
                                    <Text strong style={{ fontSize: '13px' }}>
                                      {product.name}
                                    </Text>
                                  }
                                  description={
                                    <Space direction="vertical" size={0}>
                                      <Text type="secondary" style={{ fontSize: '11px' }}>
                                        {product.sales} sales • {formatCurrency(product.revenue)}
                                      </Text>
                                      <Progress 
                                        percent={product.growth} 
                                        size="small" 
                                        showInfo={false}
                                        strokeColor={product.growth > 10 ? '#52c41a' : '#faad14'}
                                      />
                                    </Space>
                                  }
                                />
                              </List.Item>
                            )}
                            size="small"
                          />
                        </Card>
                      </Col>

                      {/* Payment Methods */}
                      <Col span={24}>
                        <Card 
                          title={
                            <Space>
                              <CreditCardOutlined />
                              {translate('payment_methods')}
                            </Space>
                          }
                          size="small"
                        >
                          {sampleData.paymentMethods.map(method => (
                            <div key={method.method} style={{ marginBottom: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <Space>
                                  <Text strong style={{ fontSize: '13px' }}>
                                    {translate(method.method)}
                                  </Text>
                                  {trendIcons[method.trend]}
                                </Space>
                                <Text style={{ fontSize: '13px' }}>{method.percentage}%</Text>
                              </div>
                              <Progress 
                                percent={method.percentage} 
                                size="small" 
                                strokeColor={{
                                  '0%': '#108ee9',
                                  '100%': '#87d068',
                                }}
                              />
                              <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                                {formatCurrency(method.amount)}
                              </Text>
                            </div>
                          ))}
                        </Card>
                      </Col>

                      {/* Quick Actions */}
                      <Col span={24}>
                        <Card 
                          title={
                            <Space>
                              <ThunderboltOutlined />
                              {translate('quick_actions')}
                            </Space>
                          }
                          size="small"
                        >
                          <Row gutter={[8, 8]}>
                            {quickActions.map((action, index) => (
                              <Col span={12} key={index}>
                                <Card 
                                  size="small" 
                                  hoverable
                                  onClick={action.action}
                                  style={{ 
                                    textAlign: 'center',
                                    border: `1px solid ${action.color}20`,
                                    background: `${action.color}08`
                                  }}
                                  bodyStyle={{ padding: '12px 8px' }}
                                >
                                  <div style={{ fontSize: '20px', marginBottom: '8px', color: action.color }}>
                                    {action.icon}
                                  </div>
                                  <Text strong style={{ fontSize: '12px', display: 'block' }}>
                                    {action.title}
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: '10px', display: 'block' }}>
                                    {action.description}
                                  </Text>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )
            },
            {
              key: 'analytics',
              label: (
                <Space>
                  <BarChartOutlined />
                  {translate('analytics')}
                </Space>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card title={translate('performance_metrics')}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                          <Card size="small">
                            <Progress
                              type="dashboard"
                              percent={sampleData.systemHealth.cpu}
                              format={percent => `CPU ${percent}%`}
                              strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Card size="small">
                            <Progress
                              type="dashboard"
                              percent={sampleData.systemHealth.memory}
                              format={percent => `RAM ${percent}%`}
                              strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Card size="small">
                            <Progress
                              type="dashboard"
                              percent={sampleData.systemHealth.storage}
                              format={percent => `Storage ${percent}%`}
                              strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Card size="small">
                            <Progress
                              type="dashboard"
                              percent={sampleData.systemHealth.network}
                              format={percent => `Network ${percent}%`}
                              strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              )
            }
          ]}
        />
      </Content>

      {/* Settings Modal */}
      <Modal
        title={
          <Space>
            <SettingOutlined />
            {translate('system_settings')}
          </Space>
        }
        open={isSettingsModalVisible}
        onCancel={() => setIsSettingsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsSettingsModalVisible(false)}>
            {translate('cancel')}
          </Button>,
          <Button key="save" type="primary" onClick={() => {
            setIsSettingsModalVisible(false);
            message.success(translate('success'));
          }}>
            {translate('save')}
          </Button>,
        ]}
        width={600}
      >
        <Tabs>
          <TabPane tab={translate('language')} key="language">
            <Form layout="vertical">
              <Form.Item label={translate('language')}>
                <Select value={currentLanguage} onChange={setCurrentLanguage}>
                  <Option value="en">English</Option>
                  <Option value="es">Español</Option>
                  <Option value="fr">Français</Option>
                </Select>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab={translate('currency')} key="currency">
            <Form layout="vertical">
              <Form.Item label={translate('currency')}>
                <Select value={currentCurrency} onChange={setCurrentCurrency}>
                  {Object.entries(currencies).map(([code, currency]) => (
                    <Option key={code} value={code}>
                      {code} - {currency.name} ({currency.symbol})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Appearance" key="appearance">
            <Form layout="vertical">
              <Form.Item label="Theme">
                <Radio.Group value={darkMode ? 'dark' : 'light'} onChange={(e) => setDarkMode(e.target.value === 'dark')}>
                  <Radio value="light">Light</Radio>
                  <Radio value="dark">Dark</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </Layout>
  );
};

export default AdvancedDashboard;