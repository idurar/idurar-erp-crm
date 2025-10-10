import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, useEffect, useMemo } from 'react';
import useLanguage from '@/locale/useLanguage';
import PaymentDataTableModule from '@/modules/PaymentModule/PaymentDataTableModule';
import { useMoney, useDate } from '@/settings';

// Add relative time plugin
dayjs.extend(relativeTime);

// Inline CSS styles
const styles = `
.payment-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.payment-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.payment-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.payment-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 5px 0 0 0;
}

.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.language-currency-controls {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.control-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  min-width: 120px;
  cursor: pointer;
}

.control-select:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.payment-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1890ff;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.success {
  border-left-color: #52c41a;
}

.stat-card.warning {
  border-left-color: #faad14;
}

.stat-card.error {
  border-left-color: #ff4d4f;
}

.stat-card.info {
  border-left-color: #1890ff;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 5px;
}

.stat-value.success {
  color: #52c41a;
}

.stat-value.warning {
  color: #faad14;
}

.stat-value.error {
  color: #ff4d4f;
}

.stat-value.info {
  color: #1890ff;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
}

.amount-positive {
  color: #52c41a !important;
  font-weight: bold;
}

.amount-negative {
  color: #ff4d4f !important;
  font-weight: bold;
}

.currency-symbol {
  font-size: 12px;
  opacity: 0.7;
  margin-right: 2px;
}

.payment-mode-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  display: inline-block;
  text-align: center;
  min-width: 60px;
}

.payment-mode-cash {
  background-color: #52c41a;
}

.payment-mode-card {
  background-color: #1890ff;
}

.payment-mode-transfer {
  background-color: #722ed1;
}

.payment-mode-wallet {
  background-color: #fa8c16;
}

.payment-mode-other {
  background-color: #8c8c8c;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  display: inline-block;
  text-align: center;
  min-width: 70px;
}

.status-completed {
  background-color: #52c41a;
}

.status-pending {
  background-color: #faad14;
}

.status-failed {
  background-color: #ff4d4f;
}

.status-refunded {
  background-color: #8c8c8c;
}

.recent-indicator {
  font-size: 12px;
  color: #1890ff;
  font-style: italic;
  margin-top: 2px;
}

.invoice-link {
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s ease;
}

.invoice-link:hover {
  color: #40a9ff;
  text-decoration: none;
}

.row-pending {
  background-color: #fffbe6 !important;
  border-left: 3px solid #faad14 !important;
}

.row-failed {
  background-color: #fff2f0 !important;
  border-left: 3px solid #ff4d4f !important;
}

.row-large-amount {
  background-color: #f6ffed !important;
  border-left: 3px solid #52c41a !important;
}

.row-recent {
  background-color: #f0f8ff !important;
  border-left: 3px solid #1890ff !important;
}

.row-refunded {
  background-color: #fafafa !important;
  border-left: 3px solid #8c8c8c !important;
}

.filter-section {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.filter-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
  transition: border-color 0.2s ease;
}

.filter-input:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  min-width: 150px;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.filter-button {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-button:hover {
  background: #40a9ff;
  transform: translateY(-1px);
}

.filter-button.reset {
  background: #ff4d4f;
}

.filter-button.reset:hover {
  background: #ff7875;
}

.custom-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.action-button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: #f5f5f5;
  border-color: #1890ff;
  color: #1890ff;
  transform: translateY(-1px);
}

.action-button.export {
  border-color: #52c41a;
  color: #52c41a;
}

.action-button.export:hover {
  background: #f6ffed;
  border-color: #73d13d;
}

.action-button.bulk {
  border-color: #722ed1;
  color: #722ed1;
}

.action-button.bulk:hover {
  background: #f9f0ff;
  border-color: #9254de;
}

.action-button.print {
  border-color: #fa8c16;
  color: #fa8c16;
}

.action-button.print:hover {
  background: #fff7e6;
  border-color: #ffa940;
}

.summary-section {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  text-align: center;
}

.summary-item {
  padding: 10px;
}

.summary-value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.summary-label {
  font-size: 12px;
  opacity: 0.9;
}

.language-flag {
  width: 20px;
  height: 15px;
  margin-right: 8px;
  border-radius: 2px;
}

.currency-preview {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
  font-style: italic;
}

@media (max-width: 768px) {
  .payment-stats {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-input, .filter-select {
    min-width: auto;
  }
  
  .custom-actions {
    flex-direction: column;
  }
  
  .controls-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .language-currency-controls {
    justify-content: space-between;
  }
}
`;

