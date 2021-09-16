function AudioRecorder(options) {
  const defaultOptios = {
    onProgress: function (time) {},
    onStart: function ({ gIsRecording, gNode, gAudioSrc }) {},
    onStop: function ({ gIsRecording, gNode, gAudioSrc, blob }) {},
    onReady: function () {},
    onLog: function (string) {},
    onStatus: function (string) {},
  };
  if (options == undefined) {
    options = {};
  }
  options = Object.assign(defaultOptios, options);

  console.log({ options });
  //console.log({recorder});
  //return;
  var maxBuffers = 0;
  var timer = 0;
  var timeInterval = null;
  var gAudio = null; //Audio context
  var gAudioSrc = null; //Audio source
  var gNode = null; //The audio processor node
  var gIsLame = true; //Has lame.min.js been loaded?
  var gLame = null; //The LAME encoder library
  var gEncoder = null; //The MP3 encoder object
  var gStrmMp3 = []; //Collection of MP3 buffers
  var gIsRecording = false;
  var gCfg = {
    //Encoder configuration
    chnlCt: 1, //1=mono, 2=stereo
    bufSz: 4096, //input buffer size (bytes), 16bit signed int.
    sampleRate: 44100, //Input sample rate (samples per second)
    bitRate: 64, //Output bit rate (9-128)
  };
  var gPcmCt = 0; //Total input bytes
  var gMp3Ct = 0; //Total output bytes
  var timeLimit = 2 * 60 * 60 * 1000;

  status("00:00:00", "init");

  function Init() {
    status("Loading...");
    var caps = {
      audio: true,
    };
    try {
      window.AudioContext =
        window.AudioContext || window.webkitAudioContext || AudioContext;
      navigator.getAdminMedia =
        navigator.getAdminMedia ||
        navigator.webkitGetAdminMedia ||
        navigator.mozGetAdminMedia ||
        navigator.msGetAdminMedia ||
        MediaDevices.getAdminMedia;
      if (!(gAudio = new window.AudioContext())) {
        status("OPPS: Unable to create AudioContext.");
      } else {
        navigator.getAdminMedia(
          caps,
          function (stream) {
            if (!(gAudioSrc = gAudio.createMediaStreamSource(stream))) {
              status("OPPS: Unable to create audio source.");
            } else if (!gIsLame) {
              status("Loading... "); //Fetching encoder...
              loadScript(
                "lame",
                "https://aws.nlited.org/js/lame.js",
                LameCreate
              );
            } else {
              LameCreate();
            }
          },
          function (ex) {
            console.log(ex);
            status("OPPS: " + ex);
          }
        );
      }
    } catch (ex) {
      status("OPPS: Unable to find any audio support.");
      gAudio = null;
    }
  }
  //Shut everything down.
  function Destory() {
    log("Power down...");
    if (gIsRecording) {
      log("ERR: PowerOff: You need to stop recording first.");
    } else {
      gEncoder = null;
      gLame = null;
      gNode = null;
      gAudioSrc = null;
      gAudio = null;
      log("Power OFF.");
    }
  }
  //Called when audio capture has been created.

  //Called when the lame library has been loaded.
  function LameCreate() {
    gIsLame = true;
    if (!(gEncoder = Mp3Create())) {
      log("OPPS: Unable to create MP3 encoder.");
    } else {
      gStrmMp3 = [];
      gPcmCt = 0;
      gMp3Ct = 0;
      if (options.onReady) {
        options.onReady();
      }
      proccessRecording();
    }
  }
  //Create the mp3 encoder object.
  function Mp3Create() {
    if (!(gLame = new lamejs())) {
      log("OPPS: Unable to create LAME object.");
    } else if (
      !(gEncoder = new gLame.Mp3Encoder(
        gCfg.chnlCt,
        gCfg.sampleRate,
        gCfg.bitRate
      ))
    ) {
      log("OPPS: Unable to create MP3 encoder.");
    } else {
      log("MP3 encoder created.");
    }
    return gEncoder;
  }

  function convertSeconds(sec) {
    sec = parseInt(sec);
    var hrs = Math.floor(sec / 3600);
    var min = Math.floor((sec - hrs * 3600) / 60);
    var seconds = sec - hrs * 3600 - min * 60;
    seconds = Math.round(seconds * 100) / 100;

    var result = hrs < 10 ? "0" + hrs : hrs;
    result += ":" + (min < 10 ? "0" + min : min);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return result;
  }

  function startRecording() {
    Init();
  }
  function proccessRecording() {
    var creator;
    //status("Start recording...");

    if (!gAudio) {
      status("ERR: No Audio source.");
    } else if (!gEncoder) {
      log("OPPS: No encoder.");
    } else if (gIsRecording) {
      log("OPPS: Already recording.");
    } else {
      //Create the audio capture node.
      if (!gNode) {
        if (
          !(creator =
            gAudioSrc.context.createScriptProcessor ||
            gAudioSrc.createJavaScriptNode)
        ) {
          log("OPPS: No processor creator?");
        } else if (
          !(gNode = creator.call(
            gAudioSrc.context,
            gCfg.bufSz,
            gCfg.chnlCt,
            gCfg.chnlCt
          ))
        ) {
          log("OPPS: Unable to create processor node.");
        }
      }
      if (!gNode) {
        log("OPPS: onRecord: No processor node.");
      } else {
        var processor = gAudioSrc.context;
        maxBuffers = Math.ceil((timeLimit * processor.sampleRate) / 1024);
        //Set callbacks, connect the node between the audio source and destination.
        gNode.onaudioprocess = onAudioProcess;
        gAudioSrc.connect(gNode);
        gNode.connect(gAudioSrc.context.destination);
        gIsRecording = true;

        var timer = 0;
        log("RECORD");
        status("00:00:00");
        timeInterval = setInterval(function () {
          timer++;
          var time = convertSeconds(timer);
          if (options.onProgress) {
            options.onProgress(time);
          }
          status(`${time}`);
        }, 1000);

        if (options.onStart) {
          options.onStart({
            gIsRecording,
            gNode,
            gAudioSrc,
          });
        }
      }
    }
  }

  //Stop recording
  function stopRecording(btn) {
    log("Stop recording...");
    if (!gAudio) {
      log("OPPS: onStop: No audio.");
    } else if (!gAudioSrc) {
      log("OPPS: onStop: No audio source.");
    } else if (!gIsRecording) {
      log("OPPS: onStop: Not recording.");
    } else {
      //Disconnect the node
      gNode.onaudioprocess = null;
      gAudioSrc.disconnect(gNode);
      gNode.disconnect();
      gIsRecording = false;
      //Flush the last mp3 buffer.
      var mp3 = gEncoder.flush();
      if (mp3.length > 0) gStrmMp3.push(mp3);
      //Present the mp3 stream on the page.
      var blob = new Blob(gStrmMp3, {
        type: "audio/mp3",
      });
      clearInterval(timeInterval);
      Destory();
      if (options.onStop) {
        options.onStop({
          blob,
          gNode,
          gAudioSrc,
          gNode,
          gIsRecording,
        });
      }
      log("STOP");
    }
  }
  //Process a single audio buffer.
  //Input is an array of floating-point samples.
  function onAudioProcess(e) {
    if (gMp3Ct > maxBuffers) return;

    var inBuf = e.inputBuffer;
    var samples = inBuf.getChannelData(0);
    var sampleCt = samples.length;
    //Convert floating-point to 16bit signed int.
    //This may modify the number of samples.
    var samples16 = convertFloatToInt16(samples);
    if (samples16.length > 0) {
      gPcmCt += samples16.length * 2;
      //Encode PCM to mp3
      var mp3buf = gEncoder.encodeBuffer(samples16);
      var mp3Ct = mp3buf.length;
      if (mp3Ct > 0) {
        //Add buffer to in-memory output stream.
        gStrmMp3.push(mp3buf);
        gMp3Ct += mp3Ct;
      }
      var pre = (gMp3Ct * 100) / gPcmCt;
    }
  }
  //Convert floating point to 16bit signed int.
  function convertFloatToInt16(inFloat) {
    var sampleCt = inFloat.length;
    var outInt16 = new Int16Array(sampleCt);
    for (var n1 = 0; n1 < sampleCt; n1++) {
      //This is where I can apply waveform modifiers.
      var sample16 = 0x8000 * inFloat[n1];
      //Clamp value to avoid integer overflow, which causes audible pops and clicks.
      sample16 =
        sample16 < -32767 ? -32767 : sample16 > 32767 ? 32767 : sample16;
      outInt16[n1] = sample16;
    }
    return outInt16;
  }

  function loadScript(name, path, cb) {
    var node = document.createElement("SCRIPT");
    node.type = "text/javascript";
    node.src = path;
    var head = document.getElementsByTagName("HEAD");
    if (head[0] != null) head[0].appendChild(node);
    if (cb != null) {
      node.onreadystagechange = cb;
      node.onload = cb;
    }
  }

  function log(fmt) {
    console.log("log", fmt);
    if (options.onLog) {
      options.onLog(fmt);
    }
  }

  function status(fmt, type) {
    console.log("status", fmt);
    if (options.onStatus) {
      options.onStatus(fmt, type);
    }
  }

  return {
    init: Init,
    destory: Destory,
    startRecording,
    stopRecording,
  };
}
export default AudioRecorder;
