"use strict";

// Import passport, strategies and config
const passport      = require("passport"),
      User          = require("../api/models/api.mdl.user"),
      config        = require("./config"),
      JwtStrategy   = require("passport-jwt").Strategy,
      ExtractJwt    = require("passport-jwt").ExtractJwt,
      LocalStrategy = require("passport-local"),
      ApiError      = require("../api/api.error"),
      ErrorCodes    = require("../api/api.errorCodes");

// Set username field to username
const localOptions = {
  usernameField: "name"
};

// Setup local login strategy
const localLogin = new LocalStrategy(localOptions, (name, password, next) => {
  User.findOne({ name }, (err, user) => {
    if (err) { return next(err); }
    if (!user) { 
      return next(null, false, new ApiError("We can't sign you in with the specified credentials. Please try again.", 401, ErrorCodes.ERR_SIGNIN_INVALID_NAME))
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return next(err); }
      if (!isMatch) {
        return next(null, false, new ApiError("We can't sign you in with the specified credentials. Please try again.", 401, ErrorCodes.ERR_SIGNIN_INVALID_PASSWORD))
      }
      if (user.verifyState == 0) {
        return next(null, false, new ApiError("We can't sign you in because your account has not been accepted yet. Please be patient.", 401, ErrorCodes.ERR_SIGNIN_PENDING))
      }
      if (user.verifyState == 1) {
         return next(null, false, new ApiError("Your application has been reviewed but was refused. You can't sign in, sorry!", 401, ErrorCodes.ERR_SIGNIN_DENIED ))
      }

      return next(null, user);
    });
  });
});

// JWT Strategy options
const jwtOptions = {
    // check in auth headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    // secret
    secretOrKey: config.secret
};

// Setup JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, next) => {
  User.findById(payload._id, (err, user) => {
    if (err) { return next(err, false); }

    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
