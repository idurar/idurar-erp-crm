require('dotenv').config({ path: __dirname + '/../.variables.env' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

async function createAdmin() {
  try {
    const Admin = require('../models/erpModels/Admin');
    var newAdmin = new Admin();
    const passwordHash = newAdmin.generateHash('admin123');

    await new Admin({
      email: 'admin@demo.com',
      password: passwordHash,
      name: 'Salah Eddine',
      surname: 'Lalami',
    }).save();
    console.log('👍👍👍👍👍👍👍👍 Admin created : Done!');
    process.exit();
   
  } catch (e) {
    console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below');
    console.log(e);
    process.exit();
  }
}
createAdmin();
//  async function createCustomer() {
//  try {
//     const Customer = require('../models/erpModels/Customer');
//  //   var newCustomer = new Customer();
//     //const passwordHash = newAdmin.generateHash('admin123');
//  //var myDate = new Date("2016-05-18T16:00:00Z");
//    await  Customer.insertMany([{
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2016-05-18T16:00:00Z"),
//       Lastlogin:new Date("2016-05-18T16:00:00Z")
//     },
//     {
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2020-05-18T16:00:00Z"),
//       Lastlogin:new Date("2020-05-18T16:00:00Z")
//     },
//     {
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2021-05-18T16:00:00Z"),
//       Lastlogin:new Date("2021-05-18T16:00:00Z")
//     },
//     {
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2021-05-18T16:00:00Z"),
//       Lastlogin:new Date("2021-05-18T16:00:00Z")
//     },
//     {
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2022-05-18T16:00:00Z"),
//       Lastlogin:new Date("2022-05-18T16:00:00Z")
//     },
//     {
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2023-08-11T16:00:00Z"),
//       Lastlogin:new Date("2023-08-11T16:00:00Z")
//     },
//     {
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2023-08-11T16:00:00Z"),
//       Lastlogin:new Date("2023-03-11T16:00:00Z")
//     },
//     {
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2023-08-11T16:00:00Z"),
//       Lastlogin:new Date("2023-08-11T16:00:00Z")
//     },
//     {
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2023-08-11T16:00:00Z"),
//       Lastlogin:new Date("2023-08-11T16:00:00Z")
//     },
//     {
//       email: 'micheal@demo.com',
//       username: 'micheal',
//       mobile: '8104730226',
//       created: new Date("2023-08-11T16:00:00Z"),
//       Lastlogin:new Date("2023-08-11T16:00:00Z")
//     }]
//     ) .then((result) => {
//     console.log('Documents inserted:', result);
//   })
//   .catch((error) => {
//     console.error('Insert error:', error);
//   });
//     console.log('👍👍👍👍👍👍👍👍 Customers created : Done!');
//     process.exit();

//      } catch (e) {
//     console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below');
//     console.log(e);
//     process.exit();
//   }
// }

// createCustomer();