/* eslint-disable no-unused-vars */

import {
  createSync,
  updateSync,
  filterSync,
  multiSync,
} from "../../axiosRequest";
import { activeTab, activeModel } from "../../core";

import delegate from "../../lib/delegate";

import medicamentGrid from "./medicamentGird";
import prescriptionGrid from "./prescriptionGrid";
import reportGrid from "./reportGrid";

function resetPrescriptionGrid(prescriptionGrid) {
  const currentRow = prescriptionGrid.querySelector(".currentRow");
  const medicamentRow = prescriptionGrid.querySelector(".medicament-row");
  if (medicamentRow) {
    medicamentRow.innerHTML = "";
  } else {
    return;
  }
  if (currentRow) {
    currentRow.dataset.action = "new";
    currentRow.dataset.id = null;
  } else {
    return;
  }
  const elements = currentRow.querySelectorAll("input, select, textarea");
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    element.value = "";
    element.dataset.value = "";
  }

  const autocompletes = currentRow.querySelectorAll(".autocomplete");

  [].forEach.call(autocompletes, function (autocomplete) {
    const select = autocomplete.querySelector("select");
    if (select != null) {
      if (select.parentNode) {
        select.parentNode.removeChild(select);
      }
    }
  });
}

//////// ***** Main Component  : prescriptionComponent ***** //////////

