export default function subMenuDrawer() {
  const drawerMenus = document.querySelectorAll(".has-sub-menu-drawer");
  const closeIcon = document.querySelector("nav .close-icon");
  drawerMenus.forEach((menu, index) => {
    var submenu = menu.querySelector("ul");
    if (!submenu) {
      return;
    }
    var drawerItems = document.createElement("div");
    drawerItems.classList.add("drawer");
    drawerItems.classList.add("drawer-" + index);
    drawerItems.append(submenu.cloneNode(true));
    drawerItems.querySelector("ul").classList.add("navMenu");

    var closeButtom = document.createElement("button");
    closeButtom.classList.add("close");
    var closeIconClone = closeIcon.cloneNode(true);
    closeIconClone.classList.remove("hidden");
    closeButtom.append(closeIconClone);
    // var closeLabel = document.createElement('p');
    // closeLabel.innerHTML = "Close"
    // closeButtom.append(closeLabel);
    drawerItems.prepend(closeButtom);

    menu.querySelector("a").addEventListener("click", function () {
      drawerItems.classList.add("active");
    });
    closeButtom.addEventListener("click", function () {
      drawerItems.classList.remove("active");
    });
    menu.closest(".nav-container").append(drawerItems);
  });
}
