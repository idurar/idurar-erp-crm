import React, { useState, useMemo, useEffect } from 'react';

// Multi-language translations
const translations = {
  en: {
    invoiceManagement: "Invoice Management",
    totalRevenue: "Total Revenue",
    totalPaid: "Total Paid",
    outstandingBalance: "Outstanding Balance",
    searchPlaceholder: "Search invoices by number, client, or status...",
    newInvoice: "New Invoice",
    number: "Number",
    client: "Client",
    date: "Date",
    dueDate: "Due Date",
    total: "Total",
    paid: "Paid",
    status: "Status",
    payment: "Payment",
    actions: "Actions",
    edit: "Edit",
    recordPayment: "Record Payment",
    delete: "Delete",
    createInvoice: "Create New Invoice",
    editInvoice: "Edit Invoice",
    invoiceNumber: "Invoice Number",
    selectClient: "Select Client",
    totalAmount: "Total Amount",
    paidAmount: "Paid Amount",
    paymentStatus: "Payment Status",
    cancel: "Cancel",
    save: "Save",
    recordPaymentFor: "Record Payment for",
    amount: "Amount",
    paymentDate: "Payment Date",
    paymentMethod: "Payment Method",
    remaining: "Remaining",
    bankTransfer: "Bank Transfer",
    creditCard: "Credit Card",
    paypal: "PayPal",
    cash: "Cash",
    unpaid: "Unpaid",
    partial: "Partial",
    paid: "Paid",
    pending: "Pending",
    completed: "Completed",
    overdue: "Overdue",
    deleteConfirm: "Are you sure you want to delete invoice",
    language: "Language",
    currency: "Currency",
    exportCSV: "Export CSV",
    importCSV: "Import CSV",
    bulkActions: "Bulk Actions",
    selectAll: "Select All",
    clearAll: "Clear All",
    deleteSelected: "Delete Selected",
    markAsPaid: "Mark as Paid",
    noInvoices: "No invoices found",
    createFirstInvoice: "Create your first invoice to get started",
    dashboard: "Dashboard",
    invoices: "Invoices",
    settings: "Settings",
    analytics: "Analytics",
    tax: "Tax",
    subtotal: "Subtotal",
    discount: "Discount",
    taxRate: "Tax Rate",
    notes: "Notes",
    items: "Items",
    itemName: "Item Name",
    quantity: "Quantity",
    price: "Price",
    addItem: "Add Item",
    description: "Description",
    rate: "Rate",
    amount: "Amount",
    summary: "Summary"
  },
  es: {
    invoiceManagement: "Gestión de Facturas",
    totalRevenue: "Ingresos Totales",
    totalPaid: "Total Pagado",
    outstandingBalance: "Saldo Pendiente",
    searchPlaceholder: "Buscar facturas por número, cliente o estado...",
    newInvoice: "Nueva Factura",
    number: "Número",
    client: "Cliente",
    date: "Fecha",
    dueDate: "Fecha de Vencimiento",
    total: "Total",
    paid: "Pagado",
    status: "Estado",
    payment: "Pago",
    actions: "Acciones",
    edit: "Editar",
    recordPayment: "Registrar Pago",
    delete: "Eliminar",
    createInvoice: "Crear Nueva Factura",
    editInvoice: "Editar Factura",
    invoiceNumber: "Número de Factura",
    selectClient: "Seleccionar Cliente",
    totalAmount: "Monto Total",
    paidAmount: "Monto Pagado",
    paymentStatus: "Estado de Pago",
    cancel: "Cancelar",
    save: "Guardar",
    recordPaymentFor: "Registrar Pago para",
    amount: "Monto",
    paymentDate: "Fecha de Pago",
    paymentMethod: "Método de Pago",
    remaining: "Restante",
    bankTransfer: "Transferencia Bancaria",
    creditCard: "Tarjeta de Crédito",
    paypal: "PayPal",
    cash: "Efectivo",
    unpaid: "No Pagado",
    partial: "Parcial",
    paid: "Pagado",
    pending: "Pendiente",
    completed: "Completado",
    overdue: "Vencido",
    deleteConfirm: "¿Estás seguro de que quieres eliminar la factura",
    language: "Idioma",
    currency: "Moneda",
    exportCSV: "Exportar CSV",
    importCSV: "Importar CSV",
    bulkActions: "Acciones en Masa",
    selectAll: "Seleccionar Todo",
    clearAll: "Limpiar Todo",
    deleteSelected: "Eliminar Seleccionados",
    markAsPaid: "Marcar como Pagado",
    noInvoices: "No se encontraron facturas",
    createFirstInvoice: "Crea tu primera factura para comenzar",
    dashboard: "Panel",
    invoices: "Facturas",
    settings: "Configuración",
    analytics: "Analíticas",
    tax: "Impuesto",
    subtotal: "Subtotal",
    discount: "Descuento",
    taxRate: "Tasa de Impuesto",
    notes: "Notas",
    items: "Artículos",
    itemName: "Nombre del Artículo",
    quantity: "Cantidad",
    price: "Precio",
    addItem: "Agregar Artículo",
    description: "Descripción",
    rate: "Tasa",
    amount: "Monto",
    summary: "Resumen"
  },
  fr: {
    invoiceManagement: "Gestion des Factures",
    totalRevenue: "Revenu Total",
    totalPaid: "Total Payé",
    outstandingBalance: "Solde Impayé",
    searchPlaceholder: "Rechercher des factures par numéro, client ou statut...",
    newInvoice: "Nouvelle Facture",
    number: "Numéro",
    client: "Client",
    date: "Date",
    dueDate: "Date d'Échéance",
    total: "Total",
    paid: "Payé",
    status: "Statut",
    payment: "Paiement",
    actions: "Actions",
    edit: "Modifier",
    recordPayment: "Enregistrer Paiement",
    delete: "Supprimer",
    createInvoice: "Créer une Nouvelle Facture",
    editInvoice: "Modifier la Facture",
    invoiceNumber: "Numéro de Facture",
    selectClient: "Sélectionner un Client",
    totalAmount: "Montant Total",
    paidAmount: "Montant Payé",
    paymentStatus: "Statut du Paiement",
    cancel: "Annuler",
    save: "Sauvegarder",
    recordPaymentFor: "Enregistrer le Paiement pour",
    amount: "Montant",
    paymentDate: "Date de Paiement",
    paymentMethod: "Méthode de Paiement",
    remaining: "Restant",
    bankTransfer: "Virement Bancaire",
    creditCard: "Carte de Crédit",
    paypal: "PayPal",
    cash: "Espèces",
    unpaid: "Impayé",
    partial: "Partiel",
    paid: "Payé",
    pending: "En Attente",
    completed: "Terminé",
    overdue: "En Retard",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer la facture",
    language: "Langue",
    currency: "Devise",
    exportCSV: "Exporter CSV",
    importCSV: "Importer CSV",
    bulkActions: "Actions Groupées",
    selectAll: "Tout Sélectionner",
    clearAll: "Tout Effacer",
    deleteSelected: "Supprimer la Sélection",
    markAsPaid: "Marquer comme Payé",
    noInvoices: "Aucune facture trouvée",
    createFirstInvoice: "Créez votre première facture pour commencer",
    dashboard: "Tableau de Bord",
    invoices: "Factures",
    settings: "Paramètres",
    analytics: "Analytiques",
    tax: "Taxe",
    subtotal: "Sous-total",
    discount: "Remise",
    taxRate: "Taux de Taxe",
    notes: "Notes",
    items: "Articles",
    itemName: "Nom de l'Article",
    quantity: "Quantité",
    price: "Prix",
    addItem: "Ajouter un Article",
    description: "Description",
    rate: "Taux",
    amount: "Montant",
    summary: "Résumé"
  }
};

