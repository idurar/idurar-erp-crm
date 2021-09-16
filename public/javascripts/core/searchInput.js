import { valueByString } from "../helper";
import { searchSync, axiosRequest } from "../axiosRequest";
function searchInput(component, inputName) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  const inp = component.querySelector(inputName);
  var currentFocus;
  const target = inp.dataset.target;
  let source = null;

  inp.addEventListener("setValue", function ({ detail }) {
    let inpSelect = document.createElement("SELECT");
    inpSelect.name = this.dataset.name;
    inpSelect.hidden = true;
    inpSelect.setAttribute("id", "hiddenSelect");
    inpSelect.options[0] = new Option(detail.display, detail.id);
    console.log(detail);
    inp.parentNode.appendChild(inpSelect);
  });
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function () {
    removeHiddenSelect();
    if (source) {
      source.cancel();
    }
    source = axiosRequest();
    let that = this;
    var a,
      b,
      val = this.value;
    let inpSelect = document.createElement("SELECT");
    inpSelect.name = this.dataset.name;
    const output = this.dataset.output || "_id";
    inpSelect.hidden = true;
    inpSelect.setAttribute("id", "hiddenSelect");

    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);

    /** Loading **/
    b = document.createElement("DIV");
    var loadingMessage = "Loading ...";
    /*make the matching letters bold:*/
    b.classList.add("no-select");
    b.innerHTML = loadingMessage;
    a.appendChild(b);
    /*for each item in the array...*/

    let question = this.value || null;
    let fields = this.dataset.fields || null;
    const ajaxCall = searchSync(target, source, { fields, question });
    ajaxCall.then(function (response) {
      a.innerHTML = "";
      if (
        response != undefined &&
        response.success === true &&
        response.result.length > 0
      ) {
        let list = new Array(response.result.length);
        let listID = new Array(response.result.length);

        let arr = list;
        if (arr.length > 0) {
          for (let i = 0; i < response.result.length; i++) {
            const data = response.result[i];
            var displayLabel = "";
            if (that.dataset.label) {
              displayLabel = valueByString(
                response.result[i],
                that.dataset.label
              );
            } else if (response.result[i].name) {
              displayLabel = response.result[i].name;
            } else {
              displayLabel = response.result[i].toString();
            }
            listID[i] = data[output];

            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = displayLabel.substr(0, val.length);
            b.innerHTML += displayLabel.substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML +=
              "<input type='hidden' value='" +
              displayLabel +
              "' data-value='" +
              listID[i] +
              "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/

            b.addEventListener("click", function () {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              inp.dataset.value = this.getElementsByTagName(
                "input"
              )[0].dataset.value;
              const valOption = this.getElementsByTagName("input")[0].dataset
                .value;
              const textOption = this.getElementsByTagName("input")[0].value;
              inpSelect.options[0] = new Option(textOption, valOption);
              that.parentNode.appendChild(inpSelect);

              // if (inp.dataset.change) {
              //   var event = new CustomEvent("select", {
              //     detail: {
              //       display: displayLabel,
              //       id: data._id,
              //       data: data,
              //     },
              //   });
              //   inp.dispatchEvent(event);
              // }
              /*close the list of autocompleted values,
               (or any other open lists of autocompleted values:*/
              closeAllLists();
            });
            a.appendChild(b);
          }
        }
      } else {
        b = document.createElement("DIV");
        var noFoundMessage =
          component.getAttribute("data-error-message") || "No result found";
        /*make the matching letters bold:*/
        b.classList.add("no-select");
        b.innerHTML = noFoundMessage;
        /*execute a function when someone clicks on the item value (DIV element):*/
        a.appendChild(b);
      }
    });
  });

  function removeHiddenSelect() {
    let rmvElement = document.querySelectorAll("#hiddenSelect");
    console.log(rmvElement);
    if (rmvElement.length != 0) {
      rmvElement[0].parentNode.removeChild(rmvElement[0]);
    }
  }

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    } else if (e.keyCode == 27 || e.keyCode == 9) {
      closeAllLists();
    } else if (e.keyCode == 8) {
      closeAllLists();
      inp.value = "";
      delete inp.dataset.id;
      removeHiddenSelect();
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/

    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

export default searchInput;
