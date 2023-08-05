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

## Getting started

### Step 1: Clone the repository

```bash
git clone https://github.com/idurar/idurar-erp-crm.git
```

```bash
cd idurar-erp-crm
```

### Step 2: Create Your MongoDB Account and Database/Cluster

- Create your own MongoDB account by visiting the MongoDB website and signing up for a new account.

- Create a new database or cluster by following the instructions provided in the MongoDB documentation. Remember to note down the "Connect to your application URI" for the database, as you will need it later. Also, make sure to change `<password>` with your own password

- add your current IP address to the MongoDB database's IP whitelist to allow connections (this is needed whenever your ip changes)

### Step 3: Rename the Environment File

Locate the file named tmp.variables.env in the root directory of the project and rename it to .variables.env. This file will be used to store the necessary environment variables for the project to run.

### Step 4: Update MongoDB URI

In the .variables.env file, find the line that reads:

`DATABASE="your-mongodb-uri"`

Replace "your-mongodb-uri" with the actual URI of your MongoDB database.

### Step 5: Install Backend Dependencies

In your terminal, navigate to the root directory of the project and run the following command to install the backend dependencies:

```bash
npm install
```

This command will install all the required packages specified in the package.json file.

### Step 6: Run Setup Script

While still in the root directory of the project, execute the following command to run the setup script:

```bash
node setup/setup.js
```

This setup script may perform necessary database migrations or any other initialization tasks required for the project.

### Step 7: Run the Backend Server

In the same terminal, run the following command to start the backend server:

```bash
npm run dev
```

This command will start the backend server, and it will listen for incoming requests.

### Step 8: Install Frontend Dependencies

Open a new terminal window , and run the following command to install the frontend dependencies:

```bash
cd frontend
```

```bash
npm install
```

This command will navigate to the frontend directory within the project and install all the required packages for the frontend.

### Step 9: Run the Frontend Server

After installing the frontend dependencies, run the following command in the same terminal to start the frontend server:

```bash
npm run start
```

This command will start the frontend server, and you'll be able to access the website on localhost:3000 in your web browser.

:exclamation: :warning:` If you encounter an OpenSSL error while running the frontend server, follow these additional steps:`

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

```bash
npm run start
```

### Website Login Credentials

Once the website is up and running, you can log in using the following credentials:

`username : admin@demo.com password : admin123`

Now you should be all set to run the project locally on your machine and explore its features.

## Show your support

Dont forget to give a ⭐️ to this project
Happy coding!
