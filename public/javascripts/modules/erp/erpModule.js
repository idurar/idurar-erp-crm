/* eslint-disable no-unused-vars */

import {
  createSync,
  updateSync,
  filterSync,
  multiSync,
} from "../../axiosRequest";
import {
  uniqueid,
  RowToObject,
  jsonToRow,
  validateRow,
  resetRow,
  formToObject,
} from "../../helper";
import { activeTab, activeModel } from "../../core";

import delegate from "../../lib/delegate";

import itemsGird from "./itemsGird";

//////// ***** Main Component  : prescriptionComponent ***** //////////

const erpModule = {
  componentName: null,
  data: function () {
    let erpComponent = document.querySelector(erpModule.componentName);
    const form = erpComponent.querySelector("form");
    const calculationRows = erpComponent.querySelectorAll(".calculation-row");
    let erpData = formToObject(form);
    erpData.items = [];

    let itemsList = [];

    [].forEach.call(calculationRows, function (calculationRow) {
      const data = calculationRow.dataset.item;

      if (data != undefined) {
        const dataObj = JSON.parse(data);
        itemsList.push(dataObj);
      }
    });

    if (itemsList.length > 0) {
      erpData.items = itemsList;
      return erpData;
    } else {
      return null;
    }
  },
  init: function (className = '.component[data-component="erpModule"]') {
    erpModule.componentName = className;
    let erpComponent = document.querySelector(erpModule.componentName);
    if (erpComponent) {
      itemsGird.init(erpComponent);

      const saveErp = erpComponent.querySelector(".saveErp");
      const targetErp = erpComponent.dataset.targetErp;
      const form = erpComponent.querySelector("form");
      saveErp.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          const data = erpModule.data();
          if (data) {
            let ajaxCall = null;
            if (form.dataset.status === "new") {
              ajaxCall = createSync(targetErp, data);
            } else {
              const idErp = form.dataset.idErp || "";
              ajaxCall = updateSync(targetErp, idErp, data);
            }

            ajaxCall.then((response) => {
              if (response != undefined && response.success == true) {
                form.dataset.status = "new";
                form.dataset.idErp = null;
              }
            });
          }
        },
        false
      );
    }
  },
};
export default erpModule;
