const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();
const multer=require('multer');

const upload=multer({
  storage:multer.memoryStorage(),
  limits:{fileSize:5*1024*1024},
});

const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');
const importClients = require('@/controllers/appControllers/clientController/import');
const importInvoices=require('@/controllers/appControllers/invoiceController/import')

const routerApp = (entity, controller) => {
  router.route(`/${entity}/create`).post(catchErrors(controller['create']));
  router.route(`/${entity}/read/:id`).get(catchErrors(controller['read']));
  router.route(`/${entity}/update/:id`).patch(catchErrors(controller['update']));
  router.route(`/${entity}/delete/:id`).delete(catchErrors(controller['delete']));
  router.route(`/${entity}/search`).get(catchErrors(controller['search']));
  router.route(`/${entity}/list`).get(catchErrors(controller['list']));
  router.route(`/${entity}/listAll`).get(catchErrors(controller['listAll']));
  router.route(`/${entity}/filter`).get(catchErrors(controller['filter']));
  router.route(`/${entity}/summary`).get(catchErrors(controller['summary']));

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment') {
    router.route(`/${entity}/mail`).post(catchErrors(controller['mail']));
  }

  if (entity === 'quote') {
    router.route(`/${entity}/convert/:id`).get(catchErrors(controller['convert']));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

router.route('/client/import').post(upload.single('file'), catchErrors(importClients));
router.route('/invoice/import').post(upload.single('file'), catchErrors(importInvoices));

module.exports = router;
