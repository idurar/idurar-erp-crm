/* eslint-disable no-prototype-builtins */
import { activeTab, accordionBar } from "../core";

import { valueByString } from "../helper";
import delegate from "../lib/delegate";
import { consultationModule } from "../modules/consultation";
import dataGrid from "./dataGrid";
// import loader from "./loader";

import {
  createSync,
  updateSync,
  deleteSync,
  searchSync,
  axiosRequest,
} from "../axiosRequest";

export const initCrudPanel = (component) => {
  const form = document.querySelector('form.ajax[data-state="update"]');
  const table = document.querySelector(
    '.component[data-component="dataTable"] .table'
  );
  const viewType = table.dataset.viewtype;

  const target = table.dataset.target;

  delegate(
    document.body,
    ".tableBody tr .dropdown .edit",
    "click",
    function (e) {
      editItem(form, target, e.delegateTarget.dataset.json);
    },
    false
  );

  delegate(
    document.body,
    ".tableBody tr .dropdown .read",
    "click",
    function (e) {
      viewItem(target, e.delegateTarget.dataset.json, viewType);
    },
    false
  );

  delegate(
    document.body,
    ".tableBody tr .dropdown .remove",
    "click",
    function (e) {
      const displayLabel = e.delegateTarget.dataset.displayLabel;
      removeItem(target, e.delegateTarget.dataset.id, displayLabel);
    },
    false
  );
  delegate(
    document.body,
    ".meta-actions .meta-remove",
    "click",
    function (e) {
      const target = component.dataset.target;
      const displayLabel = e.delegateTarget.dataset.displayLabel;
      removeItem(target, e.delegateTarget.dataset.id, displayLabel);
    },
    false
  );

  delegate(
    document.body,
    ".meta-actions .meta-edit",
    "click",
    function (e) {
      const form = document.querySelector('form.ajax[data-state="update"]');
      const target = component.dataset.target;
      editItem(form, target, e.delegateTarget.dataset.json);
    },
    false
  );
  const searcAjax = document.querySelector(
    '.component[data-component="ajaxSearch"]'
  );
  const searchInput = searcAjax.querySelector(".searchAjax");
  if (searchInput) {
    searchInput.addEventListener(
      "select",
      function (event) {
        // const url = searchInput.dataset.read;
        const target = searchInput.dataset.target;
        const form = document.querySelector('form.ajax[data-state="update"]');
        const viewType = form.dataset.formtype || "standard";
        const { detail } = event;
        if (detail === undefined || detail.success === false) {
          return;
        }
        viewItem(target, detail.json, viewType);
      },
      false
    );
  }
};

export function standardView(component, divResultName, response) {
  const divResult = component.querySelector(divResultName);
  const list = divResult.dataset.listinfos;
  divResult.innerHTML = "";

  const data = response.result;
  const obj = JSON.parse(list);

  for (let i = 0; i < obj.length; ++i) {
    let listItem = document.createElement("li");
    const propKey = obj[i].key;
    const propText = obj[i].text;
    let textItem = document.createElement("p");
    let point = document.createElement("p");
    let valueItem = document.createElement("p");
    textItem.textContent = propText;
    point.textContent = ":";
    listItem.appendChild(textItem);
    listItem.appendChild(point);
    valueItem.textContent = valueByString(data, propKey);
    listItem.appendChild(valueItem);
    divResult.appendChild(listItem);
  }
}
export const toForm = (response, form) => {
  if (!form) {
    form = document.querySelector("form.ajax");
  }
  if (!form) {
    return;
  }
  form.reset();
  // rest all autocompletes
  const autocompletes = form.querySelectorAll(".autocomplete");
  [].forEach.call(autocompletes, function (autocomplete) {
    const selects = autocomplete.querySelectorAll("select");
    [].forEach.call(selects, function (select) {
      if (select != null) {
        if (select.parentNode) {
          select.parentNode.removeChild(select);
        }
      }
    });
  });
  const elements = form.querySelectorAll("input, select, textarea");
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    if (element.classList.contains("ajaxResult")) {
      var value = response.result[element.name];
      element.dataset.value = value._id;
    } else {
      if (element.classList.contains("ajaxSelect")) {
        var variable = response.result[element.name];
        element.value = variable._id || variable;
        setTimeout(() => {
          const e = new Event("change");
          element.dispatchEvent(e);
        }, 100);
      } else if (element.classList.contains("searchList")) {
        var _id = response.result[element.name];
        // var variable = "";
        if (
          element.dataset.label &&
          typeof response.result[element.name] == "object"
        ) {
          variable = valueByString(
            response.result[element.name],
            element.dataset.label
          );

          _id = response.result[element.name]._id;
        }

        element.value = variable;
        element.dataset.value = _id;
        let inpSelect = document.createElement("SELECT");
        inpSelect.name = element.name;
        inpSelect.hidden = true;
        inpSelect.setAttribute("id", "hiddenSelect");
        inpSelect.options[0] = new Option(variable, _id);
        element.parentNode.appendChild(inpSelect);
      } else {
        const name = element.dataset.name || element.name;
        console.log(name);
        variable = valueByString(response.result, name);
        //const json =  JSON.stringify(variable);

        element.value = variable._id || variable;
      }
    }
  }
};