const consultationModule = {
  init: function (component) {
    const addNewRow = component.querySelector("button.newMedicament");
    const savePrescription = component.querySelector(".savePrescription");
    const prescriptionType = component.querySelector(".prescriptionType");
    const back = component.querySelector(".back");
    const prescriptionForms = component.querySelectorAll(".prescriptionForm");
    const recorderToggle = document.querySelector(
      '.component[data-component="recorder-toggle"]'
    );
    const form = component.querySelector("form");

    const loaderWarpper = '.model[data-model="prescription"]';

    delegate(
      document.body,
      ".prescriptionItem .remove",
      "click",
      function (e) {
        prescriptionGrid.remove(component, e.delegateTarget);
      },
      false
    );
    delegate(
      document.body,
      ".prescriptionItem .edit",
      "click",
      function (e) {
        prescriptionGrid.edit(component, e.delegateTarget);
      },
      false
    );
    delegate(
      document.body,
      ".prescriptionItem .download",
      "click",
      function (e) {
        prescriptionGrid.download(e.delegateTarget);
      },
      false
    );

    delegate(
      document.body,
      ".report .remove",
      "click",
      function (e) {
        reportGrid.remove(component, e.delegateTarget);
      },
      false
    );

    delegate(
      document.body,
      ".medicament-row .edit",
      "click",
      function (e) {
        medicamentGrid.edit(component, e.delegateTarget);
      },
      false
    );
    delegate(
      document.body,
      ".medicament-row .remove",
      "click",
      function (e) {
        medicamentGrid.remove(component, e.delegateTarget);
      },
      false
    );

    if (prescriptionType) {
      prescriptionType.addEventListener("change", function () {
        prescriptionGrid.type(component, this);
      });
    }

    if (back) {
      back.addEventListener("click", function () {
        form.dataset.status = "new";
        form.dataset.idPrescription = null;
        medicamentGrid.reset(component);
        [].forEach.call(prescriptionForms, function (prescriptionForm) {
          prescriptionGrid.resetForm(prescriptionForm);
        });
        activeModel("dataTable");
      });
    }
    if (recorderToggle) {
      reportGrid.recorder(recorderToggle);
    }

    addNewRow.addEventListener("click", function () {
      medicamentGrid.add(component);
    });

    form.addEventListener("keydown", function (event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });

    savePrescription.addEventListener(
      "click",
      function (event) {
        event.preventDefault();

        const calculationRows = component.querySelectorAll(".calculation-row");
        const letterFrom = component.querySelector(`.letter`);

        const form = component.querySelector("form");
        let prescriptionData = prescriptionGrid.formToObject(form);
        const type = prescriptionType.value;
        const status = form.dataset.status;
        const targetPrescription = component.dataset.targetPrescription;
        prescriptionData.medicamentsList = [];
        prescriptionData.letter = "";
        if (type == "letter") {
          const letter = letterFrom.querySelector("textarea");
          prescriptionData.letter = letter.value;
        } else {
          let medicamentList = [];

          [].forEach.call(calculationRows, function (calculationRow) {
            const data = calculationRow.dataset.medicament;

            if (data != undefined) {
              const dataObj = JSON.parse(data);
              medicamentList.push(dataObj);
            }
          });

          prescriptionData.medicamentsList = medicamentList;
        }
        if (
          prescriptionData.medicamentsList.length > 0 ||
          prescriptionData.letter != ""
        ) {
          let ajaxCall = null;
          if (form.dataset.status === "new") {
            ajaxCall = createSync(targetPrescription, prescriptionData, {
              loaderWarpper,
            });
          } else {
            const idPrescription = form.dataset.idPrescription || "";
            ajaxCall = updateSync(
              targetPrescription,
              idPrescription,
              prescriptionData,
              {
                loaderWarpper,
              }
            );
          }

          ajaxCall.then((response) => {
            if (response != undefined && response.success == true) {
              form.dataset.status = "new";
              form.dataset.idPrescription = null;
              [].forEach.call(prescriptionForms, function (prescriptionForm) {
                medicamentGrid.reset(component);
                prescriptionGrid.resetForm(prescriptionForm);
              });
              activeModel("dataTable");
              activeTab(["read"]);
              if (status == "new") {
                const datas = [];
                datas.push(response.result);
                const consultation = document.querySelector(
                  '.component[data-component="consultationInfo"]'
                );
                if (consultation) {
                  prescriptionGrid.renderPrescription(
                    consultation,
                    datas,
                    false
                  );
                }
              }
            }
          });
        } else {
          console.log("fields empty");
        }
      },
      false
    );
  },
  info: function (component, response) {
    const patientIds = component.querySelectorAll(".item-data[data-patientId]");
    const patientNames = component.querySelectorAll(
      ".item-data[data-patientName]"
    );
    const newPrescription = component.querySelector("#newPrescription");
    const prescriptionGridComponent = document.querySelector(
      '.component[data-component="prescriptionGrid"]'
    );
    const prescriptionItemList = component.querySelector(
      ".prescriptionItemList"
    );
    const reportItemList = component.querySelector(".reportItemList");
    const loaderWarpper = '.component[data-component="panel"] .panel';

    activeModel("dataTable");

    document.querySelector('[data-component="recorder-toggle"]').dataset.id =
      response.result._id;

    [].forEach.call(patientIds, function (patientId) {
      patientId.innerHTML =
        response.result.patient.patientId || response.result.patient._id;
    });

    [].forEach.call(patientNames, function (patientName) {
      patientName.innerHTML =
        response.result.patient.name + " " + response.result.patient.surname;
    });
    prescriptionItemList.innerHTML = "";
    prescriptionItemList.dataset.nbr = 0;
    const targetPrescription = prescriptionItemList.dataset.targetPrescription;
    const filter = "consultation";
    const equal = response.result._id;
    const ajaxCallPrescription = filterSync(targetPrescription, {
      filter,
      equal,
    });

    reportItemList.innerHTML = "";
    reportItemList.dataset.nbr = 0;
    const targetRecorder = reportItemList.dataset.targetRecorder;

    const ajaxCallRecorder = filterSync(targetRecorder, { filter, equal });

    const resultSync = multiSync([ajaxCallPrescription, ajaxCallRecorder], {
      loaderWarpper,
    });
    resultSync.then(function (responses) {
      const responsePrescription = responses[0];
      const responseRecorder = responses[1];
      if (
        responsePrescription != undefined &&
        responsePrescription.success === true
      ) {
        prescriptionGrid.renderPrescription(
          component,
          responsePrescription.result
        );
      }

      if (responseRecorder != undefined && responseRecorder.success === true) {
        reportGrid.renderRecord(component, responseRecorder.result);
      }
    });

    if (newPrescription) {
      newPrescription.addEventListener(
        "click",
        function () {
          if (prescriptionGridComponent) {
            const form = prescriptionGridComponent.querySelector("form");
            form.dataset.consultationId = response.result._id;
            const consultation = prescriptionGridComponent.querySelector(
              'input[name="consultation"]'
            );
            const patient = prescriptionGridComponent.querySelector(
              'input[name="patient"]'
            );
            const doctor = prescriptionGridComponent.querySelector(
              'input[name="doctor"]'
            );
            const prescriptionTitle = prescriptionGridComponent.querySelector(
              ".page-title"
            );
            consultation.value = response.result._id;
            patient.value = response.result.patient._id;
            doctor.value = response.result.doctor._id;
            consultation.dataset.id = response.result._id;
            patient.dataset.id = response.result.patient._id;
            doctor.dataset.id = response.result.doctor._id;
            prescriptionTitle.innerHTML = `Ordonnance #1 ${
              response.result.patient.name +
              " " +
              response.result.patient.surname
            }`;
            resetPrescriptionGrid(prescriptionGridComponent);
          }

          activeModel("prescription");
        },
        false
      );
    }
  },
};
export default consultationModule;
