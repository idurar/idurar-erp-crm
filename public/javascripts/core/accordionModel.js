function accordionBar() {
  const tabs = document.querySelectorAll(".tab-content");
  // const tabLinks = document.querySelectorAll('.tab-link');
  const viewComponent = document.querySelectorAll(
    '.component[data-component="view-details"]'
  );
  [].forEach.call(tabs, function (tab) {
    tab.classList.remove("is-active");
  });
  // [].forEach.call(tabLinks, function (tabLink) {
  //     tabLink.classList.remove('is-active');
  // });

  [].forEach.call(viewComponent, function (el) {
    el.querySelector(".panel-body").classList.add("hidden");
  });
}

function accordionModel(component, accordionModelName) {
  const addNew = document.querySelector(".add-click");
  if (addNew) {
    addNew.addEventListener(
      "click",
      function () {
        accordionBar();
        component
          .querySelector(accordionModelName)
          .classList.remove("disabled");
      },
      false
    );
  }

  component.querySelector(accordionModelName + "Header").addEventListener(
    "click",
    function () {
      accordionBar();
      component.querySelector(accordionModelName).classList.toggle("disabled");
    },
    false
  );
}

export default accordionModel;
