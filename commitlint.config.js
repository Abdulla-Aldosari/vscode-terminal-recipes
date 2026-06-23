// @ts-check
"use strict";

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // `2` = error (refuses to commit)
    // "never" = The scope is never allowed to be empty
    "scope-empty": [2, "never"],
  },
};
