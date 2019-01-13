"use strict";

const jwt         = require("jsonwebtoken"),
      User        = require("../models/api.mdl.user"),
      config      = require("../../config/config"),
      setUserInfo = require("../api.utilities").setUserInfo,
      getRole     = require("../api.utilities").getRole,
      ApiError    = require("../api.error"),
      ErrorCodes  = require("../api.errorCodes"),
      Constants   = require("../api.constants");

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // seconds (7 days)
  });
}

// Sign-in route
exports.signin = function(req, res, next) {
  const userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
}

// Sign-up route
exports.signup = function(req, res, next) {
  const name     = req.body.name;
  const password = req.body.password;
  const email     = req.body.email;

  if (!name || !password || !email) {
    return next(new ApiError("The registration request which has been sent is missing information.", 422, ErrorCodes.ERR_SIGNUP_INCOMPLETE));
  }

  User.findOne({ name }, (err, existingUser) => {
    if (err) { return next(err); }

    // If user is not unique, return error
    if (existingUser) {
      let error = {};
      if (existingUser.verifyState == Constants.VERIFY_PENDING) {
        error.message = "You have already applied but your application has not been reviewed yet.";
        error.code = ErrorCodes.ERR_SIGNUP_PENDING;
      } else if (existingUser.verifyState == Constants.VERIFY_DENIED) {
        error.message = "You have already applied but your application was refused.";
        error.code = ErrorCodes.ERR_SIGNUP_DENIED;
      } else {
        error.message = "The specified username is already in use.";
        error.code = ErrorCodes.ERR_SIGNUP_USER_EXISTS;
      }

      return next(new ApiError(error.message, 422, error.code));
    }

    // create the new user object
    const user = new User({
      name: name,
      password: password,
      email: email,
      applicationDate: Date.now()
    });

    user.save((err, user) => {
      if (err) { return next(err); }

      // repond with user information
      const userInfo = setUserInfo(user);

      res.status(201).json({ user: userInfo });
    });
  });
};

// role authentication check
exports.roleAuthentication = function(requiredRole) {
  return function(req, res, next) {
    const user = req.user;

    // check if the requested user does exist
    User.findById(user._id, (err, existingUser) => {
      if (err) {
        return next(err);
      }

      if (!existingUser) {
        return next(new ApiError("No user was found.", 422, ErrorCodes.ERR_ROLE_NO_USER));
      }

      // check if it's role is high enough
      if (getRole(foundUser.role) >= getRole(requiredRole)) {
        return next();
      }
      return next(new ApiError("You are not authorized to view this content", 401, ErrorCodes.ERR_ROLE_NOT_AUTHORIZED));
    });
  }
};
