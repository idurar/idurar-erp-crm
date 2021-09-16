const CronJob = require("cron").CronJob;
const fs = require("fs");
const path = require("path");
const uploadsDir = path.join(__dirname, "../") + "/download";
const rimraf = require("rimraf");

// this job will be executed every 45 mins; this could be change to any value
var job = new CronJob(
  "0 */45 * * * *",
  function () {
    // reading files from the directory
    fs.readdir(uploadsDir, function (err, files) {
      // looping over all the found files
      files.forEach(function (file, index) {
        // opening file stats
        fs.stat(path.join(uploadsDir, file), function (err, stat) {
          var endTime, now;
          if (err) {
            return console.error(err);
          }

          // geting current dateTIme to compare
          now = new Date().getTime();

          // get file creation time and add 24 hours
          endTime = new Date(stat.ctime).getTime() + 3600000 * 24;

          //  compare and see if the 24 hours passed or not yet
          if (now > endTime) {
            // if yes delete that file
            return rimraf(path.join(uploadsDir, file), function (err) {
              if (err) {
                return console.error(err);
              }
              console.log("successfully deleted");
            });
          }
        });
      });
    });
  },
  null,
  true,
  "Africa/Algiers"
);

// this will start the job after calling it from terminal "node deleteFiles.js"
job.start();
