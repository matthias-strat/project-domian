"use strict";

module.exports = function ApiError(message, statusCode, errorCode) {
  this.message = message || "An unkown API error has occurred.";
  this.statusCode = statusCode || 500;
  this.errorCode = errorCode || 500;
}

require("util").inherits(module.exports, Error);
