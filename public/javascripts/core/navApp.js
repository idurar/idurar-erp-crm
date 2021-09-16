import delegate from "../lib/delegate";

function navApp(component, subMenuName) {
  // const navMenu = component.querySelectorAll(subMenuName);
  const subMenus = component.querySelectorAll(".subMenu");

  component.addEventListener("mouseleave", function () {
    [].forEach.call(subMenus, function (subMenu) {
      subMenu.classList.remove("show");
    });
  });

  delegate(
    document.body,
    ".navMenu .toggle",
    "click",
    function (e) {
      const current = e.delegateTarget.querySelector(".subMenu");
      const result = current.classList.contains("show");
      //e.preventDefault();
      [].forEach.call(subMenus, function (subMenu) {
        subMenu.classList.remove("show");
      });

      if (result) {
        current.classList.remove("show");
      } else {
        current.classList.add("show");
      }

      //e.stopPropagation();
    },
    false
  );
}

export default navApp;
