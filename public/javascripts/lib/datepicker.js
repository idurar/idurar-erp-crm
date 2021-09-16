let currentDatepicker = null;

let datepicker = function (query, options) {
  if (!(this instanceof datepicker)) return new datepicker(query, options);

  currentDatepicker = self = this;
  self.options = extend({}, datepicker.defaults, options);
  self.query = query;

  self.__init__();
};

datepicker.prototype = {
  constructor: datepicker,

  __init__: function () {
    // Bind display on click
    document.removeEventListener("click", self.bindCalendar, false);
    document.removeEventListener("keypress", self.keypressHandler, false);
    document.addEventListener("click", self.bindCalendar, false);
    document.addEventListener("keypress", self.keypressHandler, false);
  },

  matchesReferers: function (elm) {
    self.referers = document.querySelectorAll(self.query);
    for (var i = 0; i < self.referers.length; i++) {
      if (elm === self.referers[i]) return true;
    }
    return false;
  },

  close: function () {
    delete self.current;
    delete self.target;
    if (self.picker) self.picker.remove();
  },

  show: function (target) {
    self.target = typeof target != typeof undefined ? target : self.target;
    if (target || typeof self.current == typeof undefined) {
      var current = new Date();
      if (target) self.selected = null;
      if (target && target.value) {
        var ts = self.parseDate(target.value);
        current = new Date(ts);
        self.selected = {
          year: current.getFullYear(),
          month: current.getMonth(),
          day: current.getDate(),
        };
      }
      self.current = {
        year: current.getFullYear(),
        month: current.getMonth(),
      };
    }
    self.cleanPicker();
    self.drawPicker();
  },

  cleanPicker: function () {
    var picker = document.querySelector(".vanilla-datepicker");
    if (picker) picker.remove();
  },

  drawPicker: function () {
    var position = {
      x: self.target.offsetLeft,
      y: self.target.offsetTop + self.target.offsetHeight,
    };
    self.picker = document.createElement("div");
    self.picker.classList.add("vanilla-datepicker");
    self.picker.style.left = position.x + "px";
    self.picker.style.top = position.y + "px";
    self.picker.appendChild(self.drawNavigation());
    self.picker.appendChild(self.drawWeekHeader());
    var weeks = self.getWeeks();
    for (var i = 0; i < weeks.length; i++) {
      self.picker.appendChild(weeks[i]);
    }

    self.target.parentNode.insertBefore(self.picker, self.target.nextSibling);
  },

  drawNavigation: function () {
    var nav = document.createElement("div");
    nav.classList.add("title-nav");
    let previousYear;
    let nextYear;
    let previousMonth;
    let currentMonth;
    let nextMonth;
    if (self.options.navigateYear) {
      previousYear = document.createElement("div");
      previousYear.classList.add("year-navigate");
      previousYear.classList.add("nav-items");
      previousYear.classList.add("previous");
      previousYear.setAttribute("tabIndex", 0);
      previousYear.innerHTML =
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"> <title></title> <g id="icomoon-ignore"> </g> <path fill="#fff" d="M13.008 543.386l389.18 389.18c17.344 17.342 45.428 17.342 62.772 0 17.342-17.328 17.342-45.444 0-62.772l-357.796-357.794 357.794-357.794c17.342-17.328 17.342-45.444 0-62.772-8.672-8.672-20.022-13.008-31.386-13.008s-22.73 4.336-31.386 13.008l-389.18 389.18c-17.342 17.328-17.342 45.444 0.002 62.772z"></path> <path fill="#fff" d="M559.042 543.386l389.18 389.18c17.328 17.342 45.444 17.342 62.772 0 17.342-17.328 17.342-45.444 0-62.772l-357.78-357.794 357.778-357.794c17.342-17.328 17.342-45.444 0-62.772-8.656-8.672-20.022-13.008-31.386-13.008s-22.73 4.336-31.386 13.008l-389.18 389.18c-17.34 17.328-17.34 45.444 0.002 62.772z"></path> </svg>';

      previousYear.addEventListener("click", self.getPreviousYear, false);

      nextYear = document.createElement("div");
      nextYear.classList.add("year-navigate");
      nextYear.classList.add("next");
      nextYear.classList.add("nav-items");
      nextYear.setAttribute("tabIndex", 0);
      nextYear.innerHTML =
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"> <title></title> <g id="icomoon-ignore"> </g> <path fill="#fff" d="M1010.992 480.614l-389.18-389.18c-17.344-17.342-45.428-17.342-62.772 0-17.342 17.328-17.342 45.444 0 62.772l357.796 357.794-357.794 357.794c-17.342 17.328-17.342 45.444 0 62.772 8.672 8.672 20.022 13.008 31.386 13.008s22.73-4.336 31.386-13.008l389.18-389.18c17.342-17.328 17.342-45.444-0.002-62.772z"></path> <path fill="#fff" d="M464.958 480.614l-389.18-389.18c-17.328-17.342-45.444-17.342-62.772 0-17.342 17.328-17.342 45.444 0 62.772l357.78 357.794-357.778 357.794c-17.342 17.328-17.342 45.444 0 62.772 8.656 8.672 20.022 13.008 31.386 13.008s22.73-4.336 31.386-13.008l389.18-389.18c17.34-17.328 17.34-45.444-0.002-62.772z"></path> </svg>';

      nextYear.addEventListener("click", self.getNextYear, false);
    }
    previousMonth = document.createElement("div");
    previousMonth.classList.add("month-navigate");
    previousMonth.classList.add("nav-items");
    previousMonth.classList.add("previous");
    previousMonth.setAttribute("tabIndex", 0);
    previousMonth.innerHTML =
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"> <title></title> <g id="icomoon-ignore"> </g> <path fill="#fff" d="M331.295 512.238l444.985-444.985c15.384-15.386 15.384-40.33 0-55.716-15.388-15.381-40.33-15.381-55.716 0l-472.843 472.843c-15.381 15.386-15.381 40.33 0 55.716l472.843 472.843c15.654 15.118 40.598 14.684 55.716-0.97 14.746-15.27 14.746-39.478 0-54.746l-444.985-444.985z"></path> </svg>';

    previousMonth.addEventListener("click", self.getPreviousMonth, false);

    // currentMonth = document.createTextNode(
    //     self.options.months.long[self.current.month] + ' ' + self.current.year
    //     );

    nextMonth = document.createElement("div");
    nextMonth.classList.add("month-navigate");
    nextMonth.classList.add("nav-items");
    nextMonth.classList.add("next");
    nextMonth.setAttribute("tabIndex", 0);
    nextMonth.innerHTML =
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"> <title></title> <g id="icomoon-ignore"> </g> <path fill="#fff" d="M776.847 483.9l-473.63-472.32c-15.518-15.466-40.642-15.44-56.134 0.080-15.48 15.518-15.44 40.656 0.080 56.134l445.438 444.208-445.454 444.206c-15.518 15.48-15.558 40.602-0.080 56.122 7.766 7.78 17.94 11.67 28.114 11.67 10.148 0 20.282-3.864 28.034-11.59l473.632-472.308c7.474-7.436 11.668-17.556 11.668-28.1s-4.206-20.652-11.668-28.102z"></path> </svg>';

    nextMonth.addEventListener("click", self.getNextMonth, false);

    currentMonth = document.createElement("div");
    currentMonth.classList.add("month-lable");
    currentMonth.classList.add("nav-items");
    currentMonth.innerHTML =
      self.options.months.long[self.current.month] + " " + self.current.year;

    //nextMonth.addEventListener('click', self.getNextMonth, false);

    if (self.options.navigateYear) nav.appendChild(previousYear);
    nav.appendChild(previousMonth);
    nav.appendChild(currentMonth);
    nav.appendChild(nextMonth);
    if (self.options.navigateYear) nav.appendChild(nextYear);

    return nav;
  },

  getPreviousYear: function () {
    var current = new Date(self.current.year - 1, self.current.month);
    self.current = {
      year: current.getFullYear(),
      month: current.getMonth(),
    };
    self.show();
  },

  getNextYear: function () {
    var current = new Date(self.current.year + 1, self.current.month);
    self.current = {
      year: current.getFullYear(),
      month: current.getMonth(),
    };
    self.show();
  },

  getPreviousMonth: function () {
    var current = new Date(self.current.year, self.current.month - 1);
    self.current = {
      year: current.getFullYear(),
      month: current.getMonth(),
    };
    self.show();
  },

  getNextMonth: function () {
    var current = new Date(self.current.year, self.current.month + 1);
    self.current = {
      year: current.getFullYear(),
      month: current.getMonth(),
    };
    self.show();
  },

  drawWeekHeader: function () {
    var weekdays = self.options.weekdays.short
      .slice(self.options.firstDayOfWeek)
      .concat(
        self.options.weekdays.short.slice(0, self.options.firstDayOfWeek)
      );
    var weekHeader = document.createElement("div");
    weekHeader.classList.add("week-header");
    for (var i = 0; i < 7; i++) {
      var dayOfWeek = document.createElement("div");
      dayOfWeek.setAttribute("tabIndex", 0);
      dayOfWeek.innerHTML = weekdays[i];
      weekHeader.appendChild(dayOfWeek);
    }
    return weekHeader;
  },

  getWeeks: function () {
    // Get week days according to options
    var weekdays = self.options.weekdays.short
      .slice(self.options.firstDayOfWeek)
      .concat(
        self.options.weekdays.short.slice(0, self.options.firstDayOfWeek)
      );
    // Get first day of month and update acconding to options
    var firstOfMonth = new Date(
      self.current.year,
      self.current.month,
      1
    ).getDay();
    firstOfMonth =
      firstOfMonth < self.options.firstDayOfWeek
        ? 7 + (firstOfMonth - self.options.firstDayOfWeek)
        : firstOfMonth - self.options.firstDayOfWeek;

    var daysInPreviousMonth = new Date(
      self.current.year,
      self.current.month,
      0
    ).getDate();
    var daysInMonth = new Date(
      self.current.year,
      self.current.month + 1,
      0
    ).getDate();

    var days = [],
      weeks = [];
    // Define last days of previous month if current month does not start on `firstOfMonth`
    for (var i = firstOfMonth - 1; i >= 0; i--) {
      var day = document.createElement("div");
      day.classList.add("no-select");
      day.innerHTML = daysInPreviousMonth - i;
      days.push(day);
    }
    // Define days in current month
    for (var i = 0; i < daysInMonth; i++) {
      if (i && (firstOfMonth + i) % 7 === 0) {
        weeks.push(self.addWeek(days));
        days = [];
      }
      var day = document.createElement("div");
      day.classList.add("day");
      if (
        self.selected &&
        self.selected.year == self.current.year &&
        self.selected.month == self.current.month &&
        self.selected.day == i + 1
      ) {
        day.classList.add("selected");
      }
      day.setAttribute("tabIndex", 0);
      day.innerHTML = i + 1;
      days.push(day);
    }
    // Define days of next month if last week is not full
    if (days.length) {
      var len = days.length;
      for (var i = 0; i < 7 - len; i++) {
        var day = document.createElement("div");
        day.classList.add("no-select");
        day.innerHTML = i + 1;
        days.push(day);
      }
      weeks.push(self.addWeek(days));
    }
    return weeks;
  },

  addWeek: function (days) {
    var week = document.createElement("div");
    week.classList.add("week");
    for (var i = 0; i < days.length; i++) {
      week.appendChild(days[i]);
    }
    return week;
  },

  setDate: function (day) {
    var oldDateValue = self.target.value;
    var dayOfWeek = new Date(
      self.current.year,
      self.current.month,
      day
    ).getDay();
    var date = self.options.outputFormat
      .replace("%a", self.options.weekdays.short[dayOfWeek])
      .replace("%A", self.options.weekdays.long[dayOfWeek])
      .replace("%d", ("0" + day).slice(-2))
      .replace("%e", day)
      .replace("%b", self.options.months.short[self.current.month])
      .replace("%B", self.options.months.long[self.current.month])
      .replace("%m", ("0" + (self.current.month + 1)).slice(-2))
      .replace("%w", dayOfWeek)
      .replace("%Y", self.current.year);
    self.target.value = date;

    if (date !== oldDateValue) {
      if ("createEvent" in document) {
        var changeEvent = document.createEvent("HTMLEvents");
        changeEvent.initEvent("change", false, true);
        self.target.dispatchEvent(changeEvent);
      } else {
        self.target.fireEvent("onchange");
      }
    }
  },

  parseDate: function (date) {
    var acceptedFormats = [
        "%a",
        "%A",
        "%d",
        "%e",
        "%b",
        "%B",
        "%m",
        "%w",
        "%Y",
      ],
      pattern = new RegExp(
        self.options.outputFormat.replace(/%[a-zA-Z]/g, "(.+)")
      ),
      groups = pattern.exec(self.options.outputFormat),
      matches = pattern.exec(date),
      date = new Date();

    for (var i = 1; i < matches.length; i++) {
      if (acceptedFormats.indexOf(groups[i]) == -1) {
        console.log("DatePicker : Format error");
        break;
      }

      switch (groups[i]) {
        case "%d":
        case "%e":
          date.setDate(matches[i]);
          break;
        case "%m":
          date.setMonth(parseInt(matches[i]) - 1, date.getDate());
          break;
        case "%b":
          var month = self.options.months.short.indexOf(matches[i]);
        case "%B":
          month =
            month != -1 ? month : self.options.months.long.indexOf(matches[i]);
          date.setMonth(month, date.getDate());
          break;
        case "%Y":
          date.setYear(matches[i]);
          break;
      }
    }
    return date;
  },

  bindCalendar: function (event) {
    var target = event.target;

    if (target.classList.contains("day")) {
      self.setDate(target.innerHTML);
      self.close();
    } else {
      while (
        target &&
        !self.matchesReferers(target) &&
        target.className != "vanilla-datepicker"
      ) {
        target = target.parentNode;
      }
      if (target && self.matchesReferers(target)) self.show(target);
      if (!target) self.close();
    }
  },

  keypressHandler: function (event) {
    var keyCode = event.which || event.keyCode;
    if (keyCode === 13) {
      self.bindCalendar(event);
    }
  },
};

datepicker.defaults = {
  firstDayOfWeek: 0,
  months: {
    short: [
      "Jan",
      "Fev",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jul",
      "Aout",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    long: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  navigateYear: true,
  outputFormat: "%d/%m/%Y",
  weekdays: {
    short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    long: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
};

// utils
var camelCase = function (string) {
  return string.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};

var extend = function (out) {
  out = out || {};
  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i]) continue;
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
    }
  }

  return out;
};

var is = function (el, query) {
  return (
    el.matches ||
    el.matchesSelector ||
    el.msMatchesSelector ||
    el.mozMatchesSelector ||
    el.webkitMatchesSelector ||
    el.oMatchesSelector
  ).call(el, query);
};

export default datepicker;