// Multi-language translations
const translations = {
  en: {
    payment: 'Payment',
    payment_list: 'Payment List',
    add_new_payment: 'Add New Payment',
    total_amount: 'Total Amount',
    recent_payments: 'Recent Payments',
    export_payments: 'Export Payments',
    bulk_update: 'Bulk Update',
    print_report: 'Print Report',
    number: 'Number',
    client: 'Client',
    amount: 'Amount',
    date: 'Date',
    year: 'Year',
    payment_mode: 'Payment Mode',
    status: 'Status',
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    refunded: 'Refunded',
    cash: 'Cash',
    card: 'Card',
    transfer: 'Bank Transfer',
    wallet: 'Digital Wallet',
    other: 'Other',
    all_status: 'All Status',
    search_payments: 'Search payments...',
    apply_filters: 'Apply Filters',
    reset: 'Reset',
    advanced_filters: 'Advanced Filters',
    language: 'Language',
    currency: 'Currency',
    total_payments: 'Total Payments',
    completed_payments: 'Completed',
    pending_payments: 'Pending',
    failed_payments: 'Failed',
    refunded_payments: 'Refunded',
    recent: 'Recent',
    invoice_number: 'Invoice Number',
    select_language: 'Select Language',
    select_currency: 'Select Currency',
  },
  es: {
    payment: 'Pago',
    payment_list: 'Lista de Pagos',
    add_new_payment: 'Agregar Nuevo Pago',
    total_amount: 'Monto Total',
    recent_payments: 'Pagos Recientes',
    export_payments: 'Exportar Pagos',
    bulk_update: 'Actualización Masiva',
    print_report: 'Imprimir Reporte',
    number: 'Número',
    client: 'Cliente',
    amount: 'Monto',
    date: 'Fecha',
    year: 'Año',
    payment_mode: 'Modo de Pago',
    status: 'Estado',
    completed: 'Completado',
    pending: 'Pendiente',
    failed: 'Fallido',
    refunded: 'Reembolsado',
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia Bancaria',
    wallet: 'Billetera Digital',
    other: 'Otro',
    all_status: 'Todos los Estados',
    search_payments: 'Buscar pagos...',
    apply_filters: 'Aplicar Filtros',
    reset: 'Reiniciar',
    advanced_filters: 'Filtros Avanzados',
    language: 'Idioma',
    currency: 'Moneda',
    total_payments: 'Pagos Totales',
    completed_payments: 'Completados',
    pending_payments: 'Pendientes',
    failed_payments: 'Fallidos',
    refunded_payments: 'Reembolsados',
    recent: 'Reciente',
    invoice_number: 'Número de Factura',
    select_language: 'Seleccionar Idioma',
    select_currency: 'Seleccionar Moneda',
  },
  fr: {
    payment: 'Paiement',
    payment_list: 'Liste des Paiements',
    add_new_payment: 'Ajouter un Nouveau Paiement',
    total_amount: 'Montant Total',
    recent_payments: 'Paiements Récents',
    export_payments: 'Exporter les Paiements',
    bulk_update: 'Mise à Jour en Masse',
    print_report: 'Imprimer le Rapport',
    number: 'Numéro',
    client: 'Client',
    amount: 'Montant',
    date: 'Date',
    year: 'Année',
    payment_mode: 'Mode de Paiement',
    status: 'Statut',
    completed: 'Terminé',
    pending: 'En Attente',
    failed: 'Échoué',
    refunded: 'Remboursé',
    cash: 'Espèces',
    card: 'Carte',
    transfer: 'Virement Bancaire',
    wallet: 'Portefeuille Numérique',
    other: 'Autre',
    all_status: 'Tous les Statuts',
    search_payments: 'Rechercher des paiements...',
    apply_filters: 'Appliquer les Filtres',
    reset: 'Réinitialiser',
    advanced_filters: 'Filtres Avancés',
    language: 'Langue',
    currency: 'Devise',
    total_payments: 'Paiements Totaux',
    completed_payments: 'Terminés',
    pending_payments: 'En Attente',
    failed_payments: 'Échoués',
    refunded_payments: 'Remboursés',
    recent: 'Récent',
    invoice_number: 'Numéro de Facture',
    select_language: 'Sélectionner la Langue',
    select_currency: 'Sélectionner la Devise',
  },
  de: {
    payment: 'Zahlung',
    payment_list: 'Zahlungsliste',
    add_new_payment: 'Neue Zahlung Hinzufügen',
    total_amount: 'Gesamtbetrag',
    recent_payments: 'Aktuelle Zahlungen',
    export_payments: 'Zahlungen Exportieren',
    bulk_update: 'Massenaktualisierung',
    print_report: 'Bericht Drucken',
    number: 'Nummer',
    client: 'Kunde',
    amount: 'Betrag',
    date: 'Datum',
    year: 'Jahr',
    payment_mode: 'Zahlungsart',
    status: 'Status',
    completed: 'Abgeschlossen',
    pending: 'Ausstehend',
    failed: 'Fehlgeschlagen',
    refunded: 'Rückerstattet',
    cash: 'Bargeld',
    card: 'Karte',
    transfer: 'Banküberweisung',
    wallet: 'Digitales Portemonnaie',
    other: 'Andere',
    all_status: 'Alle Status',
    search_payments: 'Zahlungen suchen...',
    apply_filters: 'Filter Anwenden',
    reset: 'Zurücksetzen',
    advanced_filters: 'Erweiterte Filter',
    language: 'Sprache',
    currency: 'Währung',
    total_payments: 'Zahlungen Gesamt',
    completed_payments: 'Abgeschlossen',
    pending_payments: 'Ausstehend',
    failed_payments: 'Fehlgeschlagen',
    refunded_payments: 'Rückerstattet',
    recent: 'Kürzlich',
    invoice_number: 'Rechnungsnummer',
    select_language: 'Sprache Auswählen',
    select_currency: 'Währung Auswählen',
  },
  ar: {
    payment: 'دفع',
    payment_list: 'قائمة المدفوعات',
    add_new_payment: 'إضافة دفعة جديدة',
    total_amount: 'المبلغ الإجمالي',
    recent_payments: 'المدفوعات الحديثة',
    export_payments: 'تصدير المدفوعات',
    bulk_update: 'تحديث جماعي',
    print_report: 'طباعة التقرير',
    number: 'الرقم',
    client: 'العميل',
    amount: 'المبلغ',
    date: 'التاريخ',
    year: 'السنة',
    payment_mode: 'طريقة الدفع',
    status: 'الحالة',
    completed: 'مكتمل',
    pending: 'قيد الانتظار',
    failed: 'فشل',
    refunded: 'تم الاسترداد',
    cash: 'نقدي',
    card: 'بطاقة',
    transfer: 'تحويل بنكي',
    wallet: 'محفظة رقمية',
    other: 'أخرى',
    all_status: 'جميع الحالات',
    search_payments: 'البحث في المدفوعات...',
    apply_filters: 'تطبيق الفلاتر',
    reset: 'إعادة تعيين',
    advanced_filters: 'فلاتر متقدمة',
    language: 'اللغة',
    currency: 'العملة',
    total_payments: 'إجمالي المدفوعات',
    completed_payments: 'مكتمل',
    pending_payments: 'قيد الانتظار',
    failed_payments: 'فشل',
    refunded_payments: 'تم الاسترداد',
    recent: 'حديث',
    invoice_number: 'رقم الفاتورة',
    select_language: 'اختر اللغة',
    select_currency: 'اختر العملة',
  }
};

