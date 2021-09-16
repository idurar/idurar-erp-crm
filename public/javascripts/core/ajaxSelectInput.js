import { filterSync } from "../axiosRequest";

function ajaxSelectInput(component, ajaxSelectName, ajaxResultName) {
  const ajaxSelect = component.querySelector(ajaxSelectName);
  const resultId = ajaxSelect.dataset.id;
  const className = ajaxResultName + '[data-id="' + resultId + '"]';
  const ajaxResult = component.querySelector(className);

  ajaxSelect.addEventListener(
    "change",
    function () {
      console.log(`e.target.value = ${this.value}`);
      // const id =this.dataset.id;

      ajaxResult.disabled = true;
      ajaxResult.selectedIndex = 0;
      ajaxResult.options.length = 0;

      const target = this.dataset.target;
      const filter = this.dataset.filter;
      const equal = this.value;
      const ajaxCall = filterSync(target, { filter, equal });

      ajaxCall.then(function (response) {
        if (response === undefined || response.success === false) {
          return;
        }
        if (response.success == 1) {
          const results = response.result;
          for (const data of results) {
            ajaxResult.options[ajaxResult.options.length] = new Option(
              data.name + " " + data.surname,
              data._id
            );
          }
          if (ajaxResult.options.length >= 1) {
            ajaxResult.disabled = false;
          }
          if (ajaxResult.dataset.value) {
            ajaxResult.value = ajaxResult.dataset.value;
            const e = new Event("change");
            ajaxResult.dispatchEvent(e);
          }
        } else {
          return;
        }
      });
    },
    false
  );
}

export default ajaxSelectInput;
