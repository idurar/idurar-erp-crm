function activeTab(filter = {}) {
  //console.log(component);
  const tabs = document.querySelectorAll(".tab-content");
  const tabLinks = document.querySelectorAll(".tab-link");
  const edits = document.querySelectorAll(".edit");
  const reads = document.querySelectorAll(".read");
  const accordions = document.querySelectorAll(".accordionForm");
  const panels = document.querySelectorAll(
    '.component[data-component="panel"]'
  );

  [].forEach.call(panels, function (panel) {
    panel.querySelector(".panel").classList.remove("hide");
    panel.querySelector(".panelButton").classList.remove("panelHidden");
    document.querySelector(".content").classList.remove("wide");
  });

  [].forEach.call(tabs, function (tab) {
    tab.classList.remove("is-active");
  });
  [].forEach.call(tabLinks, function (tabLink) {
    tabLink.classList.remove("is-active");
  });

  [].forEach.call(tabs, function () {
    tabs[0].classList.add("is-active");
  });
  [].forEach.call(tabLinks, function () {
    tabLinks[0].classList.add("is-active");
  });

  if (filter.includes("read")) {
    [].forEach.call(edits, function (edit) {
      edit.classList.add("hidden");
    });
    [].forEach.call(reads, function (read) {
      read.classList.remove("hidden");
    });
  }
  if (filter.includes("edit")) {
    [].forEach.call(reads, function (read) {
      read.classList.add("hidden");
    });
    [].forEach.call(edits, function (edit) {
      edit.classList.remove("hidden");
    });
  }

  [].forEach.call(accordions, function () {
    accordions[0].classList.add("disabled");
  });
}
export default activeTab;
