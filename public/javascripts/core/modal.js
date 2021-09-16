function outsideClick(e) {
  if (e.target.closest(".modal-inner")) {
    return;
  }
  const modalVisible = document.querySelector(".modal-visible");
  if (modalVisible) {
    closeModal();
  }
}
function escKey(e) {
  if (e.keyCode == 27) {
    closeModal();
  }
}

function closeClick(e) {
  if (e.target.classList.contains("closeModal")) {
    closeModal();
  } else return;
}

const closeModal = function () {
  const vanillaModal = document.querySelector(".vanilla-modal");
  if (vanillaModal) {
    vanillaModal.classList.remove("modal-visible");
    document.getElementById("modal-content").innerHTML = "";
    document.getElementById("modal-content").style = "";
  }

  document.removeEventListener("keydown", escKey);
  document.removeEventListener("click", outsideClick, true);
  document.removeEventListener("click", closeClick);
};

const modal = {
  init: function () {
    // console.log("init function executed")
    const prerendredModal = document.createElement("div");
    prerendredModal.classList.add("vanilla-modal");
    const htmlModal = `         
       <div class="modal">
       <div class="modal-inner"
       ><div id="modal-content"></div></div></div>`;
    prerendredModal.innerHTML = htmlModal;
    document.body.appendChild(prerendredModal);
  },
  open: function (idContent, option = { default: null }) {
    let vanillaModal = document.querySelector(".vanilla-modal");
    if (!vanillaModal) {
      console.log("there is no vanilla modal class");
      modal.init();
      vanillaModal = document.querySelector(".vanilla-modal");
    }

    const content = document.getElementById(idContent);
    let currentModalContent = content.cloneNode(true);
    currentModalContent.classList.add("current-modal");
    currentModalContent.style = "";
    document.getElementById("modal-content").appendChild(currentModalContent);

    if (!option.default) {
      if (option.width && option.height) {
        document.getElementById("modal-content").style.width = option.width;
        document.getElementById("modal-content").style.height = option.height;
      }
    }
    vanillaModal.classList.add("modal-visible");

    document.addEventListener("click", outsideClick, true);
    document.addEventListener("keydown", escKey);
    document
      .getElementById("modal-content")
      .addEventListener("click", closeClick);
  },

  close: function () {
    closeModal();
  },
};

export default modal;
