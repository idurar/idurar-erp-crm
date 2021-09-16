function panelModel(
  component,
  panelModelName,
  panelButtonName,
  contentName = ".content"
) {
  const toggleNavBar = () => {
    component.querySelector(panelModelName).classList.toggle("hide");
    component.querySelector(panelButtonName).classList.toggle("panelHidden");
    document.querySelector(contentName).classList.toggle("wide");
  };

  component.querySelector(panelButtonName).addEventListener(
    "click",
    function () {
      toggleNavBar();
    },
    false
  );
}

export default panelModel;