export const editItem = (form, target, json) => {
  if (!form) {
    form = document.querySelector('form.ajax[data-state="update"]');
  }

  const viewInfo = document.querySelector(
    '.component[data-component="view-details"]'
  );
  if (viewInfo) {
    viewInfo.querySelector(".panel-body").classList.remove("hidden");
  }
  const data = JSON.parse(json);
  form.dataset.id = data._id;
  // form.dataset.target = target;
  // form.dataset.state = "update";
  // const result = readSync(target, json._id);

  const objResult = JSON.parse(json);
  const response = { result: objResult };
  setCurrentRecord(target, response);
  activeTab(["edit"]);
  toForm(response, form);
};

export const viewItem = (target, json, viewType = "standard") => {
  // const result = readSync(target, id);
  console.log(json);
  const objResult = JSON.parse(json);
  const response = { result: objResult };
  setCurrentRecord(target, response);
  activeTab(["read"]);
  // toForm(response);

  if (viewType == "consultation") {
    const infoDivs = document.querySelectorAll(
      '.component[data-component="consultationInfo"]'
    );
    [].forEach.call(infoDivs, function (infoDiv) {
      consultationModule.info(infoDiv, response);
    });
  } else {
    const infoDivs = document.querySelectorAll(
      '.component[data-component="information"]'
    );
    [].forEach.call(infoDivs, function (infoDiv) {
      standardView(infoDiv, "ul.info", response);
    });
  }
};

export const removeItem = (target, id, displaylabel) => {
  if (displaylabel != undefined) {
    document
      .getElementById("delete-record")
      .querySelector(".row-info").innerHTML = " : " + displaylabel;
  }

  window.modal.open("delete-record");

  const currentModal = document.querySelector(".current-modal");
  if (currentModal) {
    const confirmButton = currentModal.querySelector(".delete-confirm");

    if (confirmButton) {
      confirmButton.removeEventListener("click", handleDeleteConfirm, false);
      confirmButton.addEventListener("click", handleDeleteConfirm, false);
    }
  }

  function handleDeleteConfirm() {
    const result = deleteSync(target, id);
    result.then(function () {
      accordionBar();
      document
        .querySelector('[data-component="accordionForm"]')
        .querySelector(".accordionForm")
        .classList.remove("disabled");
      const dataTables = document.querySelectorAll(
        '.component[data-component="dataTable"]'
      );
      [].forEach.call(dataTables, function (component) {
        dataGrid.refresh(component);
      });
      window.modal.close();
    });
  }
};

export const setCurrentRecord = (target, res) => {
  const data = res.result;
  const viewInfo = document.querySelector(
    '.component[data-component="view-details"]'
  );
  viewInfo.dataset.target = target;
  const infoTitle = viewInfo.querySelector(".info-title");
  const metaActions = viewInfo.querySelector(".meta-actions");

  viewInfo.querySelector(".panel-body").classList.remove("hidden");

  if (viewInfo.dataset.page == "patient") {
    viewInfo.querySelectorAll(".tab-link").forEach(function (el, index) {
      // var name = el.textContent;
      const tabContent = viewInfo.querySelectorAll(".tab-content")[index];
      const itemList = tabContent.querySelector(".item-list");
      el.dataset.loaded = false;

      /////// >>>>>> remove event and make it without event
      if (itemList) {
        el.addEventListener("click", function () {
          const url = itemList.dataset.get + "/" + data._id;
          itemList.dataset.getUrl = url;
        });
      }
    });
  }

  if (infoTitle) {
    if (infoTitle.dataset.key) {
      const title = valueByString(data, infoTitle.dataset.key);
      infoTitle.innerHTML = infoTitle.dataset.prefix + " " + title;
    }
  }

  if (metaActions.querySelector(".meta-edit")) {
    metaActions.querySelector(".meta-edit").dataset.id = data._id;
    metaActions.querySelector(".meta-edit").dataset.json = JSON.stringify(data);
  }
  if (metaActions.querySelector(".meta-remove")) {
    metaActions.querySelector(".meta-remove").dataset.id = data._id;
    if (metaActions.querySelector(".meta-remove").dataset.label) {
      metaActions.querySelector(
        ".meta-remove"
      ).dataset.displayLabel = valueByString(
        data,
        metaActions.querySelector(".meta-remove").dataset.label
      );
    }
  }
  if (metaActions.querySelector(".meta-print")) {
    metaActions.querySelector(".meta-print").dataset.id = data._id;
  }

  //
};

// convert form data to json
export function toJson(form) {
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
}