// Currency configurations
const currencyConfigs = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  CNY: { symbol: '¥', code: 'CNY', name: 'Chinese Yuan' }
};

// Mock data for demonstration
const initialMockInvoices = [
  {
    id: '1',
    number: 'INV-001',
    client: { name: 'John Doe', email: 'john@example.com' },
    date: '2024-01-15',
    expiredDate: '2024-02-15',
    total: 1500.00,
    credit: 1500.00,
    currency: 'USD',
    status: 'paid',
    paymentStatus: 'completed',
    items: [
      { id: '1', description: 'Website Design', quantity: 1, rate: 1000, amount: 1000 },
      { id: '2', description: 'Hosting Setup', quantity: 1, rate: 500, amount: 500 }
    ],
    taxRate: 0,
    discount: 0,
    notes: 'Thank you for your business!'
  },
  {
    id: '2',
    number: 'INV-002',
    client: { name: 'Jane Smith', email: 'jane@example.com' },
    date: '2024-01-20',
    expiredDate: '2024-02-20',
    total: 2500.50,
    credit: 1000.00,
    currency: 'EUR',
    status: 'partial',
    paymentStatus: 'pending',
    items: [
      { id: '1', description: 'Mobile App Development', quantity: 1, rate: 2000, amount: 2000 },
      { id: '2', description: 'API Integration', quantity: 1, rate: 500.50, amount: 500.50 }
    ],
    taxRate: 10,
    discount: 50,
    notes: 'Please make payment within 30 days'
  },
  {
    id: '3',
    number: 'INV-003',
    client: { name: 'Acme Corp', email: 'acme@example.com' },
    date: '2024-01-25',
    expiredDate: '2024-02-25',
    total: 5000.00,
    credit: 0.00,
    currency: 'GBP',
    status: 'unpaid',
    paymentStatus: 'overdue',
    items: [
      { id: '1', description: 'Enterprise Software License', quantity: 2, rate: 2500, amount: 5000 }
    ],
    taxRate: 20,
    discount: 0,
    notes: 'Urgent payment required'
  }
];

