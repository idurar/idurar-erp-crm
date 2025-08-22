# IDURAR ERP/CRM API Documentation

This document provides comprehensive documentation for the IDURAR ERP/CRM API endpoints, including request parameters, response formats, and examples.

## Table of Contents

1. [Authentication](#authentication)
2. [Common Endpoints](#common-endpoints)
3. [Client Management](#client-management)
4. [Invoice Management](#invoice-management)
5. [Quote Management](#quote-management)
6. [Payment Management](#payment-management)
7. [Settings Management](#settings-management)
8. [Error Handling](#error-handling)

## Authentication

### Login

Authenticates a user and returns a JWT token.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "your_password"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "token": "jwt_token_here",
      "user": {
        "_id": "user_id",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
      }
    }
  }
  ```

### Forgot Password

Sends a password reset link to the user's email.

- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "admin@example.com"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "result": "Password reset link sent to your email"
  }
  ```

### Reset Password

Resets the user's password using a token.

- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "token": "reset_token_here",
    "password": "new_password"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "result": "Password reset successful"
  }
  ```

## Common Endpoints

All entities in the system (clients, invoices, quotes, payments, etc.) share a common set of endpoints with the following pattern:

### Create Entity

- **URL**: `/api/{entity}/create`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**: Entity-specific data
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "_id": "entity_id",
      ...entity_data
    }
  }
  ```

### Read Entity

- **URL**: `/api/{entity}/read/{id}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "_id": "entity_id",
      ...entity_data
    }
  }
  ```

### Update Entity

- **URL**: `/api/{entity}/update/{id}`
- **Method**: `PATCH`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**: Entity-specific data to update
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "_id": "entity_id",
      ...updated_entity_data
    }
  }
  ```

### Delete Entity

- **URL**: `/api/{entity}/delete/{id}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "_id": "entity_id",
      ...deleted_entity_data
    }
  }
  ```

### Search Entities

- **URL**: `/api/{entity}/search`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `q`: Search query
  - `fields`: Comma-separated list of fields to search in
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "items": [...entities],
      "totalItems": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
  ```

### List Entities

- **URL**: `/api/{entity}/list`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `sort`: Field to sort by (default: createdAt)
  - `order`: Sort order (asc/desc, default: desc)
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "items": [...entities],
      "totalItems": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
  ```

### List All Entities

- **URL**: `/api/{entity}/listAll`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
  ```json
  {
    "success": true,
    "result": [...entities]
  }
  ```

### Filter Entities

- **URL**: `/api/{entity}/filter`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: Entity-specific filter parameters
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "items": [...filtered_entities],
      "totalItems": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
  ```

### Entity Summary

- **URL**: `/api/{entity}/summary`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "totalCount": 100,
      ...entity_specific_summary_data
    }
  }
  ```

## Client Management

Clients represent customers in the system.

### Client Object Structure

```json
{
  "_id": "client_id",
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "company": "Company Name",
  "taxNumber": "TAX123456",
  "customField": {...},
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Invoice Management

Invoices represent billing documents sent to clients.

### Invoice Object Structure

```json
{
  "_id": "invoice_id",
  "number": "INV-001",
  "client": {
    "_id": "client_id",
    "name": "Client Name",
    ...client_data
  },
  "date": "2023-01-01T00:00:00.000Z",
  "dueDate": "2023-01-15T00:00:00.000Z",
  "items": [
    {
      "name": "Item Name",
      "description": "Item Description",
      "quantity": 1,
      "price": 100,
      "total": 100
    }
  ],
  "subTotal": 100,
  "taxRate": 10,
  "taxAmount": 10,
  "total": 110,
  "status": "draft|sent|paid|overdue|void",
  "notes": "Invoice notes",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Send Invoice Email

- **URL**: `/api/invoice/mail`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "id": "invoice_id",
    "to": "client@example.com",
    "subject": "Invoice INV-001",
    "message": "Please find attached invoice."
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "result": "Email sent successfully"
  }
  ```

## Quote Management

Quotes represent price estimates sent to clients.

### Quote Object Structure

```json
{
  "_id": "quote_id",
  "number": "QT-001",
  "client": {
    "_id": "client_id",
    "name": "Client Name",
    ...client_data
  },
  "date": "2023-01-01T00:00:00.000Z",
  "expiryDate": "2023-01-15T00:00:00.000Z",
  "items": [
    {
      "name": "Item Name",
      "description": "Item Description",
      "quantity": 1,
      "price": 100,
      "total": 100
    }
  ],
  "subTotal": 100,
  "taxRate": 10,
  "taxAmount": 10,
  "total": 110,
  "status": "draft|sent|accepted|declined|expired",
  "notes": "Quote notes",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Send Quote Email

- **URL**: `/api/quote/mail`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "id": "quote_id",
    "to": "client@example.com",
    "subject": "Quote QT-001",
    "message": "Please find attached quote."
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "result": "Email sent successfully"
  }
  ```

### Convert Quote to Invoice

- **URL**: `/api/quote/convert/{id}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "_id": "invoice_id",
      ...invoice_data
    }
  }
  ```

## Payment Management

Payments represent money received from clients.

### Payment Object Structure

```json
{
  "_id": "payment_id",
  "number": "PAY-001",
  "client": {
    "_id": "client_id",
    "name": "Client Name",
    ...client_data
  },
  "invoice": {
    "_id": "invoice_id",
    "number": "INV-001",
    ...invoice_data
  },
  "date": "2023-01-01T00:00:00.000Z",
  "amount": 110,
  "paymentMode": {
    "_id": "payment_mode_id",
    "name": "Credit Card",
    ...payment_mode_data
  },
  "notes": "Payment notes",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Send Payment Receipt Email

- **URL**: `/api/payment/mail`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "id": "payment_id",
    "to": "client@example.com",
    "subject": "Payment Receipt PAY-001",
    "message": "Please find attached payment receipt."
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "result": "Email sent successfully"
  }
  ```

## Settings Management

### Company Settings

- **URL**: `/api/setting/company`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      "name": "Company Name",
      "email": "company@example.com",
      "phone": "+1234567890",
      "address": "123 Main St, City, Country",
      "taxNumber": "TAX123456",
      "logo": "logo_url",
      ...other_company_settings
    }
  }
  ```

### Update Company Settings

- **URL**: `/api/setting/company`
- **Method**: `PATCH`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**: Company settings to update
- **Success Response**:
  ```json
  {
    "success": true,
    "result": {
      ...updated_company_settings
    }
  }
  ```

## Error Handling

All API endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message description"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: Authentication token is missing or invalid
- `FORBIDDEN`: User does not have permission to perform the action
- `NOT_FOUND`: Requested resource not found
- `VALIDATION_ERROR`: Request data validation failed
- `INTERNAL_SERVER_ERROR`: Unexpected server error

### Validation Errors

For validation errors, additional details are provided:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  }
}
```