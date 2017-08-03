"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

const sysPath = require("path");

const clientRootPath = sysPath.resolve(__dirname, "..", "wwwroot");

/**
 * Returns the absolute path for the root of the FoxCloud client.
 */
function getClientRootPath() {
  return clientRootPath;
}
exports.getClientRootPath = getClientRootPath;
