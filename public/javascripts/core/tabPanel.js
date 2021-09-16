import tabs from "../lib/tabs";

function tabPanel(component, tabName) {
  var myTabs = tabs({
    el: tabName,
    tabNavigationLinks: ".tab-link",
    tabContentContainers: ".tab-content",
  });

  myTabs.init();
  //   const dropdown = component.querySelector(".toggle")
  //   dropdown.addEventListener("click", function (e) {
  //     this.querySelector('.toggleOption').classList.toggle('show');
  // }, false);

  component.addEventListener(
    "click",
    function () {
      document.querySelector(".accordionForm").classList.add("disabled");
    },
    false
  );
}

export default tabPanel;
