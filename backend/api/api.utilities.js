"use strict";

const ROLE_MEMBER = require("./api.constants").ROLE_MEMBER;
const ROLE_ADMIN  = require("./api.constants").ROLE_ADMIN;
const ROLE_OWNER  = require("./api.constants").ROLE_OWNER;

exports.setUserInfo = function(req) {
  return {
    _id: req._id,
    name: req.name,
    email: req.email,
    role: req.role
  };
};

exports.getRole = function(checkRole) {
  let role;

  switch (checkRole) {
    case ROLE_OWNER: role = 3; break;
    case ROLE_ADMIN: role = 2; break;
    case ROLE_MEMBER: role = 1; break;
    default: role = 1;
  }
  return role;
};

exports.getLimitFromReq = function(req) {
  // extract query limit from url and clamp its value between 1 and 50
  let limit = parseInt(req.query.limit, 10);
  if (isNaN(limit)) {
    limit = 10;
  } else if (limit > 50) {
    limit = 50;
  } else if (limit < 1) {
    limit = 1;
  }
  return limit;
};

exports.getOffsetFromReq = function(req) {
let offset = parseInt(req.query.offset, 10);
  if (isNaN(offset)) {
    offset = 0;
  }
  return offset;
};
