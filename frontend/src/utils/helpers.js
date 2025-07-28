export function get(obj, key) {
  return key.split('.').reduce(function (o, x) {
    return o === undefined || o === null ? o : o[x];
  }, obj);
}

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  let a = s.split('.');
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
 To check only if a property exists, without getting its value. It similar get function.
*/
export function has(obj, key) {
  return key.split('.').every(function (x) {
    if (typeof obj !== 'object' || obj === null || x in obj === false)
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
    devider = '|';
  }
  return string
    .split(devider)
    .map(function (key) {
      return get(obj, key);
    })
    .join(' ');
}

/*
 Submit multi-part form using ajax.
*/
export function toFormData(form) {
  let formData = new FormData();
  const elements = form.querySelectorAll('input, select, textarea');
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    const name = element.name;

    if (name && element.dataset.disabled !== 'true') {
      if (element.type === 'file') {
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

export const isDate = function ({ date, format = 'YYYY-MM-DD' }) {
  if (typeof date == 'boolean') return false;
  if (typeof date == 'number') return false;
  if (dayjs(date, format).isValid()) return true;
  return false;
};
/*
 Format Datetime to display admin
*/
export function formatDatetime(param) {
  let time = new Date(param).toLocaleTimeString();
  return formatDate(param) + ' ' + time;
}

/*
  Regex to validate phone number format
  This regex supports following patterns of phone number
  1234567890
  123-456-7890
  123.456.7890
  +911234567890
  +1(555) 123-4567
  +91(555) 123-4567
  (123) 456-7890
*/
export const validatePhoneNumber =
  /^(?:(?:\+|00)([1-9]\d{0,3}))?(\()?\d{3}(\))?[-. ]?\d{3}[-. ]?\d{4}$/;

/*
 Set object value in html
*/
