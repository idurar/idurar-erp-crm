export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  expenseCategory: {
    type: 'async',
    label: 'Expense Category',
    displayLabels: ['expenseCategory', 'name'],
    dataIndex: ['expenseCategory', 'name'],
    entity: 'expensecategory',
    required: true,
  },

  total: {
    type: 'currency',
    required: true,
  },
  description: {
    type: 'textarea',
  },
  ref: {
    type: 'string',
  },
};
