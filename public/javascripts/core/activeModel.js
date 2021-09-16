function activeModel(params) {
  const models = document.querySelectorAll(".model");
  [].forEach.call(models, function (model) {
    model.classList.add("hidden");
  });
  const model = document.querySelector(`.model[data-model="${params}"]`);
  if (model) {
    model.classList.remove("hidden");
  }
}
export default activeModel;
