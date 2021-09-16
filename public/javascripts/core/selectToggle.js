function selectToggle(component, props = {}) {
  const selectedComponent = props.selectedComponent || ".toggleDiv";
  const toggleDivs = component.querySelectorAll(selectedComponent);
  const select = component.querySelector("select");
  select.addEventListener(
    "change",
    function () {
      const value = this.value;
      console.log(value);
      [].forEach.call(toggleDivs, function (toggleDiv) {
        toggleDiv.classList.add("hidden");
        toggleDiv.querySelector("input").required = false;
      });
      [].forEach.call(toggleDivs, function (toggleDiv) {
        if (toggleDiv.classList.contains(value)) {
          toggleDiv.classList.remove("hidden");
          if (toggleDiv.classList.contains("isRequired")) {
            toggleDiv.querySelector("input").required = true;
          }
        }
      });
    },
    false
  );
}

export default selectToggle;