// Currency configurations
const currencies = {
  USD: {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
    format: 'en-US',
    decimalDigits: 2
  },
  EUR: {
    symbol: '€',
    code: 'EUR',
    name: 'Euro',
    format: 'de-DE',
    decimalDigits: 2
  },
  GBP: {
    symbol: '£',
    code: 'GBP',
    name: 'British Pound',
    format: 'en-GB',
    decimalDigits: 2
  },
  JPY: {
    symbol: '¥',
    code: 'JPY',
    name: 'Japanese Yen',
    format: 'ja-JP',
    decimalDigits: 0
  },
  CAD: {
    symbol: 'C$',
    code: 'CAD',
    name: 'Canadian Dollar',
    format: 'en-CA',
    decimalDigits: 2
  },
  AUD: {
    symbol: 'A$',
    code: 'AUD',
    name: 'Australian Dollar',
    format: 'en-AU',
    decimalDigits: 2
  },
  CHF: {
    symbol: 'CHF',
    code: 'CHF',
    name: 'Swiss Franc',
    format: 'de-CH',
    decimalDigits: 2
  },
  CNY: {
    symbol: '¥',
    code: 'CNY',
    name: 'Chinese Yuan',
    format: 'zh-CN',
    decimalDigits: 2
  },
  INR: {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee',
    format: 'en-IN',
    decimalDigits: 2
  },
  AED: {
    symbol: 'د.إ',
    code: 'AED',
    name: 'UAE Dirham',
    format: 'ar-AE',
    decimalDigits: 2
  },
  SAR: {
    symbol: 'ر.س',
    code: 'SAR',
    name: 'Saudi Riyal',
    format: 'ar-SA',
    decimalDigits: 2
  }
};

