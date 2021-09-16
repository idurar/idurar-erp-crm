const CronJob = require("cron").CronJob;
const path = require("path");
const uploadsDir = path.join(__dirname, "../") + "/public/uploads/";
var audioConverter = require("audio-converter");

var job = new CronJob(
  "* * * * * *",
  function () {
    console.log("You will see this message 45 minutes");
    console.warn(uploadsDir);
    // __________________________audioConverter_______________________________________________

    audioConverter(uploadsDir, uploadsDir, {
      chunkSize: 100,
      mp3Only: true,
    })
      .then(function () {
        console.log("Done!");
      })
      .catch((err) => {
        console.warn("failed");
        console.warn(err);
      });

    /*fs.readdir(uploadsDir, function(err, files) {
      console.warn(uploadsDir)
    files.forEach(function(file, index) {
      fs.stat(path.join(uploadsDir, file), function(err, stat) {
          console.warn(path.extname(file) == ".wav")


// __________________________mp3ify_______________________________________________


/*    exec("mp3ify /public/uploads --bitrate 320", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    }); */

    // __________________________node-lame_______________________________________________
    /*        if(path.extname(file) == ".wav"){

            let input = fs.createReadStream(uploadsDir+file);
            let output = fs.createWriteStream(uploadsDir+'test.mp3');

        // start reading the WAV file from the input
        var reader = new wav.Reader();

        // we have to wait for the "format" event before we can start encoding
        reader.on('format', onFormat);

        // and start transferring the data
        input.pipe(reader);

        function onFormat (format) {
        console.error('WAV format: %j', format);

        // encoding the wave file into an MP3 is as simple as calling pipe()
        var encoder =  new lame().Encoder(format);
        reader.pipe(encoder).pipe(output);
          }
        } */

    //  });
    //});
    //});
  },
  null,
  true,
  "Africa/Algiers"
);

job.start();
