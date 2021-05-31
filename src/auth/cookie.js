// export function getCookie(cookieName) {
//   let name = cookieName + "=";
//   let ca = document.cookie.split(";");
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0)===" ") {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name)===0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }

// export function setCookie(cookieName, cookieValue, expireDays = 1) {
//   let d = new Date();
//   d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
//   let expires = "expires=" + d.toUTCString();
//   document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
// }

// export function deleteCookie(cookieName) {
//   document.cookie = cookieName + "=; Max-Age=-99999999; ";
//   return true;
// }

export function setCookie(cookieName, cookieValue) {
  window.localStorage.setItem(cookieName, JSON.stringify(cookieValue));
}
export function getCookie(cookieName) {
  const result = window.localStorage.getItem(cookieName);
  return JSON.parse(result);
}
export function deleteCookie(cookieName) {
  window.localStorage.removeItem(cookieName);
  return true;
}
