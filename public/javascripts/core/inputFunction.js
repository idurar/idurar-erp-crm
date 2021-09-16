import inputmask from "../lib/inputmask";

function inputFunction(component) {
  const date = component.classList.contains("date");
  const datepicker = component.classList.contains("datepicker");
  if (date || datepicker) {
    inputmask(component);
  }
}

export default inputFunction;