const mockClients = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Acme Corp', email: 'acme@example.com' },
  { id: '4', name: 'Global Tech', email: 'global@example.com' },
  { id: '5', name: 'Startup Inc', email: 'startup@example.com' }
];

// Status Tag Component
const StatusTag = ({ status, children }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      paid: 'green',
      unpaid: 'red',
      partial: 'orange',
      completed: 'green',
      pending: 'blue',
      overdue: 'red'
    };
    return statusColors[status.toLowerCase()] || 'default';
  };

  return (
    <span className={`tag tag-${getStatusColor(status)}`}>
      {children}
    </span>
  );
};

// Money Formatter with multi-currency support
const useMoney = () => {
  const moneyFormatter = ({ amount, currency_code = 'USD' }) => {
    const config = currencyConfigs[currency_code] || currencyConfigs.USD;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency_code,
    }).format(amount);
  };

  return { moneyFormatter };
};

// Date Formatter
const useDate = () => {
  const dateFormat = 'MMM DD, YYYY';
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return { dateFormat, formatDate };
};

// Search Component
const SearchBar = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
    </div>
  );
};

// Language and Currency Selector
const SettingsBar = ({ language, currency, onLanguageChange, onCurrencyChange, translate, onExport, onImport }) => {
  return (
    <div className="settings-bar">
      <div className="settings-group">
        <label>{translate('language')}:</label>
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>
      
      <div className="settings-group">
        <label>{translate('currency')}:</label>
        <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)}>
          {Object.entries(currencyConfigs).map(([code, config]) => (
            <option key={code} value={code}>
              {config.name} ({config.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="settings-actions">
        <button onClick={onExport} className="btn-secondary">
          {translate('exportCSV')}
        </button>
        <button onClick={onImport} className="btn-secondary">
          {translate('importCSV')}
        </button>
      </div>
    </div>
  );
};

// Bulk Actions Component
const BulkActions = ({ selectedCount, onSelectAll, onClearAll, onDeleteSelected, onMarkAsPaid, translate }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bulk-actions">
      <span>{selectedCount} {translate('invoices')} selected</span>
      <div className="bulk-buttons">
        <button onClick={onSelectAll} className="btn-secondary">
          {translate('selectAll')}
        </button>
        <button onClick={onClearAll} className="btn-secondary">
          {translate('clearAll')}
        </button>
        <button onClick={onMarkAsPaid} className="btn-primary">
          {translate('markAsPaid')}
        </button>
        <button onClick={onDeleteSelected} className="btn-danger">
          {translate('deleteSelected')}
        </button>
      </div>
    </div>
  );
};

// Data Table Component
const DataTable = ({ columns, data, onEdit, onDelete, onRecordPayment, onSelect, selectedRows, translate }) => {
  const toggleRowSelection = (id) => {
    onSelect(id);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === data.length) {
      // Clear all
      data.forEach(item => onSelect(item.id));
    } else {
      // Select all
      data.forEach(item => {
        if (!selectedRows.has(item.id)) {
          onSelect(item.id);
        }
      });
    }
  };

  if (data.length === 0) {
    return (
      <div className="empty-state">
        <h3>{translate('noInvoices')}</h3>
        <p>{translate('createFirstInvoice')}</p>
      </div>
    );
  }

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.size === data.length && data.length > 0}
                onChange={toggleAllRows}
              />
            </th>
            {columns.map((column, index) => (
              <th key={index}>{column.title}</th>
            ))}
            <th>{translate('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.id} className={selectedRows.has(record.id) ? 'selected' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.has(record.id)}
                  onChange={() => toggleRowSelection(record.id)}
                />
              </td>
              {columns.map((column, index) => (
                <td key={index} style={column.onCell ? column.onCell().style : {}}>
                  {column.render ? column.render(record[column.dataIndex] || record, record) : record[column.dataIndex]}
                </td>
              ))}
              <td className="actions">
                <button onClick={() => onEdit(record)} className="btn-edit">{translate('edit')}</button>
                <button onClick={() => onRecordPayment(record)} className="btn-payment">{translate('recordPayment')}</button>
                <button onClick={() => onDelete(record)} className="btn-delete">{translate('delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Invoice Items Component
const InvoiceItems = ({ items, onItemsChange, currency }) => {
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    onItemsChange([...items, newItem]);
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  const removeItem = (id) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="invoice-items">
      <h4>Items</h4>
      <div className="items-header">
        <span>Description</span>
        <span>Quantity</span>
        <span>Rate</span>
        <span>Amount</span>
        <span>Action</span>
      </div>
      {items.map((item, index) => (
        <div key={item.id} className="item-row">
          <input
            type="text"
            value={item.description}
            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
            placeholder="Item description"
          />
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
            min="1"
          />
          <input
            type="number"
            step="0.01"
            value={item.rate}
            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
          />
          <span className="item-amount">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency
            }).format(item.amount)}
          </span>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="btn-remove"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="btn-add-item">
        + Add Item
      </button>
      <div className="subtotal">
        Subtotal: {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency
        }).format(subtotal)}
      </div>
    </div>
  );
};

// Invoice Form Component
const InvoiceForm = ({ invoice, onSave, onCancel, clients, currency, translate }) => {
  const [formData, setFormData] = useState(invoice || {
    number: '',
    client: { name: '', email: '' },
    date: new Date().toISOString().split('T')[0],
    expiredDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    total: 0,
    credit: 0,
    currency: currency,
    status: 'unpaid',
    paymentStatus: 'pending',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    taxRate: 0,
    discount: 0,
    notes: ''
  });

  const calculateTotal = (items, taxRate, discount) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal - discount) * (taxRate / 100);
    return (subtotal - discount + taxAmount);
  };

  const handleItemsChange = (items) => {
    const total = calculateTotal(items, formData.taxRate, formData.discount);
    setFormData(prev => ({
      ...prev,
      items,
      total
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    let updatedData = { ...formData, [field]: value };
    
    if (field === 'taxRate' || field === 'discount') {
      updatedData.total = calculateTotal(updatedData.items, updatedData.taxRate, updatedData.discount);
    }
    
    setFormData(updatedData);
  };

  const handleClientChange = (clientName) => {
    const client = clients.find(c => c.name === clientName);
    setFormData(prev => ({
      ...prev,
      client: client || { name: clientName, email: '' }
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <h2>{invoice ? translate('editInvoice') : translate('createInvoice')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{translate('invoiceNumber')}:</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>{translate('client')}:</label>
                <select
                  value={formData.client.name}
                  onChange={(e) => handleClientChange(e.target.value)}
                  required
                >
                  <option value="">{translate('selectClient')}</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>{translate('date')}:</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>{translate('dueDate')}:</label>
                <input
                  type="date"
                  value={formData.expiredDate}
                  onChange={(e) => handleChange('expiredDate', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <InvoiceItems 
            items={formData.items} 
            onItemsChange={handleItemsChange}
            currency={currency}
          />

          <div className="form-section">
            <h3>{translate('summary')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{translate('discount')}:</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => handleChange('discount', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="form-group">
                <label>{translate('taxRate')} (%):</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>{translate('notes')}:</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows="3"
              />
            </div>

            <div className="summary-total">
              <strong>Total: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
              }).format(formData.total)}</strong>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">{translate('cancel')}</button>
            <button type="submit" className="btn-save">{translate('save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Payment Form Component
const PaymentForm = ({ invoice, onSave, onCancel, translate }) => {
  const [paymentData, setPaymentData] = useState({
    amount: invoice.total - invoice.credit,
    date: new Date().toISOString().split('T')[0],
    method: 'bank_transfer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...invoice,
      credit: invoice.credit + paymentData.amount,
      status: (invoice.credit + paymentData.amount) >= invoice.total ? 'paid' : 'partial',
      paymentStatus: 'completed'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{translate('recordPaymentFor')} {invoice.number}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{translate('amount')}:</label>
            <input
              type="number"
              step="0.01"
              max={invoice.total - invoice.credit}
              value={paymentData.amount}
              onChange={(e) => setPaymentData(prev => ({
                ...prev,
                amount: parseFloat(e.target.value)
              }))}
              required
            />
            <small>{translate('remaining')}: {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: invoice.currency
            }).format(invoice.total - invoice.credit)}</small>
          </div>
          
          <div className="form-group">
            <label>{translate('paymentDate')}:</label>
            <input
              type="date"
              value={paymentData.date}
              onChange={(e) => setPaymentData(prev => ({
                ...prev,
                date: e.target.value
              }))}
              required
            />
          </div>
          
          <div className="form-group">
            <label>{translate('paymentMethod')}:</label>
            <select
              value={paymentData.method}
              onChange={(e) => setPaymentData(prev => ({
                ...prev,
                method: e.target.value
              }))}
            >
              <option value="bank_transfer">{translate('bankTransfer')}</option>
              <option value="credit_card">{translate('creditCard')}</option>
              <option value="paypal">{translate('paypal')}</option>
              <option value="cash">{translate('cash')}</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">{translate('cancel')}</button>
            <button type="submit" className="btn-save">{translate('recordPayment')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ activeTab, onTabChange, translate }) => {
  const tabs = ['dashboard', 'invoices', 'analytics', 'settings'];
  
  return (
    <nav className="navigation">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`nav-item ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {translate(tab)}
        </button>
      ))}
    </nav>
  );
};

// Analytics Dashboard
const AnalyticsDashboard = ({ invoices, currency, translate }) => {
  const stats = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.credit, 0);
    const outstanding = totalRevenue - totalPaid;
    
    const statusCounts = invoices.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {});
    
    const currencyRevenue = invoices.reduce((acc, inv) => {
      acc[inv.currency] = (acc[inv.currency] || 0) + inv.total;
      return acc;
    }, {});

    return { totalRevenue, totalPaid, outstanding, statusCounts, currencyRevenue };
  }, [invoices]);

  return (
    <div className="analytics-dashboard">
      <h2>{translate('analytics')}</h2>
      
      <div className="analytics-stats">
        <div className="stat-card">
          <h3>{translate('totalRevenue')}</h3>
          <p>{new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
          }).format(stats.totalRevenue)}</p>
        </div>
        
        <div className="stat-card">
          <h3>{translate('totalPaid')}</h3>
          <p>{new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
          }).format(stats.totalPaid)}</p>
        </div>
        
        <div className="stat-card">
          <h3>{translate('outstandingBalance')}</h3>
          <p>{new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
          }).format(stats.outstanding)}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Invoices</h3>
          <p>{invoices.length}</p>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-section">
          <h4>Invoice Status Distribution</h4>
          <div className="status-bars">
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              <div key={status} className="status-bar">
                <span className="status-label">{status}</span>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ width: `${(count / invoices.length) * 100}%` }}
                  ></div>
                </div>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-section">
          <h4>Revenue by Currency</h4>
          <div className="currency-revenue">
            {Object.entries(stats.currencyRevenue).map(([curr, amount]) => (
              <div key={curr} className="currency-item">
                <span>{curr}:</span>
                <span>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: curr
                }).format(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Invoice Component
export default function Invoice() {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : initialMockInvoices;
  });
  
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [activeTab, setActiveTab] = useState('invoices');
  
  const { moneyFormatter } = useMoney();
  const { dateFormat, formatDate } = useDate();

  const translate = (key) => translations[language]?.[key] || key;

  // Save to localStorage whenever invoices change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [invoices, searchQuery]);

  const dataTableColumns = [
    {
      title: translate('number'),
      dataIndex: 'number',
    },
    {
      title: translate('client'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('date'),
      dataIndex: 'date',
      render: (date) => formatDate(date),
    },
    {
      title: translate('dueDate'),
      dataIndex: 'expiredDate',
      render: (date) => formatDate(date),
    },
    {
      title: translate('total'),
      dataIndex: 'total',
      onCell: () => ({
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
          direction: 'ltr',
        },
      }),
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('paid'),
      dataIndex: 'credit',
      onCell: () => ({
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
          direction: 'ltr',
        },
      }),
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('status'),
      dataIndex: 'status',
      render: (status) => <StatusTag status={status}>{translate(status)}</StatusTag>,
    },
    {
      title: translate('payment'),
      dataIndex: 'paymentStatus',
      render: (status) => <StatusTag status={status}>{translate(status)}</StatusTag>,
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredInvoices(invoices);
      return;
    }
    
    const filtered = invoices.filter(invoice =>
      invoice.number.toLowerCase().includes(query.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(query.toLowerCase()) ||
      invoice.status.toLowerCase().includes(query.toLowerCase()) ||
      invoice.paymentStatus.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredInvoices(filtered);
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleSaveInvoice = (invoiceData) => {
    if (editingInvoice) {
      // Update existing invoice
      setInvoices(prev => prev.map(inv => 
        inv.id === editingInvoice.id ? { ...invoiceData, id: editingInvoice.id } : inv
      ));
    } else {
      // Create new invoice
      const newInvoice = {
        ...invoiceData,
        id: Date.now().toString(),
        number: `INV-${(invoices.length + 1).toString().padStart(3, '0')}`
      };
      setInvoices(prev => [...prev, newInvoice]);
    }
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = (invoice) => {
    if (window.confirm(`${translate('deleteConfirm')} ${invoice.number}?`)) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
      setSelectedRows(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(invoice.id);
        return newSelected;
      });
    }
  };

  const handleRecordPayment = (invoice) => {
    setEditingInvoice(invoice);
    setShowPaymentForm(true);
  };

  const handleSavePayment = (updatedInvoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === updatedInvoice.id ? updatedInvoice : inv
    ));
    setShowPaymentForm(false);
    setEditingInvoice(null);
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelectedRows(new Set(invoices.map(inv => inv.id)));
  };

  const handleClearAll = () => {
    setSelectedRows(new Set());
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedRows.size} invoices?`)) {
      setInvoices(prev => prev.filter(inv => !selectedRows.has(inv.id)));
      setSelectedRows(new Set());
    }
  };

  const handleMarkAsPaid = () => {
    setInvoices(prev => prev.map(inv => 
      selectedRows.has(inv.id) ? { ...inv, status: 'paid', credit: inv.total, paymentStatus: 'completed' } : inv
    ));
    setSelectedRows(new Set());
  };

  const handleExportCSV = () => {
    const headers = ['Number', 'Client', 'Date', 'Due Date', 'Total', 'Paid', 'Status', 'Payment Status', 'Currency'];
    const csvContent = [
      headers.join(','),
      ...invoices.map(inv => [
        inv.number,
        `"${inv.client.name}"`,
        inv.date,
        inv.expiredDate,
        inv.total,
        inv.credit,
        inv.status,
        inv.paymentStatus,
        inv.currency
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportCSV = () => {
    // Simple CSV import implementation
    alert('CSV import functionality would be implemented here');
  };

  const totalRevenue = useMemo(() => 
    invoices.reduce((sum, invoice) => sum + invoice.total, 0), 
    [invoices]
  );

  const totalPaid = useMemo(() => 
    invoices.reduce((sum, invoice) => sum + invoice.credit, 0), 
    [invoices]
  );

  const outstandingBalance = useMemo(() => 
    invoices.reduce((sum, invoice) => sum + (invoice.total - invoice.credit), 0), 
    [invoices]
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard">
            <div className="stats">
              <div className="stat-card">
                <h3>{translate('totalRevenue')}</h3>
                <p>{moneyFormatter({ amount: totalRevenue, currency_code: currency })}</p>
              </div>
              <div className="stat-card">
                <h3>{translate('totalPaid')}</h3>
                <p>{moneyFormatter({ amount: totalPaid, currency_code: currency })}</p>
              </div>
              <div className="stat-card">
                <h3>{translate('outstandingBalance')}</h3>
                <p>{moneyFormatter({ amount: outstandingBalance, currency_code: currency })}</p>
              </div>
              <div className="stat-card">
                <h3>Total Invoices</h3>
                <p>{invoices.length}</p>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        return <AnalyticsDashboard invoices={invoices} currency={currency} translate={translate} />;
      
      case 'settings':
        return (
          <div className="settings-page">
            <h2>{translate('settings')}</h2>
            <SettingsBar
              language={language}
              currency={currency}
              onLanguageChange={setLanguage}
              onCurrencyChange={setCurrency}
              translate={translate}
              onExport={handleExportCSV}
              onImport={handleImportCSV}
            />
          </div>
        );
      
      case 'invoices':
      default:
        return (
          <>
            <div className="toolbar">
              <SearchBar 
                onSearch={handleSearch}
                placeholder={translate('searchPlaceholder')}
              />
              <button onClick={handleCreateInvoice} className="btn-primary">
                + {translate('newInvoice')}
              </button>
            </div>

            <BulkActions
              selectedCount={selectedRows.size}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              onDeleteSelected={handleDeleteSelected}
              onMarkAsPaid={handleMarkAsPaid}
              translate={translate}
            />

            <DataTable
              columns={dataTableColumns}
              data={filteredInvoices}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              onRecordPayment={handleRecordPayment}
              onSelect={handleRowSelect}
              selectedRows={selectedRows}
              translate={translate}
            />

            {showForm && (
              <InvoiceForm
                invoice={editingInvoice}
                onSave={handleSaveInvoice}
                onCancel={() => {
                  setShowForm(false);
                  setEditingInvoice(null);
                }}
                clients={mockClients}
                currency={currency}
                translate={translate}
              />
            )}

            {showPaymentForm && editingInvoice && (
              <PaymentForm
                invoice={editingInvoice}
                onSave={handleSavePayment}
                onCancel={() => {
                  setShowPaymentForm(false);
                  setEditingInvoice(null);
                }}
                translate={translate}
              />
            )}
          </>
        );
    }
  };

  return (
    <div className="invoice-app">
      <div className="app-header">
        <h1>{translate('invoiceManagement')}</h1>
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          translate={translate}
        />
      </div>

      <div className="app-content">
        {renderContent()}
      </div>

      <style jsx>{`
        .invoice-app {
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          background: #f5f5f5;
        }

        .app-header {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .app-header h1 {
          color: #333;
          margin-bottom: 20px;
          font-size: 28px;
        }

        .navigation {
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #eee;
        }

        .nav-item {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          color: #666;
          font-size: 14px;
        }

        .nav-item:hover {
          color: #1890ff;
        }

        .nav-item.active {
          color: #1890ff;
          border-bottom-color: #1890ff;
        }

        .app-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid #1890ff;
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
        }

        .stat-card p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 20px;
        }

        .search-bar {
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .search-input:focus {
          outline: none;
          border-color: #1890ff;
        }

        .btn-primary {
          background: #1890ff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          white-space: nowrap;
        }

        .btn-primary:hover {
          background: #40a9ff;
        }

        .btn-secondary {
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-secondary:hover {
          background: #e6e6e6;
        }

        .btn-danger {
          background: #ff4d4f;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-danger:hover {
          background: #ff7875;
        }

        .bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #e6f7ff;
          border: 1px solid #91d5ff;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .bulk-buttons {
          display: flex;
          gap: 10px;
        }

        .data-table {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #f0f0f0;
        }

        th {
          background: #fafafa;
          font-weight: 600;
          color: #333;
        }

        tr:hover {
          background: #f5f5f5;
        }

        tr.selected {
          background: #e6f7ff;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .btn-edit, .btn-payment, .btn-delete {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-edit {
          background: #52c41a;
          color: white;
        }

        .btn-payment {
          background: #1890ff;
          color: white;
        }

        .btn-delete {
          background: #ff4d4f;
          color: white;
        }

        .tag {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .tag-green {
          background: #f6ffed;
          border: 1px solid #b7eb8f;
          color: #52c41a;
        }

        .tag-red {
          background: #fff2f0;
          border: 1px solid #ffccc7;
          color: #ff4d4f;
        }

        .tag-orange {
          background: #fff7e6;
          border: 1px solid #ffd591;
          color: #fa8c16;
        }

        .tag-blue {
          background: #e6f7ff;
          border: 1px solid #91d5ff;
          color: #1890ff;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 30px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .large-modal {
          max-width: 800px;
        }

        .modal h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #333;
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .form-section h3 {
          margin-bottom: 15px;
          color: #333;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        input, select, textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #1890ff;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 30px;
        }

        .btn-cancel, .btn-save {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-cancel {
          background: #f5f5f5;
          color: #333;
        }

        .btn-save {
          background: #1890ff;
          color: white;
        }

        small {
          display: block;
          margin-top: 5px;
          color: #666;
          font-size: 12px;
        }

        .settings-bar {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
          padding: 20px;
          background: #fafafa;
          border-radius: 6px;
        }

        .settings-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .settings-group label {
          margin-bottom: 0;
          white-space: nowrap;
        }

        .settings-actions {
          display: flex;
          gap: 10px;
          margin-left: auto;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-state h3 {
          margin-bottom: 10px;
          color: #333;
        }

        .invoice-items {
          margin-bottom: 30px;
        }

        .invoice-items h4 {
          margin-bottom: 15px;
          color: #333;
        }

        .items-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 60px;
          gap: 10px;
          padding: 10px;
          background: #fafafa;
          font-weight: 600;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .item-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 60px;
          gap: 10px;
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }

        .item-amount {
          font-weight: 500;
          text-align: right;
        }

        .btn-remove {
          background: #ff4d4f;
          color: white;
          border: none;
          border-radius: 4px;
          width: 30px;
          height: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-add-item {
          background: #f5f5f5;
          border: 1px dashed #d9d9d9;
          color: #666;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
          width: 100%;
        }

        .btn-add-item:hover {
          background: #e6f7ff;
          border-color: #1890ff;
          color: #1890ff;
        }

        .subtotal {
          text-align: right;
          font-weight: 600;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #f0f0f0;
        }

        .summary-total {
          text-align: right;
          font-size: 18px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
        }

        .analytics-dashboard {
          padding: 20px 0;
        }

        .analytics-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .analytics-charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .chart-section {
          background: #fafafa;
          padding: 20px;
          border-radius: 8px;
        }

        .chart-section h4 {
          margin-bottom: 15px;
          color: #333;
        }

        .status-bars {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .status-bar {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-label {
          min-width: 80px;
          text-transform: capitalize;
        }

        .bar-container {
          flex: 1;
          background: #e6e6e6;
          height: 20px;
          border-radius: 10px;
          overflow: hidden;
        }

        .bar {
          height: 100%;
          background: #1890ff;
          transition: width 0.3s ease;
        }

        .status-count {
          min-width: 30px;
          text-align: right;
        }

        .currency-revenue {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .currency-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e6e6e6;
        }

        @media (max-width: 768px) {
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .stats {
            grid-template-columns: 1fr;
          }
          
          .actions {
            flex-direction: column;
          }
          
          .settings-bar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .settings-actions {
            margin-left: 0;
            justify-content: center;
          }
          
          .analytics-charts {
            grid-template-columns: 1fr;
          }
          
          .items-header,
          .item-row {
            grid-template-columns: 1fr;
            gap: 5px;
          }
          
          .bulk-actions {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
          
          .bulk-buttons {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}