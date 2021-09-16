/* eslint-disable no-unused-vars */

import { readSync, deleteSync } from "../../axiosRequest";
import { activeModel } from "../../core";
import { formatDate } from "../../helper";

import medicamentGrid from "./medicamentGird";

//////// ***** prescription Module  : type , edit , remove , download ***** //////////
const prescriptionGrid = {
  type: function (component, element) {
    const value = element.value;
    const form = component.querySelector("form");
    const type = component.querySelector(`.${value}`);
    const prescriptionForms = component.querySelectorAll(".prescriptionForm");
    if (type) {
      [].forEach.call(prescriptionForms, function (prescriptionForm) {
        prescriptionForm.classList.add("hidden");

        form.dataset.status = "new";
        form.dataset.idPrescription = null;
        medicamentGrid.reset(component);
        prescriptionGrid.resetForm(prescriptionForm);
      });
      type.classList.remove("hidden");
    }
  },
  resetForm: function (prescriptionForm) {
    const elements = prescriptionForm.querySelectorAll(
      "input, select,textarea"
    );
    const medicamentRow = prescriptionForm.querySelector(".medicament-row");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      element.value = "";
      element.dataset.value = "";
    }
    if (medicamentRow) {
      medicamentRow.innerHTML = "";
    }
  },
  formToObject: function (form) {
    let obj = {};
    const elements = form.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      const name = element.name;
      const value = element.value;

      if (name && element.dataset.disabled != "true") {
        obj[name] = value;
      }
    }
    return obj;
  },

  edit: function (component, element) {
    const id = element.dataset.id;
    const form = component.querySelector("form");
    const prescriptionType = component.querySelector(".prescriptionType");
    const targetPrescription = component.dataset.targetPrescription;
    const loaderWarpper = '.model[data-model="prescription"]';
    activeModel("prescription");
    const ajaxCall = readSync(targetPrescription, id, { loaderWarpper });
    ajaxCall.then((response) => {
      if (response.success == true) {
        // form.dataset.consultationId = response.result.consultation._id;

        const consultation = component.querySelector(
          'input[name="consultation"]'
        );
        const patient = component.querySelector('input[name="patient"]');
        const doctor = component.querySelector('input[name="doctor"]');
        const prescriptionTitle = component.querySelector(".page-title");
        const letterFrom = component.querySelector(`.letter`);
        consultation.value = response.result.consultation._id;
        patient.value = response.result.patient._id;
        doctor.value = response.result.doctor._id;
        consultation.dataset.id = response.result.consultation._id;
        patient.dataset.id = response.result.patient._id;
        doctor.dataset.id = response.result.doctor._id;
        prescriptionTitle.innerHTML = `Ordonnance #1 ${
          response.result.patient.name + " " + response.result.patient.surname
        }`;

        const type = response.result.type;
        prescriptionType.value = type;
        prescriptionType.dispatchEvent(new Event("change"));
        form.dataset.idPrescription = id;
        form.dataset.status = "update";

        if (type == "letter") {
          letterFrom.querySelector("textarea").value = response.result.letter;
        } else {
          medicamentGrid.render(component, response.result);
        }
      }
    });
  },
  remove: function (component, element) {
    const prescriptionType = component.querySelector(".prescriptionType");
    const form = component.querySelector("form");
    const targetPrescription = component.dataset.targetPrescription;
    const id = element.dataset.id;
    const loaderWarpper = '.component[data-component="panel"] .panel';

    document
      .getElementById("delete-record")
      .querySelector(".row-info").innerHTML = " : " + id;

    window.modal.open("delete-record");
    const currentModal = document.querySelector(".current-modal");
    if (currentModal) {
      const confirmButton = currentModal.querySelector(".delete-confirm");

      if (confirmButton) {
        confirmButton.removeEventListener(
          "click",
          prescriptionDeleteConfirm,
          false
        );
        confirmButton.addEventListener(
          "click",
          prescriptionDeleteConfirm,
          false
        );
      }
    }
    function prescriptionDeleteConfirm() {
      window.modal.close();
      const ajaxCall = deleteSync(targetPrescription, id, { loaderWarpper });

      ajaxCall.then((response) => {
        //Rest all prescriptionForm
        if (response === undefined || response.success === false) {
          return;
        }
        //Rest all prescriptionForm
        prescriptionType.dispatchEvent(new Event("change"));

        form.dataset.status = "new";
        form.dataset.idPrescription = null;
        if (response.success == true) {
          const className = `.prescriptionItem[data-id="${id}"]`;

          const selected = document.querySelector(className);

          if (selected) {
            selected.parentNode.removeChild(selected);
          }
        }
      });
    }
  },
  download: function (element) {
    const id = element.dataset.id;
    const link = element.dataset.path + "-" + id + ".pdf";

    window.open(link, "_blank");
    //prescriptionItem.setAttribute('href',`/api/prescription/pdf/${response.result._id}`)
  },
  renderPrescription: function (component, datas, multiple = true) {
    const orgprescriptionItem = component.querySelector(
      ".template .prescriptionItem"
    );
    const prescriptionItemList = component.querySelector(
      ".prescriptionItemList"
    );
    if (multiple) {
      prescriptionItemList.dataset.nbr = 0;
      prescriptionItemList.innerHTML = "";
    }
    for (const data of datas) {
      let prescriptionItem = orgprescriptionItem.cloneNode(true);

      //const reportList = component.querySelector('.reportList');
      const date = data.created;

      const nbr = parseInt(prescriptionItemList.dataset.nbr, 10) + 1 || 1;
      prescriptionItemList.dataset.nbr = nbr;
      prescriptionItem.querySelector(
        "span[data-prescriptionNbr]"
      ).innerHTML = `Ordonnance #${nbr}`;
      prescriptionItem.querySelector(
        "span[data-prescriptionDate]"
      ).innerHTML = formatDate(date);
      prescriptionItem.dataset.id = data._id;
      prescriptionItem.querySelector(".edit").dataset.id = data._id;
      prescriptionItem.querySelector(".download").dataset.id = data._id;
      prescriptionItem.querySelector(".remove").dataset.id = data._id;

      prescriptionItemList.appendChild(prescriptionItem);
    }
  },
};

export default prescriptionGrid;
