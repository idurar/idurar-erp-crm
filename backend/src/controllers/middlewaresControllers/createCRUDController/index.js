import mongoose from 'mongoose';
import { modelsFiles } from '#models/utils/index.js';

import create from './create.js';
import read from './read.js';
import update from './update.js';
import remove from './remove.js';
import search from './search.js';
import filter from './filter.js';
import summary from './summary.js';
import listAll from './listAll.js';
import paginatedList from './paginatedList.js';
import Admin from '#models/coreModels/Admin.js';
import AdminPassword from '#models/coreModels/AdminPassword.js';
import Email from '#models/coreModels/Email.js';
import NoCodeCollections from '#models/coreModels/NoCodeCollections.js';
import Setting from '#models/coreModels/Setting.js';
import Upload from '#models/coreModels/Upload.js';
import Taxes from '#models/appModels/Taxes.js';
import Supplier from '#models/appModels/Supplier.js';
import Shipment from '#models/appModels/Shipment.js';
import Salary from '#models/appModels/Salary.js';
import SalaryPayment from '#models/appModels/SalaryPayment.js';
import Quote from '#models/appModels/Quote.js';
import Purchase from '#models/appModels/Purchase.js';
import Product from '#models/appModels/Product.js';
import ProductCategory from '#models/appModels/ProductCategory.js';
import People from '#models/appModels/People.js';
import PaymentMode from '#models/appModels/PaymentMode.js';
import Payment from '#models/appModels/Payment.js';
import Order from '#models/appModels/Order.js';
import Offer from '#models/appModels/Offer.js';
import Lead from '#models/appModels/Lead.js';
import Invoice from '#models/appModels/Invoice.js';
import InventoryAdjustment from '#models/appModels/InventoryAdjustment.js';
import Inventory from '#models/appModels/Inventory.js';
import ExpenseCategory from '#models/appModels/ExpenseCategory.js';
import Expense from '#models/appModels/Expense.js';
import Employee from '#models/appModels/Employee.js';
import Company from '#models/appModels/Company.js';
import Client from '#models/appModels/Client.js';
import Branch from '#models/appModels/Branch.js';

const createCRUDController = (modelName) => {
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  }

  const Model = mongoose.model(modelName);
  let crudMethods = {
    create: (req, res) => create(Model, req, res),
    read: (req, res) => read(Model, req, res),
    update: (req, res) => update(Model, req, res),
    delete: (req, res) => remove(Model, req, res),
    list: (req, res) => paginatedList(Model, req, res),
    listAll: (req, res) => listAll(Model, req, res),
    search: (req, res) => search(Model, req, res),
    filter: (req, res) => filter(Model, req, res),
    summary: (req, res) => summary(Model, req, res),
  };
  return crudMethods;
};

export default createCRUDController;