// Language options with flags
const languageOptions = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' }
];

export default function Payment() {
  const defaultTranslate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter: defaultMoneyFormatter } = useMoney();
  
  // State for language and currency
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedRows, setSelectedRows] = useState([]);

  // Custom translate function with multi-language support
  const translate = useMemo(() => {
    return (key) => {
      return translations[currentLanguage]?.[key] || translations.en[key] || key;
    };
  }, [currentLanguage]);

  // Custom money formatter with multi-currency support
  const moneyFormatter = useMemo(() => {
    return ({ amount, currency_code = currentCurrency }) => {
      const currency = currencies[currency_code] || currencies.USD;
      const formattedAmount = new Intl.NumberFormat(currency.format, {
        style: 'currency',
        currency: currency_code,
        minimumFractionDigits: currency.decimalDigits,
        maximumFractionDigits: currency.decimalDigits,
      }).format(amount);

      return formattedAmount;
    };
  }, [currentCurrency]);

  const searchConfig = {
    entity: 'client',
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const deleteModalLabels = ['number'];

  // Helper functions for styling
  const getPaymentModeColor = (mode) => {
    const colors = {
      cash: 'payment-mode-cash',
      card: 'payment-mode-card',
      transfer: 'payment-mode-transfer',
      wallet: 'payment-mode-wallet',
    };
    return colors[mode?.toLowerCase()] || 'payment-mode-other';
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'status-completed',
      pending: 'status-pending',
      failed: 'status-failed',
      refunded: 'status-refunded',
    };
    return colors[status] || 'status-completed';
  };

  // Enhanced data table columns with multi-language support
  const dataTableColumns = useMemo(() => [
    {
      title: translate('number'),
      dataIndex: 'number',
      sorter: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <input
            placeholder={translate('search_payments')}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            className="filter-input"
          />
        </div>
      ),
    },
    {
      title: translate('client'),
      dataIndex: ['client', 'name'],
      sorter: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <input
            placeholder={translate('search_payments')}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            className="filter-input"
          />
        </div>
      ),
    },
    {
      title: translate('amount'),
      dataIndex: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (amount, record) => (
        <span className={amount >= 0 ? 'amount-positive' : 'amount-negative'}>
          <span className="currency-symbol">
            {currencies[record.currency || currentCurrency]?.symbol}
          </span>
          {moneyFormatter({ amount: amount, currency_code: record.currency || currentCurrency })}
        </span>
      ),
    },
    {
      title: translate('date'),
      dataIndex: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => {
        const paymentDate = dayjs(date);
        const isRecent = paymentDate.isAfter(dayjs().subtract(7, 'day'));
        
        return (
          <div>
            <div>{paymentDate.format(dateFormat)}</div>
            {isRecent && (
              <div className="recent-indicator">
                {paymentDate.fromNow()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: translate('invoice_number'),
      dataIndex: ['invoice', 'number'],
      render: (number, record) => (
        <span className="invoice-link">
          {number}
        </span>
      ),
    },
    {
      title: translate('year'),
      dataIndex: ['invoice', 'year'],
      sorter: (a, b) => (a.invoice?.year || 0) - (b.invoice?.year || 0),
      filters: [
        { text: '2023', value: 2023 },
        { text: '2024', value: 2024 },
        { text: '2025', value: 2025 },
      ],
    },
    {
      title: translate('payment_mode'),
      dataIndex: ['paymentMode', 'name'],
      sorter: true,
      filters: [
        { text: translate('cash'), value: 'cash' },
        { text: translate('card'), value: 'card' },
        { text: translate('transfer'), value: 'transfer' },
        { text: translate('wallet'), value: 'wallet' },
        { text: translate('other'), value: 'other' },
      ],
      render: (mode) => (
        <span className={`payment-mode-badge ${getPaymentModeColor(mode)}`}>
          {translate(mode?.toLowerCase())}
        </span>
      ),
    },
    {
      title: translate('status'),
      dataIndex: 'status',
      render: (status) => (
        <span className={`status-badge ${getStatusColor(status)}`}>
          {translate(status || 'completed')}
        </span>
      ),
      filters: [
        { text: translate('completed'), value: 'completed' },
        { text: translate('pending'), value: 'pending' },
        { text: translate('failed'), value: 'failed' },
        { text: translate('refunded'), value: 'refunded' },
      ],
    },
  ], [translate, moneyFormatter, dateFormat, currentCurrency]);

  // Enhanced entity configuration
  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: translate('payment'),
    DATATABLE_TITLE: translate('payment_list'),
    ADD_NEW_ENTITY: translate('add_new_payment'),
    ENTITY_NAME: translate('payment'),
    TOTAL_AMOUNT: translate('total_amount'),
    RECENT_PAYMENTS: translate('recent_payments'),
  };

  // Custom actions for the data table
  const customActions = [
    {
      key: 'export',
      label: translate('export_payments'),
      icon: '📊',
      onClick: (selectedRows) => {
        console.log('Exporting payments:', selectedRows);
        alert(`${translate('export_payments')}: ${selectedRows.length} ${translate('payment').toLowerCase()}`);
      },
    },
    {
      key: 'bulk_update',
      label: translate('bulk_update'),
      icon: '⚡',
      onClick: (selectedRows) => {
        console.log('Bulk update payments:', selectedRows);
        alert(`${translate('bulk_update')}: ${selectedRows.length} ${translate('payment').toLowerCase()}`);
      },
    },
    {
      key: 'print',
      label: translate('print_report'),
      icon: '🖨️',
      onClick: (selectedRows) => {
        console.log('Printing report:', selectedRows);
        alert(`${translate('print_report')}: ${selectedRows.length} ${translate('payment').toLowerCase()}`);
      },
    },
  ];

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    disableAdd: false,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
    enableRowSelection: true,
    enableBulkActions: true,
    customActions,
    advancedSearch: {
      enabled: true,
      fields: ['number', 'client.name', 'paymentMode.name', 'status'],
    },
    showSummary: true,
    getSummaryData: (data) => {
      const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
      const completedPayments = data.filter(item => !item.status || item.status === 'completed').length;
      const pendingPayments = data.filter(item => item.status === 'pending').length;
      const failedPayments = data.filter(item => item.status === 'failed').length;
      const refundedPayments = data.filter(item => item.status === 'refunded').length;
      
      return {
        totalAmount: moneyFormatter({ amount: totalAmount, currency_code: currentCurrency }),
        totalPayments: data.length,
        completedPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
      };
    },
    rowClassName: (record) => {
      const classes = [];
      if (record.status === 'pending') classes.push('row-pending');
      if (record.status === 'failed') classes.push('row-failed');
      if (record.status === 'refunded') classes.push('row-refunded');
      if (record.amount > 10000) classes.push('row-large-amount');
      if (dayjs(record.date).isAfter(dayjs().subtract(7, 'day'))) classes.push('row-recent');
      return classes.join(' ');
    },
  };

  // Custom filter component
  const CustomFilterSection = () => (
    <div className="filter-section">
      <div className="filter-title">{translate('advanced_filters')}</div>
      <div className="filter-controls">
        <input
          type="text"
          placeholder={translate('search_payments')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">{translate('all_status')}</option>
          <option value="completed">{translate('completed')}</option>
          <option value="pending">{translate('pending')}</option>
          <option value="failed">{translate('failed')}</option>
          <option value="refunded">{translate('refunded')}</option>
        </select>
        <input
          type="date"
          placeholder="Start Date"
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          className="filter-input"
        />
        <input
          type="date"
          placeholder="End Date"
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          className="filter-input"
        />
        <button className="filter-button">{translate('apply_filters')}</button>
        <button 
          className="filter-button reset"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setDateRange({ start: null, end: null });
          }}
        >
          {translate('reset')}
        </button>
      </div>
    </div>
  );

  // Custom stats component
  const CustomStats = ({ data }) => {
    const stats = config.getSummaryData(data || []);
    
    return (
      <div className="payment-stats">
        <div className="stat-card info">
          <div className="stat-value info">{stats.totalAmount}</div>
          <div className="stat-label">{translate('total_amount')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalPayments}</div>
          <div className="stat-label">{translate('total_payments')}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value success">{stats.completedPayments}</div>
          <div className="stat-label">{translate('completed_payments')}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value warning">{stats.pendingPayments}</div>
          <div className="stat-label">{translate('pending_payments')}</div>
        </div>
        <div className="stat-card error">
          <div className="stat-value error">{stats.failedPayments}</div>
          <div className="stat-label">{translate('failed_payments')}</div>
        </div>
      </div>
    );
  };

  // Language and Currency Controls
  const LanguageCurrencyControls = () => (
    <div className="language-currency-controls">
      <div className="control-group">
        <span className="control-label">{translate('language')}:</span>
        <select
          value={currentLanguage}
          onChange={(e) => setCurrentLanguage(e.target.value)}
          className="control-select"
        >
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="control-group">
        <span className="control-label">{translate('currency')}:</span>
        <select
          value={currentCurrency}
          onChange={(e) => setCurrentCurrency(e.target.value)}
          className="control-select"
        >
          {Object.entries(currencies).map(([code, currency]) => (
            <option key={code} value={code}>
              {code} - {currency.symbol} {currency.name}
            </option>
          ))}
        </select>
        <span className="currency-preview">
          {moneyFormatter({ amount: 1000, currency_code: currentCurrency })}
        </span>
      </div>
    </div>
  );

  return (
    <div className="payment-container">
      <style>{styles}</style>
      
      <div className="payment-header">
        <h1 className="payment-title">{translate('payment')}</h1>
        <p className="payment-subtitle">{translate('payment_list')}</p>
      </div>

      <div className="controls-section">
        <LanguageCurrencyControls />
      </div>

      <CustomStats />
      
      <CustomFilterSection />

      {selectedRows.length > 0 && (
        <div className="custom-actions">
          {customActions.map((action) => (
            <button
              key={action.key}
              className={`action-button ${action.key}`}
              onClick={() => action.onClick(selectedRows)}
            >
              {action.icon} {action.label} ({selectedRows.length})
            </button>
          ))}
        </div>
      )}

      <PaymentDataTableModule 
        config={config}
        onSelectionChange={setSelectedRows}
      />
    </div>
  );
}