import { parse } from "querystring";
function getPageQuery() {
  parse(window.location.href.split("?")[1]);
}

/* 
 To get nested object properties.
 admin = {
    location: {
        lat: 50,
        long: 9
    }
 }

 get(admin, 'location.lat')     // 50
 get(admin, 'location.foo.bar') // undefined
*/

export function get(obj, key) {
  return key.split(".").reduce(function (o, x) {
    return o === undefined || o === null ? o : o[x];
  }, obj);

  // key.split('.').reduce(function(o, x) {
  //     return (o === undefined || o === null) ? o : o[x];
  //   }, obj);
}

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  let a = s.split(".");
  for (let i = 0, n = a.length; i < n; ++i) {
    let k = a[i];
    if (o !== null) {
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    } else {
      return;
    }
  }
  return o;
};

/* 
 To check only if a property exists, without getting its value. It similer get function.
*/
export function has(obj, key) {
  return key.split(".").every(function (x) {
    if (typeof obj !== "object" || obj === null || x in obj === false)
      /// !x in obj or  x in obj === true *** if you find any bug
      return false;
    obj = obj[x];
    return true;
  });
}

/* 
 convert indexes to properties
*/
export function valueByString(obj, string, devider) {
  if (devider === undefined) {
    devider = "|";
  }
  return string
    .split(devider)
    .map(function (key) {
      return get(obj, key);
    })
    .join(" ");
}

/*
 Submit multi-part form using ajax.
*/
export function toFormData(form) {
  let formData = new FormData();
  const elements = form.querySelectorAll("input, select, textarea");
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    const name = element.name;

    if (name && element.dataset.disabled !== "true") {
      if (element.type === "file") {
        const file = element.files[0];
        formData.append(name, file);
      } else {
        const value = element.value;
        if (value && value.trim()) {
          formData.append(name, value);
        }
      }
    }
  }

  return formData;
}

/*
 Format Date to display admin
*/
export function formatDate(param) {
  const date = new Date(param);
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  const year = date.getFullYear();
  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  const fullDate = `${day}/${month}/${year}`;
  return fullDate;
}

/*
 Format Datetime to display admin
*/
export function formatDatetime(param) {
  let time = new Date(param).toLocaleTimeString();
  return formatDate(param) + " " + time;
}

/*
 Set object value in html
*/
export function bindValue(obj, parentElement) {
  parentElement.querySelectorAll("[data-property]").forEach((element) => {
    const type = element.dataset.type;
    let value = valueByString(obj, element.dataset.property);
    console.log({ type });
    switch (type) {
      case "date":
        value = formatDate(value);
        break;

      case "datetime":
        value = formatDatetime(value);
        break;

      case "currency":
        value = value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        break;

      default:
        break;
    }
    element.innerHTML = value;
  });
}

export default getPageQuery;
