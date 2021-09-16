var sayHi = function (options) {
  "use strict";

  // Default settings
  var defaults = {
    message: "Hello, world!",
    selector: "#app",
  };

  // Merge admin options into defaults
  var settings = Object.assign({}, defaults, options);

  // Do something...
  // Here's an example

  // Get an element and show the message
  var app = document.querySelector(settings.selector);
  if (app) {
    app.textContent = settings.message;
  }
};

sayHi({
  message: "Hi, universe!",
});

sayHi({
  selector: "#message",
});
