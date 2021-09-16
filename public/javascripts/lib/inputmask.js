function inputmask(input) {
  const that = input;

  that.addEventListener("keyup", function (e) {
    // Prepend 0 to Month when press the key 2 or any more then 2 number because Month will not starting form 2 or more.
    if (that.value.length == 1 && parseInt(e.key) >= 2) {
      that.value = "0" + e.key;
    }

    // Prepend 0 to Day when press the key 4 or any more then 4 number because Date will not starting form 4 or more.
    if (that.value.length == 4 && parseInt(e.key) >= 4) {
      that.value = that.value.slice(0, 3) + "0" + e.key;
    }
  });

  that.addEventListener("keypress", function (e) {
    var len = that.value.length;
    // Stop typing when length 10
    if (len >= 10) {
      e.preventDefault();
    }
  });

  that.addEventListener("keydown", function (e) {
    if (e.keyCode < 47 || e.keyCode > 57) {
      e.preventDefault();
    }

    var len = that.value.length;
    // If we're at a particular place, let the admin type the slash
    // i.e., 12/12/1212
    if (len !== 1 || len !== 3) {
      if (e.keyCode == 47) {
        e.preventDefault();
      }
    }

    // If they don't add the slash, do it for them...
    if (len === 2) {
      that.value += "/";
    }

    // If they don't add the slash, do it for them...
    if (len === 5) {
      that.value += "/";
    }

    if (e.keyCode == 8) {
      that.value = "";
    }
  });
}

export default inputmask;
