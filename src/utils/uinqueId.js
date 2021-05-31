export default function uniqueId() {
  // always start with a letter (for DOM friendlyness)
  let idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    const ascicodeChar = Math.floor(Math.random() * 25 + 65);
    idstr += String.fromCharCode(ascicodeChar);
    idstr += Math.floor(Math.random() * 99);
  } while (idstr.length < 8);

  return idstr;
}
