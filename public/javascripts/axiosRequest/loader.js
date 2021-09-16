const loader = {
  init: function (warpper) {
    const loaderWarpper = document.createElement("div");
    loaderWarpper.classList.add("loaderWarpper");
    const htmlLoader = `<div class="loader"></div>`;
    loaderWarpper.innerHTML = htmlLoader;
    const htmlWarpper = document.body.querySelector(warpper);
    htmlWarpper.prepend(loaderWarpper);
    htmlWarpper.querySelector(".loaderWarpper").classList.add("showLoader");
  },
  remove: function (warpper) {
    const htmlWarpper = document.body.querySelector(warpper);
    const loaderWarpper = htmlWarpper.querySelector(".loaderWarpper");

    if (loaderWarpper) {
      loaderWarpper.classList.remove("showLoader");
      if (loaderWarpper.parentNode) {
        loaderWarpper.parentNode.removeChild(loaderWarpper);
      }
    }
  },
};

export default loader;
