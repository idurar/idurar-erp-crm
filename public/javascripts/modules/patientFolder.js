import ajaxGetData from "./ajaxGetData";
import { valueByString } from "../helper";

function patientFolder(component) {
  var loadedUrl = null;
  var itemTemplate = component.querySelector(".single-item").cloneNode(true);
  itemTemplate.classList.remove("hidden");
  component.querySelector(".single-item").remove();

  var intersectionObserver = new IntersectionObserver(function (entries) {
    // If intersectionRatio is 0, the target is out of view
    // and we do not need to do anything.
    if (entries[0].intersectionRatio <= 0) return;
    loadItemsIfNeeded(entries[0].target);
  });

  intersectionObserver.observe(component);

  function loadItemsIfNeeded(itemList) {
    // "getUrl" is the url with patient id, it was set when view item form datatable or search (I.e /api/appointment/find/patient/5d0ac3e893f4dd910e762288)
    // "get" is the row url for the get list data (I.e  /api/appointment/find/patient/, /api/appointment/get)
    const url = itemList.dataset.getUrl || itemList.dataset.get;
    if (loadedUrl == url) {
      return;
    }
    ajaxGetData(url).then(function ({ data }) {
      loadedUrl = url;
      itemList.innerHTML = "";
      if (data.length > 0) {
        data.forEach((row) => {
          const item = itemTemplate.cloneNode(true);
          item.querySelectorAll("[data-property]").forEach(function (el) {
            el.innerHTML = valueByString(row, el.dataset.property) || "-";
          });
          item.dataset.id = row._id;
          itemList.appendChild(item);
        });
      } else {
        const nodeFoudNode = document.createElement("div");
        nodeFoudNode.classList.add("not-found-item");
        nodeFoudNode.innerHTML = "No " + name + " found.";
        itemList.appendChild(nodeFoudNode);
      }
    });
  }
}

export default patientFolder;
