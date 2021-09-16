import { uniqueid } from "../../helper";

//////// ***** medicament Module  : add , edit , remove , render ***** //////////

const medicamentGrid = {
  toObject: function (row) {
    let obj = {};

    const elements = row.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      const name = element.name;
      const value = element.value;

      if (name) {
        obj[name] = value;
      }
    }

    return obj;
  },

  rowToForm: function (jsonTxt, row, idRow) {
    let obj = JSON.parse(jsonTxt);
    row.dataset.action = "edit";
    row.dataset.id = idRow;
    const elements = row.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      element.value = obj[element.name];
    }

    return obj;
  },

  reset: function (component) {
    const currentRow = component.querySelector(".currentRow");
    currentRow.dataset.action = "new";
    currentRow.dataset.id = null;
    const elements = currentRow.querySelectorAll("input, select,textarea");
    const autocompletes = currentRow.querySelectorAll(".autocomplete");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      element.value = "";
      element.dataset.value = "";
    }
    [].forEach.call(autocompletes, function (autocomplete) {
      const select = autocomplete.querySelector("select");
      if (select != null) {
        if (select.parentNode) {
          select.parentNode.removeChild(select);
        }
      }
    });
  },
  validate: function (row) {
    const elements = row.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      if (element.hasAttribute("required")) {
        if (element.value.length == 0) {
          return false;
        }
      }
    }

    return true;
  },
  add: function (component) {
    const currentRow = component.querySelector(".currentRow");
    const medicamentRow = component.querySelector(".medicament-row");
    const form = component.querySelector("form");
    const orgdropdown = form.querySelector(".orgdropdown");
    const newObj = medicamentGrid.toObject(currentRow);
    const newID = uniqueid();
    const action = currentRow.dataset.action;

    if (medicamentGrid.validate(currentRow)) {
      const editedID = currentRow.dataset.id || null;
      const editClassName = `.calculation-row[data-row="${editedID}"]`;
      const editedRow = medicamentRow.querySelector(editClassName);

      if (action == "edit" && editedRow != null) {
        editedRow.dataset.medicament = JSON.stringify(newObj);
        editedRow.innerHTML = `
        ${medicamentGrid.item(newObj)}
        `;

        let dropdown = orgdropdown.cloneNode(true);
        dropdown.className = "dropdown";
        dropdown.querySelector("li.remove").dataset.id = editedID;
        dropdown.querySelector("li.edit").dataset.id = editedID;
        editedRow.appendChild(dropdown);
      }
      if (action == "new") {
        const newRow = `<div class="content-row calculation-row" data-medicament='${JSON.stringify(
          newObj
        )}' data-row='${newID}'>
        ${medicamentGrid.item(newObj)}
        </div>
        `;

        medicamentRow.innerHTML += newRow;
        const className = `.calculation-row[data-row="${newID}"]`;
        const lastRow = medicamentRow.querySelector(className);
        let dropdown = orgdropdown.cloneNode(true);
        dropdown.className = "dropdown";
        dropdown.querySelector("li.remove").dataset.id = newID;
        dropdown.querySelector("li.edit").dataset.id = newID;
        lastRow.appendChild(dropdown);
      }

      medicamentGrid.reset(component);
    }
  },
  edit: function (component, element) {
    const id = element.dataset.id;
    const currentRow = component.querySelector(".currentRow");
    const className = `.calculation-row[data-row="${id}"]`;
    const selected = component.querySelector(className);
    const jsonTxt = selected.dataset.medicament;
    medicamentGrid.rowToForm(jsonTxt, currentRow, id);
  },
  remove: function (component, element) {
    const id = element.dataset.id;

    const className = `.calculation-row[data-row="${id}"]`;
    const selected = component.querySelector(className);

    if (selected.parentNode) {
      selected.parentNode.removeChild(selected);
    }
  },
  record: (component, medicament) => {
    const form = component.querySelector("form");
    const orgdropdown = form.querySelector(".orgdropdown");
    const newID = uniqueid();
    const result = `<div class="content-row calculation-row" data-medicament='${JSON.stringify(
      medicament
    )}' data-row='${newID}'>
    ${medicamentGrid.item(medicament)}
    </div>
    `;
    const dom = document.createElement("div");
    dom.innerHTML = result;
    const row = dom.querySelector(".calculation-row");
    let dropdown = orgdropdown.cloneNode(true);
    dropdown.className = "dropdown";
    dropdown.querySelector("li.remove").dataset.id = newID;
    dropdown.querySelector("li.edit").dataset.id = newID;
    row.appendChild(dropdown);
    return dom.innerHTML;
  },
  item: (medicament) => {
    return `<div class="col-5"><span>${medicament.medicamentName}</span></div>
    <div class="col-3"><span>${medicament.boxesNumber} Boite</span></div>
    <div class="col-3"><span>${medicament.daysNumber} Jours</span></div>
    <div class="col-3"><span>${medicament.drugsNumber} cp</span></div>
    <div class="col-3"><span>${medicament.times} fois</span></div>
    <div class="col-5"><span>${medicament.note}</span></div>`;
  },
  render: (component, data) => {
    const medicamentRow = component.querySelector(".medicament-row");
    const { medicamentsList } = data;
    const content = medicamentsList.map((item) =>
      medicamentGrid.record(component, item)
    );
    // inner data to #dataCont
    medicamentRow.innerHTML = content.join("");
  },
};

export default medicamentGrid;
