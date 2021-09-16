import delegate from "../lib/delegate";
import { listSync } from "../axiosRequest";
import { valueByString } from "../helper";

let render = {
  grid: function (response = {}, table, col) {
    const results = response.result;
    const paginationData = response.pagination;

    table.querySelector("tbody.tableBody").innerHTML = "";
    table.querySelector("#pagination .prev").dataset.page = "";
    table.querySelector("#pagination .next").dataset.page = "";

    for (const data of results) {
      let listItem = document.createElement("tr");
      listItem.dataset.id = data._id;
      listItem.dataset.json = JSON.stringify(data);
      const orgdropdown = table.querySelector(".dropdown");
      let dropdown = orgdropdown.cloneNode(true);
      dropdown.querySelector("li.remove").dataset.id = data._id;
      dropdown.querySelector("li.remove").dataset.displayLabel = valueByString(
        data,
        dropdown.querySelector("li.remove").dataset.label || ""
      );
      dropdown.querySelector("li.edit").dataset.id = data._id;
      dropdown.querySelector("li.edit").dataset.json = JSON.stringify(data);
      dropdown.querySelector("li.read").dataset.id = data._id;
      dropdown.querySelector("li.read").dataset.json = JSON.stringify(data);

      for (let i = 0; i < col.length; ++i) {
        const variable = valueByString(data, col[i]);

        listItem.appendChild(
          document.createElement("td")
        ).textContent = variable;
      }
      const tdElement = document.createElement("td");
      tdElement.appendChild(dropdown).classList.remove("hidden");
      listItem.appendChild(tdElement);

      table.querySelector("tbody.tableBody").appendChild(listItem);
    }
    let prev = "";
    if (paginationData.page > 1) {
      prev = parseInt(paginationData.page) - 1;
    } else prev = "";
    table.querySelector("#pagination .prev").dataset.page = prev;
    let next = "";
    if (paginationData.page < paginationData.pages) {
      next = parseInt(paginationData.page) + 1;
    } else next = "";
    table.querySelector("#pagination .next").dataset.page = next;
  },
  pagination: function (response, table) {
    const paginationData = response.pagination;

    table.querySelector("#pagination ul.pages").innerHTML = "";

    for (let i = 1; i <= paginationData.pages; ++i) {
      let listPag = document.createElement("li");
      listPag.innerHTML = i;
      listPag.dataset.page = i;

      if (i === paginationData.page) {
        listPag.classList.add("active");
      }
      table.querySelector("#pagination ul.pages").appendChild(listPag);
    }
  },
  activePagination: function (page) {
    const i = page;
    const pag = document.querySelectorAll("#pagination ul.pages li");
    for (let i = 0; i < pag.length; ++i) {
      pag[i].classList.remove("active");
    }
    pag[i - 1].classList.add("active");
  },
};

const ajaxFunction = (component, target, option = {}) => {
  const table = component.querySelector(".table");
  const col = JSON.parse(table.dataset.col);
  const ajaxCall = listSync(target, option);
  ajaxCall.then(function (response) {
    if (response === undefined || response.success === false) {
      return;
    }
    render.grid(response, table, col);
    render.pagination(response, table);
    render.activePagination(response.pagination.page);
  });
};
const dataGrid = {
  init: function (component) {
    const loaderWarpper = '.component[data-component="dataTable"] .table';
    const table = component.querySelector(".table");
    let items = table.dataset.items || null;
    const selectItems = component.querySelector("select.itemsPerPage");
    const target = table.dataset.target;
    ajaxFunction(component, target, { items, loaderWarpper });

    selectItems.addEventListener("change", function () {
      items = this.value;
      ajaxFunction(component, target, { items, loaderWarpper });
    });

    delegate(
      document.body,
      "#pagination ul.pages li",
      "click",
      function (e) {
        const pageNumber = e.delegateTarget.dataset.page;
        ajaxFunction(component, target, { page: pageNumber, loaderWarpper });
      },
      false
    );

    table.querySelector("#pagination .next").addEventListener(
      "click",
      function () {
        const pageNumber = this.dataset.page;
        ajaxFunction(component, target, { page: pageNumber, loaderWarpper });
      },
      false
    );

    table.querySelector("#pagination .prev").addEventListener(
      "click",
      function () {
        const pageNumber = this.dataset.page;
        ajaxFunction(component, target, { page: pageNumber, loaderWarpper });
      },
      false
    );
  },

  refresh: function (component) {
    const table = component.querySelector(".table");
    const loaderWarpper = '.component[data-component="dataTable"] .table';
    const target = table.dataset.target;
    ajaxFunction(component, target, { page: 1, loaderWarpper });
  },
};
export default dataGrid;
