# IDURAR ERP/CRM Developer Guide

This guide is designed to help developers understand the IDURAR ERP/CRM codebase and contribute effectively to the project.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Database Schema](#database-schema)
6. [API Design](#api-design)
7. [Authentication and Authorization](#authentication-and-authorization)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Contributing Guidelines](#contributing-guidelines)

## Architecture Overview

IDURAR ERP/CRM is built on the MERN stack:

- **MongoDB**: NoSQL database for storing application data
- **Express.js**: Backend framework for building the API
- **React.js**: Frontend library for building the user interface
- **Node.js**: JavaScript runtime for the backend

The application follows a client-server architecture:

- **Backend**: RESTful API built with Express.js and Node.js
- **Frontend**: Single-page application built with React.js and Ant Design

## Project Structure

The project is organized into two main directories:

- **backend**: Contains the server-side code
- **frontend**: Contains the client-side code

### Backend Structure

```
backend/
├── src/
│   ├── app.js                 # Express application setup
│   ├── server.js              # Server entry point
│   ├── controllers/           # Request handlers
│   │   ├── appControllers/    # Application-specific controllers
│   │   ├── coreControllers/   # Core system controllers
│   │   └── middlewaresControllers/ # Controller middleware factories
│   ├── models/                # MongoDB models
│   │   ├── appModels/         # Application-specific models
│   │   ├── coreModels/        # Core system models
│   │   └── utils/             # Model utilities
│   ├── routes/                # API routes
│   │   ├── appRoutes/         # Application-specific routes
│   │   └── coreRoutes/        # Core system routes
│   ├── middlewares/           # Express middlewares
│   ├── handlers/              # Error handlers and other handlers
│   ├── utils/                 # Utility functions
│   ├── locale/                # Internationalization
│   ├── pdf/                   # PDF templates
│   ├── emailTemplate/         # Email templates
│   ├── setup/                 # Setup scripts
│   └── settings/              # Application settings
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── main.jsx               # Application entry point
│   ├── RootApp.jsx            # Root component
│   ├── apps/                  # Main application components
│   ├── auth/                  # Authentication utilities
│   ├── components/            # Reusable UI components
│   ├── config/                # Configuration files
│   ├── context/               # React context providers
│   ├── forms/                 # Form components
│   ├── hooks/                 # Custom React hooks
│   ├── layout/                # Layout components
│   ├── locale/                # Internationalization
│   ├── modules/               # Feature modules
│   ├── pages/                 # Page components
│   ├── redux/                 # Redux store, actions, reducers
│   ├── request/               # API request utilities
│   ├── router/                # React Router configuration
│   ├── settings/              # Application settings
│   ├── style/                 # CSS styles
│   └── utils/                 # Utility functions
└── package.json
```

## Backend Development

### Setting Up the Development Environment

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Create a `.env` file with the required environment variables (see `.env.example`)
5. Run the setup script: `npm run setup`
6. Start the development server: `npm run dev`

### Creating a New Model

1. Create a new file in `src/models/appModels/` (e.g., `Product.js`)
2. Define the schema using Mongoose:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // Add more fields as needed
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
```

The model will be automatically registered and CRUD controllers will be generated for it.

### Creating a Custom Controller

If you need custom logic beyond the standard CRUD operations:

1. Create a new directory in `src/controllers/appControllers/` (e.g., `productController/`)
2. Create an `index.js` file with your custom controller methods:

```javascript
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

// Get the base CRUD controller
const crudController = createCRUDController('Product');

// Add custom methods
const customController = {
  // Override or add methods as needed
  create: async (req, res) => {
    // Custom create logic
    const { name, description, price } = req.body;
    
    // Additional validation or business logic
    if (price < 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Price cannot be negative',
        },
      });
    }
    
    // Call the original create method
    return crudController.create(req, res);
  },
  
  // Add a custom method
  findByPriceRange: async (req, res) => {
    try {
      const { min, max } = req.query;
      
      const products = await Product.find({
        price: { $gte: min, $lte: max },
      });
      
      return res.status(200).json({
        success: true,
        result: products,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          message: error.message,
        },
      });
    }
  },
  
  // Spread the original CRUD methods
  ...crudController,
};

module.exports = customController;
```

### Adding a Custom Route

To add a custom route for your controller:

1. Open `src/routes/appRoutes/appApi.js`
2. Add your custom route:

```javascript
// Add this after the routerApp function
router.route('/product/price-range').get(catchErrors(appControllers.productController.findByPriceRange));
```

## Frontend Development

### Setting Up the Development Environment

1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Create a `.env` file with the required environment variables (see `temp.env`)
5. Start the development server: `npm run dev`

### Creating a New Page

1. Create a new file in `src/pages/` (e.g., `Product/index.jsx`)
2. Define the page component:

```jsx
import React from 'react';
import { Layout } from 'antd';
import ErpPanel from '@/modules/ErpPanelModule';

const { Content } = Layout;

const Product = () => {
  const entity = 'product';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name,description',
  };
  const entityDisplayLabels = ['name'];
  
  const dataTableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
  ];
  
  const config = {
    entity,
    searchConfig,
    entityDisplayLabels,
    dataTableColumns,
  };
  
  return (
    <Content>
      <ErpPanel config={config} />
    </Content>
  );
};

