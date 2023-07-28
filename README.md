# ERP / CRM Open Source based on (Node.js/React.js)

IDURAR is Open Source ERP / CRM (Invoice / Inventory / Accounting / HR) Based on Advanced Mern Stack (Node.js / Express.js / MongoDb / React.js ) with Ant Design (AntD) and Redux

```
Can you star our  Open Source ERP / CRM repo? 🤩 !
```

![Open Source ERP / CRM - MERN Stack (Node.js/React.js)](https://user-images.githubusercontent.com/50052356/141647096-dcb66696-6103-4850-ae21-9fc97a412252.png)
![Open Source ERP / CRM - MERN Stack (Node.js/React.js)](https://user-images.githubusercontent.com/50052356/141647100-9dfd6ee5-f873-42a8-8923-88bd0cf53606.png)

## Open Source ERP / CRM App

IDURAR is Open Source ERP / CRM (Invoice / Inventory / Accounting / HR) Based on Mern Stack (Node.js / Express.js / MongoDb / React.js ) with Ant Design (AntD) and Redux

**Live App Demo** : [https://idurarapp.com/open-source-erp-crm/](https://idurarapp.com/open-source-erp-crm/) "Please use chrome"

`username : admin@demo.com password : admin123`


# Run the App Locally
This is a guide on how to run the idurar-erp-crm application locally.

## Prerequisites

- Node.js (version 14 is recommended)
- MongoDB installed locally

## Steps

### 1. Clone the repository

`
git clone https://github.com/idurar/idurar-erp-crm.git
cd idurar-erp-crm
`

### 2. Install the dependencies

`
npm install
`

### 3. Setup MongoDB

First, start MongoDB service:

`sudo service mongod start`

Then, create a new MongoDB database and user:

`
mongo
use idurar-erp-crm
db.createUser({user: 'user-me', pwd: 'password123', roles: [{role: 'readWrite', db: 'idurar-erp-crm'}]})
exit
`

### 4. Setup environment variables

Rename the `.tmp.variables.env` file to `.variables.env`:

`
mv .tmp.variables.env .variables.env
`

Then, open the `.variables.env` file and set the `DATABASE` variable to your MongoDB URI:

`
nano .variables.env
`

Change the line with `DATABASE` to:

`
DATABASE=mongodb://user-me:password123@localhost:27017/idurar-erp-crm
`

Save and close the file.

### 5. Run setup script

This will create an admin user:

`
node ./setup/setup.js
`

### 6. Start the backend server

`
npm start
`

The backend server should now be running at `http://localhost:8888`.

### 7. Setup and start the frontend server

Navigate to the frontend directory and install its dependencies:

`
cd frontend
npm install
`

Then, start the frontend server:

`
npm start
`

The frontend should now be running at `http://localhost:3000`.

Now, you should be able to access the application in your web browser at `http://localhost:3000/login`.
