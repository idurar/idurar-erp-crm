# Tutorial: Creating a Document in a Collection

In this tutorial, we will learn how to create a new document in a collection using Mongoose, a MongoDB object modeling tool for Node.js. We will be using the `create` function defined in the provided JavaScript file.

## Prerequisites
Before we begin, make sure you have the following:

- Node.js and npm installed on your machine
- MongoDB installed and running

## Getting Started
To get started, let's first create a new directory for our project and navigate into it. Open your terminal and run the following commands:

```shell
mkdir create-document-tutorial
cd create-document-tutorial
```

Next, let's initialize a new Node.js project by running the following command:

```shell
npm init -y
```

This will create a new `package.json` file in the current directory.

## Installing Dependencies
We need to install the required dependencies for our project. In this case, we only need `mongoose`. Run the following command to install it:

```shell
npm install mongoose
```

## Connecting to MongoDB
Before we can create a document, we need to establish a connection to our MongoDB database. Create a new file called `index.js` and add the following code:

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
```

Make sure to replace `'mongodb://localhost/mydatabase'` with the appropriate connection URL for your MongoDB database.

## Creating the Document
Now, let's create a new file called `createDocument.js` and copy the provided JavaScript code into it. This code exports a function named `create` that accepts three parameters: `Model`, `req`, and `res`. It is responsible for creating a new document in the specified collection based on the `req` body.

To use this function, we need to import the necessary models. Add the following code at the beginning of the `createDocument.js` file:

```javascript
const mongoose = require('mongoose');

const People = mongoose.model('People');
const Company = mongoose.model('Company');
```

Make sure you have defined the `People` and `Company` models in your project.

## Understanding the Code
Let's go through the code step by step to understand what it does.

### Step 1: Input Validation
The code first checks if the `req.body.type` is equal to `'people'` or not. If it is, it checks if the `req.body.people` is defined. If not, it returns a JSON response with a status of `403` and a message indicating that a people selection is required.

If the `req.body.type` is not equal to `'people'`, it checks if the `req.body.company` is defined. If not, it returns a JSON response with a status of `403` and a message indicating that a company selection is required.

### Step 2: Checking for Existing Client
Next, the code checks if a client with the same people or company already exists in the collection. If it does, it returns a JSON response with a status of `403` and a message indicating that the client already exists.

### Step 3: Updating People or Company
If the client does not exist, the code updates the `isClient` field of the `People` or `Company` document based on the `req.body.type`. It uses the `findOneAndUpdate` method provided by Mongoose to update the document and retrieve the updated values.

### Step 4: Setting the Name and Clearing the Unused Field
After updating the `isClient` field, the code sets the `req.body.name` to the concatenated `firstname` and `lastname` (if `req.body.type` is `'people'`) or sets it to the `name` (if `req.body.type` is not `'people'`).

Finally, the code clears the unused field (`req.body.company` if `req.body.type` is `'people'`, or `req.body.people` if `req.body.type` is not `'people'`).

### Step 5: Saving the Document
The code sets the `req.body.removed` field to `false` and saves the new document using the `new Model(req.body).save()` method. The result is stored in the `result` variable.

### Step 6: Returning the Response
Lastly, the code returns a JSON response with a status of `200`, the `result` object, and a success message indicating that the document was successfully created.

## Using the `create` Function
To use the `create` function, we need to import it into the `index.js` file. Add the following code at the end of the `index.js` file:

```javascript
const create = require('./createDocument');

// Example usage
create(Model, req, res);
```

Make sure to replace `Model`, `req`, and `res` with the appropriate values for your application.

## Conclusion
In this tutorial, we learned how to create a new document in a collection using Mongoose. We covered the steps involved in the provided JavaScript code and explained each step in detail. Now you can use the `create` function to create documents in your MongoDB database.

You can find the complete code for this tutorial in the [GitHub repository](https://github.com/idurar/idurar-erp-crm).

If you have any questions or need further assistance, feel free to ask.

Happy coding!