#!/usr/bin/env node

import path from "node:path";
import bcrypt from "../index.js";

if (process.argv.length < 3) {
  console.log(
    "Usage: " + path.basename(process.argv[1]) + " <input> [rounds|salt]",
  );
  process.exit(1);
} else {
  var salt;
  if (process.argv.length > 3) {
    salt = process.argv[3];
    var rounds = parseInt(salt, 10);
    if (rounds == salt) {
      salt = bcrypt.genSaltSync(rounds);
    }
  } else {
    salt = bcrypt.genSaltSync();
  }
  console.log(bcrypt.hashSync(process.argv[2], salt));
}
