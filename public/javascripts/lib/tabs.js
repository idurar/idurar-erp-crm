// store tabs variable

"use strict";

var tabs = function (options) {
  var el = document.querySelector(options.el);
  var tabNavigationLinks = el.querySelectorAll(options.tabNavigationLinks);
  var tabContentContainers = el.querySelectorAll(options.tabContentContainers);
  var activeIndex = 0;
  var initCalled = false;

  /**
   * init
   *
   * @description Initializes the component by removing the no-js class from
   *   the component, and attaching event listeners to each of the nav items.
   *   Returns nothing.
   */
  var init = function () {
    if (!initCalled) {
      initCalled = true;
      el.classList.remove("no-js");

      for (var i = 0; i < tabNavigationLinks.length; i++) {
        var link = tabNavigationLinks[i];
        handleClick(link, i);
      }
    }
  };

  /**
   * handleClick
   *
   * @description Handles click event listeners on each of the links in the
   *   tab navigation. Returns nothing.
   * @param {HTMLElement} link The link to listen for events on
   * @param {Number} index The index of that link
   */
  var handleClick = function (link, index) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      goToTab(index);
    });
  };

  /**
   * goToTab
   *
   * @description Goes to a specific tab based on index. Returns nothing.
   * @param {Number} index The index of the tab to go to
   */
  var goToTab = function (index) {
    if (index >= 0 && index <= tabNavigationLinks.length) {
      console.log(activeIndex);

      [].forEach.call(tabNavigationLinks, function (tabNavigationLink) {
        tabNavigationLink.classList.remove("is-active");
      });
      [].forEach.call(tabContentContainers, function (tabContentContainer) {
        tabContentContainer.classList.remove("is-active");
      });

      tabNavigationLinks[index].classList.add("is-active");
      tabContentContainers[index].classList.add("is-active");

      activeIndex = index;
    }
  };

  /**
   * Returns init and goToTab
   */
  return {
    init: init,
    goToTab: goToTab,
  };
};

/**
 * Attach to global namespace
 */
window.tabs = tabs;

export default tabs;
