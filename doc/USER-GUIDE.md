# IDURAR ERP/CRM User Guide

This comprehensive guide will help you navigate and use the IDURAR ERP/CRM system effectively.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard](#dashboard)
4. [Client Management](#client-management)
5. [Invoice Management](#invoice-management)
6. [Quote Management](#quote-management)
7. [Payment Management](#payment-management)
8. [Settings](#settings)
9. [User Profile](#user-profile)
10. [Troubleshooting](#troubleshooting)

## Introduction

IDURAR is an open-source ERP/CRM system designed to help businesses manage their clients, invoices, quotes, and payments efficiently. Built on the MERN stack (MongoDB, Express.js, React.js, Node.js), it provides a modern and intuitive interface for all your business management needs.

### Key Features

- **Client Management**: Store and manage client information
- **Invoice Management**: Create, send, and track invoices
- **Quote Management**: Create and convert quotes to invoices
- **Payment Management**: Record and track payments
- **Dashboard**: Get an overview of your business performance
- **Multi-language Support**: Use the system in your preferred language
- **Customizable Settings**: Adapt the system to your business needs

## Getting Started

### Logging In

1. Navigate to the login page
2. Enter your email and password
3. Click "Login"

If you've forgotten your password, click on "Forgot Password" and follow the instructions to reset it.

### System Navigation

The system has a sidebar menu that provides access to all main features:

- **Dashboard**: Overview of your business performance
- **Clients**: Manage your clients
- **Invoices**: Create and manage invoices
- **Quotes**: Create and manage quotes
- **Payments**: Record and track payments
- **Settings**: Configure system settings
- **Profile**: Manage your user profile

## Dashboard

The dashboard provides a quick overview of your business performance with various widgets:

- **Financial Summary**: Total revenue, outstanding invoices, and paid invoices
- **Recent Invoices**: List of recently created invoices
- **Recent Payments**: List of recently recorded payments
- **Client Statistics**: Number of active clients and new clients
- **Invoice Status**: Distribution of invoice statuses (draft, sent, paid, overdue)

## Client Management

### Viewing Clients

1. Click on "Clients" in the sidebar menu
2. View the list of all clients
3. Use the search bar to find specific clients
4. Click on a client to view their details

### Adding a New Client

1. Click on "Clients" in the sidebar menu
2. Click the "Add Client" button
3. Fill in the client details:
   - Name (required)
   - Email (required)
   - Phone
   - Address
   - Company
   - Tax Number
   - Custom Fields (if any)
4. Click "Save" to create the client

### Editing a Client

1. Click on "Clients" in the sidebar menu
2. Find the client you want to edit
3. Click on the "Edit" button (pencil icon)
4. Update the client details
5. Click "Save" to update the client

### Deleting a Client

1. Click on "Clients" in the sidebar menu
2. Find the client you want to delete
3. Click on the "Delete" button (trash icon)
4. Confirm the deletion

## Invoice Management

### Viewing Invoices

1. Click on "Invoices" in the sidebar menu
2. View the list of all invoices
3. Use the search bar to find specific invoices
4. Click on an invoice to view its details

### Creating a New Invoice

1. Click on "Invoices" in the sidebar menu
2. Click the "Add Invoice" button
3. Fill in the invoice details:
   - Select a client (required)
   - Invoice date (required)
   - Due date (required)
   - Invoice items (name, description, quantity, price)
   - Tax rate (if applicable)
   - Notes (if any)
4. Click "Save" to create the invoice

### Editing an Invoice

1. Click on "Invoices" in the sidebar menu
2. Find the invoice you want to edit
3. Click on the "Edit" button (pencil icon)
4. Update the invoice details
5. Click "Save" to update the invoice

### Sending an Invoice

1. Click on "Invoices" in the sidebar menu
2. Find the invoice you want to send
3. Click on the "Send" button (envelope icon)
4. Enter the recipient email address
5. Customize the email subject and message (if needed)
6. Click "Send" to send the invoice

### Recording a Payment for an Invoice

1. Click on "Invoices" in the sidebar menu
2. Find the invoice you want to record a payment for
3. Click on the "Record Payment" button (dollar icon)
4. Fill in the payment details:
   - Payment date (required)
   - Payment amount (required)
   - Payment mode (required)
   - Notes (if any)
5. Click "Save" to record the payment

## Quote Management

### Viewing Quotes

1. Click on "Quotes" in the sidebar menu
2. View the list of all quotes
3. Use the search bar to find specific quotes
4. Click on a quote to view its details

### Creating a New Quote

1. Click on "Quotes" in the sidebar menu
2. Click the "Add Quote" button
3. Fill in the quote details:
   - Select a client (required)
   - Quote date (required)
   - Expiry date (required)
   - Quote items (name, description, quantity, price)
   - Tax rate (if applicable)
   - Notes (if any)
4. Click "Save" to create the quote

### Editing a Quote

1. Click on "Quotes" in the sidebar menu
2. Find the quote you want to edit
3. Click on the "Edit" button (pencil icon)
4. Update the quote details
5. Click "Save" to update the quote

### Sending a Quote

1. Click on "Quotes" in the sidebar menu
2. Find the quote you want to send
3. Click on the "Send" button (envelope icon)
4. Enter the recipient email address
5. Customize the email subject and message (if needed)
6. Click "Send" to send the quote

### Converting a Quote to an Invoice

1. Click on "Quotes" in the sidebar menu
2. Find the quote you want to convert
3. Click on the "Convert to Invoice" button
4. Review the invoice details
5. Click "Save" to create the invoice

## Payment Management

### Viewing Payments

1. Click on "Payments" in the sidebar menu
2. View the list of all payments
3. Use the search bar to find specific payments
4. Click on a payment to view its details

### Recording a New Payment

1. Click on "Payments" in the sidebar menu
2. Click the "Add Payment" button
3. Fill in the payment details:
   - Select a client (required)
   - Select an invoice (required)
   - Payment date (required)
   - Payment amount (required)
   - Payment mode (required)
   - Notes (if any)
4. Click "Save" to record the payment

### Editing a Payment

1. Click on "Payments" in the sidebar menu
2. Find the payment you want to edit
3. Click on the "Edit" button (pencil icon)
4. Update the payment details
5. Click "Save" to update the payment

### Sending a Payment Receipt

1. Click on "Payments" in the sidebar menu
2. Find the payment you want to send a receipt for
3. Click on the "Send Receipt" button (envelope icon)
4. Enter the recipient email address
5. Customize the email subject and message (if needed)
6. Click "Send" to send the payment receipt

## Settings

### Company Settings

1. Click on "Settings" in the sidebar menu
2. Click on "Company Settings"
3. Update your company details:
   - Company name
   - Email
   - Phone
   - Address
   - Tax number
   - Logo
4. Click "Save" to update the settings

### Finance Settings

1. Click on "Settings" in the sidebar menu
2. Click on "Finance Settings"
3. Update your finance settings:
   - Currency
   - Tax rate
   - Invoice prefix
   - Quote prefix
   - Payment prefix
4. Click "Save" to update the settings

### Money Format Settings

1. Click on "Settings" in the sidebar menu
2. Click on "Money Format Settings"
3. Update your money format settings:
   - Currency symbol
   - Currency symbol position
   - Decimal separator
   - Thousand separator
   - Number of decimal places
4. Click "Save" to update the settings

### General Settings

1. Click on "Settings" in the sidebar menu
2. Click on "General Settings"
3. Update your general settings:
   - Language
   - Date format
   - Time format
4. Click "Save" to update the settings

## User Profile

### Viewing Your Profile

1. Click on your profile picture in the top-right corner
2. Click on "Profile"
3. View your profile details

### Updating Your Profile

1. Click on your profile picture in the top-right corner
2. Click on "Profile"
3. Click on "Edit Profile"
4. Update your profile details:
   - Name
   - Email
   - Phone
   - Profile picture
5. Click "Save" to update your profile

### Changing Your Password

1. Click on your profile picture in the top-right corner
2. Click on "Profile"
3. Click on "Change Password"
4. Enter your current password
5. Enter your new password
6. Confirm your new password
7. Click "Save" to update your password

## Troubleshooting

### Common Issues and Solutions

#### Login Issues

- **Issue**: Cannot log in with correct credentials
  - **Solution**: Make sure you're using the correct email address and password. If you've forgotten your password, use the "Forgot Password" feature to reset it.

#### Invoice Creation Issues

- **Issue**: Cannot create an invoice
  - **Solution**: Make sure you've selected a client and filled in all required fields (invoice date, due date, at least one item).

#### Email Sending Issues

- **Issue**: Cannot send emails
  - **Solution**: Check your email settings in the company settings. Make sure the email address is valid and properly configured.

#### PDF Generation Issues

- **Issue**: Cannot generate PDF
  - **Solution**: Make sure you have filled in all required fields for the document. If the issue persists, try refreshing the page and trying again.

### Getting Help

If you encounter any issues that are not covered in this guide, you can:

1. Check the [GitHub repository](https://github.com/idurar/idurar-erp-crm) for known issues
2. Create a new issue on GitHub if you've found a bug
3. Reach out to the community for help

Remember to provide as much detail as possible when reporting issues, including:
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and operating system information