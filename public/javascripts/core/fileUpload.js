function FileUpload(component) {
  var inputElement = component.querySelector('[type="file"]');
  inputElement.addEventListener("change", handleFiles, false);
  if (component.dataset.image) {
    preview(component.dataset.image);
  }

  function handleFiles() {
    const file = this.files[0];
    readURL(file)
      .then(function (url) {
        preview(url);
      })
      .catch(function () {
        preview(component.dataset.image);
      });
  }

  function readURL(files) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        resolve(e.target.result);
      };
      reader.onerror = function (e) {
        reject(e);
      };
      reader.readAsDataURL(files); // convert to base64 string
    });
  }

  function preview(url) {
    const container = document.createElement("div");
    container.classList.add("preview");
    if (url) {
      const img = document.createElement("img");
      img.src = url;
      container.appendChild(img);
    }
    component.querySelector(".preview").replaceWith(container);
  }
}
export default FileUpload;