export function ajaxForm(form) {
  //e.preventDefault();
  const dataTable = document.querySelector(
    '.component[data-component="dataTable"]'
  );
  const loaderWarpper = '.component[data-component="panel"] .panel';

  const target = form.dataset.target || dataTable.dataset.target;
  const state = form.dataset.state || "create";

  const json = toJson(form);

  //if element iput was empty convert his value to undefined
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const field = json[key];
      if (!field || !field.trim()) {
        json[key] = undefined;
        delete json[key];
      }
    }
  }
  let ajaxCall = null;
  if (state === "create") {
    ajaxCall = createSync(target, json, { loaderWarpper });
  } else if (state === "update") {
    const id = form.dataset.id;
    ajaxCall = updateSync(target, id, json, { loaderWarpper });
  }
  if (ajaxCall != null) {
    ajaxCall.then(function (response) {
      // loader.remove(loaderWarpper);
      // console.log("result success : " + response);
      if (response === undefined || response.success === false) {
        return;
      }

      // Refresh table when adding/updating an entry
      const activePaginationButton = document.querySelector(
        "#pagination > ul > li.active"
      );
      activePaginationButton
        ? dataGrid.refresh(dataTable)
        : dataGrid.init(dataTable, ".table", "form.ajax");
      const formtype = form.dataset.formtype || "standard";
      const json = JSON.stringify(response.result);
      viewItem(target, json, formtype);
      form.reset();
    });
  }
}

export function formSubmit(component, formName) {
  const form = component.querySelector(formName);
  component.querySelector("button.cancel").addEventListener(
    "click",
    function () {
      activeTab(["read"]);
      form.reset();
    },
    false
  );

  //form.on('submit', ajaxForm)
  // const formState = form.dataset.state;
  // const target = form.dataset.target;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    ajaxForm(form);
  });
}

export function searchItem(component, inputName) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  const inp = component.querySelector(inputName);
  const target = inp.dataset.target;
  let source = null;
  var currentFocus;

  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function () {
    removeHiddenSelect();
    if (source) {
      source.cancel();
    }
    source = axiosRequest();

    let that = this;
    var a,
      b,
      val = this.value;
    let inpSelect = document.createElement("SELECT");
    inpSelect.name = this.dataset.name;
    const output = this.dataset.output || "_id";
    inpSelect.hidden = true;
    inpSelect.setAttribute("id", "hiddenSelect");

    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    /** Loading **/
    b = document.createElement("DIV");
    var loadingMessage = "Loading ...";
    /*make the matching letters bold:*/
    b.classList.add("no-select");
    b.innerHTML = loadingMessage;
    /*execute a function when someone clicks on the item value (DIV element):*/
    a.appendChild(b);
    let question = this.value || null;
    let fields = this.dataset.fields || null;

    const ajaxCall = searchSync(target, source, { fields, question });
    ajaxCall.then(function (response) {
      // if (response != undefined && response.success === true && response.result.length > 0) {
      //   return;
      // }
      a.innerHTML = "";
      if (
        response != undefined &&
        response.success === true &&
        response.result.length > 0
      ) {
        let listID = new Array(response.result.length);
        for (let i = 0; i < response.result.length; i++) {
          const data = response.result[i];
          var displayLabel = "";
          if (that.dataset.label) {
            displayLabel = valueByString(
              response.result[i],
              that.dataset.label
            );
          } else {
            displayLabel = response.result[i];
          }
          listID[i] = data[output];

          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = displayLabel.substr(0, val.length);
          b.innerHTML += displayLabel.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML +=
            "<input type='hidden' value='" +
            displayLabel +
            "' data-value='" +
            listID[i] +
            "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/

          b.addEventListener("click", function () {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            inp.dataset.value = this.getElementsByTagName(
              "input"
            )[0].dataset.value;
            const valOption = this.getElementsByTagName("input")[0].dataset
              .value;
            const textOption = this.getElementsByTagName("input")[0].value;
            inpSelect.options[0] = new Option(textOption, valOption);
            that.parentNode.appendChild(inpSelect);

            if (inp.dataset.change) {
              var event = new CustomEvent("select", {
                detail: {
                  display: displayLabel,
                  json: JSON.stringify(data),
                  result: data,
                },
              });
              inp.dispatchEvent(event);
            }
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          a.appendChild(b);
        }
      } else {
        b = document.createElement("DIV");
        var noFoundMessage =
          component.getAttribute("data-error-message") || "No result found";
        /*make the matching letters bold:*/
        b.classList.add("no-select");
        b.innerHTML = noFoundMessage;
        /*execute a function when someone clicks on the item value (DIV element):*/
        a.appendChild(b);
      }
    });
  });

  function removeHiddenSelect() {
    let rmvElement = document.querySelectorAll("#hiddenSelect");

    if (rmvElement.length != 0) {
      rmvElement[0].parentNode.removeChild(rmvElement[0]);
    }
  }
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    } else if (e.keyCode == 27 || e.keyCode == 9) {
      closeAllLists();
    } else if (e.keyCode == 8) {
      closeAllLists();
      inp.value = "";
      delete inp.dataset.id;
      removeHiddenSelect();
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/

    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
