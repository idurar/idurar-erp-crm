import { uploadSync, deleteSync } from "../../axiosRequest";

import { formatDate } from "../../helper";

import AudioRecorder from "../../lib/audioRecorder";

//////// ***** report Module  : remove ***** //////////
const reportGrid = {
  recorder: function (recorderToggle) {
    var isRecording = false;
    var recordingIndex = 1;
    var recordButton = recorderToggle;
    var oldLabel = recordButton.innerHTML;
    const loaderWarpper = '.component[data-component="panel"] .panel';
    var recordingsStatus = recorderToggle;
    recordButton.addEventListener("click", function () {
      if (!isRecording) {
        isRecording = true;
        recordButton.disabled = true;
        startRecording();
      } else {
        isRecording = false;
        stopRecording();
      }
    });

    const audioRecorder = AudioRecorder({
      onStop: function ({ blob }) {
        createDownloadLink(blob);
        recordButton.innerHTML = oldLabel;
      },
      onReady: function () {
        this.isReady = true;
        recordButton.disabled = false;
      },
      onStatus: function (string, type) {
        if (type != "init") {
          recordingsStatus.innerHTML = string;
        }
      },
    });

    function startRecording() {
      audioRecorder.startRecording();
    }

    function stopRecording() {
      audioRecorder.stopRecording();
    }

    function createDownloadLink(blob) {
      const targetRecorder = recorderToggle.dataset.targetRecorder;
      var formData = new FormData();

      formData.append("name", `Recording ${recordingIndex}`);
      recordingIndex++;
      formData.append("audioFile", blob);
      formData.append("consultation", recorderToggle.dataset.id);
      const ajaxCall = uploadSync(targetRecorder, formData, { loaderWarpper });
      ajaxCall.then(function (response) {
        const datas = [];
        datas.push(response.result);
        const consultation = document.querySelector(
          '.component[data-component="consultationInfo"]'
        );
        if (consultation) {
          reportGrid.renderRecord(consultation, datas, false);
        }
      });
    }
  },

  play: function (el) {
    var isPlaying = false;
    var audioEl = document.createElement("audio");
    audioEl.src = el.dataset.src;
    audioEl.classList.add("hidden");
    el.append(audioEl);
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    });

    audioEl.addEventListener("play", function () {
      isPlaying = true;
      el.querySelector(".play").classList.add("hidden");
      el.querySelector(".pause").classList.remove("hidden");
    });
    audioEl.addEventListener("pause", function () {
      isPlaying = false;
      el.querySelector(".play").classList.remove("hidden");
      el.querySelector(".pause").classList.add("hidden");
    });
    function pause() {
      audioEl.pause();
    }
    function play() {
      document.querySelectorAll("audio").forEach(function (audio) {
        audio.pause();
      });
      audioEl.play();
    }
  },
  remove: function (component, element) {
    const id = element.dataset.id;
    const targetRecorder = component.dataset.targetRecorder;
    const loaderWarpper = '.component[data-component="panel"] .panel';

    document
      .getElementById("delete-record")
      .querySelector(".row-info").innerHTML = " : " + id;

    window.modal.open("delete-record");
    const currentModal = document.querySelector(".current-modal");
    if (currentModal) {
      const confirmButton = currentModal.querySelector(".delete-confirm");

      if (confirmButton) {
        confirmButton.removeEventListener("click", reportDeleteConfirm, false);
        confirmButton.addEventListener("click", reportDeleteConfirm, false);
      }
    }
    function reportDeleteConfirm() {
      window.modal.close();
      const ajaxCall = deleteSync(targetRecorder, id, { loaderWarpper });

      ajaxCall.then((response) => {
        //Rest all prescriptionForm
        if (response === undefined || response.success === false) {
          return;
        }

        if (response.success == true) {
          const className = `.report[data-id="${response.result._id}"]`;

          const selected = document.querySelector(className);

          if (selected) {
            selected.parentNode.removeChild(selected);
          }
        }
      });
    }
  },
  renderRecord: function (component, datas, multiple = true) {
    const orgreport = component.querySelector(".template .report");
    const reportItemList = component.querySelector(".reportItemList");
    if (multiple) {
      reportItemList.innerHTML = "";
      reportItemList.dataset.nbr = 0;
    }
    for (const data of datas) {
      const report = orgreport.cloneNode(true);
      const nbr = parseInt(reportItemList.dataset.nbr, 10) + 1 || 1;
      reportItemList.dataset.nbr = nbr;
      report.dataset.id = data._id;
      report.querySelector(
        "span[data-reportnbr]"
      ).innerHTML = `Rapport #${nbr}`;
      report.querySelector("span[data-reportdate]").innerHTML = formatDate(
        data.created
      );
      const playComponent = report.querySelector(".playPushButton");
      const removeRecord = report.querySelector(".remove");

      if (playComponent) {
        playComponent.dataset.src = "/" + data.audioFile;
        reportGrid.play(playComponent);
      }

      if (removeRecord) {
        removeRecord.dataset.id = data._id;
        removeRecord.dataset.displaylabel = data.audioFile;
      }

      reportItemList.appendChild(report);
    }
  },
};

export default reportGrid;
