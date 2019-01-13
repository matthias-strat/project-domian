"use strict";

function defineConstant(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

// Global errors
defineConstant("ERR_SUCCESS", 0);
defineConstant("ERR_API_NOT_AUTHORIZED", 1);
defineConstant("ERR_ROLE_NOT_AUTHORIZED", 2);
defineConstant("ERR_ROLE_NO_USER", 3);
defineConstant("ERR_API_INVALID_ROUTE", 8);

defineConstant("ERR_SIGNIN_INVALID_NAME", 10);
defineConstant("ERR_SIGNIN_INVALID_PASSWORD", 11);
defineConstant("ERR_SIGNIN_PENDING", 12);
defineConstant("ERR_SIGNIN_DENIED", 13);
defineConstant("ERR_SIGNIN_LOCAL_NO_USER", 14);

defineConstant("ERR_SIGNUP_INCOMPLETE", 20);
defineConstant("ERR_SIGNUP_PENDING", 21);
defineConstant("ERR_SIGNUP_DENIED", 22);
defineConstant("ERR_SIGNUP_USER_EXISTS", 23);


defineConstant("ERR_USER_NOT_FOUND", 30);
