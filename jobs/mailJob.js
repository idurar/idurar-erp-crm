const schedule = require("node-schedule");
const mail = require("../handlers/mail");

// here we insert the date  and time like this to convert it
const date = new Date(2020, 01, 26, 22, 03, 0);

module.exports = job = (when) => {
  console.log(when);
  var j = schedule.scheduleJob(date, function () {
    mail.send({
      filename: "email-layout",
      email: "abdoumjr@gmail.com",
      subject: "hello",
    });
  });
};
