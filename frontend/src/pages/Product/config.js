export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  productCategory: {
    type: 'async',
    label: 'product Category',
    displayLabels: ['productCategory', 'name'],
    dataIndex: ['productCategory', 'name'],
    entity: 'productcategory',
    required: true,
  },
  price: {
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