export default Product;
```

### Adding a Route for the New Page

1. Open `src/router/routes.jsx`
2. Add your new route:

```jsx
import Product from '@/pages/Product';

// Add this to the routes array
{
  path: '/product',
  element: <Product />,
},
```

### Creating a Form for the New Entity

1. Create a new file in `src/forms/` (e.g., `ProductForm.jsx`)
2. Define the form component:

```jsx
import React from 'react';
import { Form, Input, InputNumber } from 'antd';

export default function ProductForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input product name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea />
      </Form.Item>
      
      <Form.Item
        label="Price"
        name="price"
        rules={[
          {
            required: true,
            message: 'Please input product price!',
          },
        ]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
}
```

## Database Schema

### Core Models

#### Admin

```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean,
  photo: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Setting

```javascript
{
  settingKey: String,
  settingValue: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Application Models

#### Client

```javascript
{
  name: String,
  email: String,
  phone: String,
  address: String,
  company: String,
  taxNumber: String,
  customField: Object,
  createdAt: Date,
  updatedAt: Date
}
```

#### Invoice

```javascript
{
  number: String,
  client: ObjectId (ref: 'Client'),
  date: Date,
  dueDate: Date,
  items: [
    {
      name: String,
      description: String,
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  subTotal: Number,
  taxRate: Number,
  taxAmount: Number,
  total: Number,
  status: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Quote

```javascript
{
  number: String,
  client: ObjectId (ref: 'Client'),
  date: Date,
  expiryDate: Date,
  items: [
    {
      name: String,
      description: String,
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  subTotal: Number,
  taxRate: Number,
  taxAmount: Number,
  total: Number,
  status: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Payment

```javascript
{
  number: String,
  client: ObjectId (ref: 'Client'),
  invoice: ObjectId (ref: 'Invoice'),
  date: Date,
  amount: Number,
  paymentMode: ObjectId (ref: 'PaymentMode'),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### PaymentMode

```javascript
{
  name: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Taxes

```javascript
{
  name: String,
  rate: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## API Design

The API follows RESTful principles with consistent endpoint patterns:

### Common Endpoints for All Entities

- `POST /api/{entity}/create`: Create a new entity
- `GET /api/{entity}/read/:id`: Read an entity by ID
- `PATCH /api/{entity}/update/:id`: Update an entity by ID
- `DELETE /api/{entity}/delete/:id`: Delete an entity by ID
- `GET /api/{entity}/search`: Search entities
- `GET /api/{entity}/list`: List entities with pagination
- `GET /api/{entity}/listAll`: List all entities
- `GET /api/{entity}/filter`: Filter entities
- `GET /api/{entity}/summary`: Get entity summary

### Special Endpoints

- `POST /api/{entity}/mail`: Send email (for invoice, quote, payment)
- `GET /api/quote/convert/:id`: Convert a quote to an invoice

## Authentication and Authorization

### Authentication Flow

1. User submits login credentials (email and password)
2. Server validates credentials
3. If valid, server generates a JWT token
4. Token is returned to the client
5. Client stores the token in local storage
6. Client includes the token in the Authorization header for subsequent requests

### JWT Structure

```javascript
{
  sub: userId,
  name: userName,
  email: userEmail,
  role: userRole,
  iat: issuedAt,
  exp: expiresAt
}
```

### Authorization Middleware

The `createAuthMiddleware` function in `src/controllers/middlewaresControllers/createAuthMiddleware` creates middleware for checking if a user is authenticated and authorized to access a resource.

## Error Handling

### Backend Error Handling

The application uses a centralized error handling approach with the `errorHandlers.js` file in the `src/handlers` directory.

The `catchErrors` middleware wraps async route handlers to catch and forward errors to the error handler.

### Frontend Error Handling

API requests are handled using the `request.js` file in the `src/request` directory, which includes error handling for different HTTP status codes.

## Testing

### Backend Testing

To run backend tests:

```bash
cd backend
npm test
```

### Frontend Testing

To run frontend tests:

```bash
cd frontend
npm test
```

## Deployment

### Production Build

#### Backend

```bash
cd backend
npm run build
```

#### Frontend

```bash
cd frontend
npm run build
```

### Deployment Options

- **Self-hosted**: Deploy the application on your own server
- **Docker**: Use Docker to containerize the application
- **Cloud Platforms**: Deploy to AWS, Google Cloud, or Azure

## Contributing Guidelines

Please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file for detailed information on how to contribute to the project.

### Development Workflow

1. Fork the repository
2. Create a feature branch from the `dev` branch
3. Make your changes
4. Write or update tests
5. Ensure all tests pass
6. Submit a pull request to the `dev` branch

### Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Write clear comments
- Document your code

### Commit Guidelines

Use the following format for commit messages:

- `feat: add new feature`
- `fix: fix a bug`
- `docs: update documentation`
- `style: format code`
- `refactor: refactor code`
- `test: add or update tests`
- `chore: update build tasks`