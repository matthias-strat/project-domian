"use strict";

// Import required modules
const express     = require("express"),
      passport    = require("passport"),
      passportSvc = require("../config/config.passport"),
      ApiError    = require("./api.error"),
      ErrorCodes  = require("./api.errorCodes");

// Import custom controllers
const AuthCtrl    = require("./controllers/api.ctrl.authentication"),
      UserCtrl    = require("./controllers/api.ctrl.user");

// Middlewares to require auth / login
const requireAuth = function(req, res, next) {
  passport.authenticate("jwt", {session: false}, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return next(new ApiError("You are not authorized to view this content.", 401, ErrorCodes.ERR_API_NOT_AUTHORIZED));
    }
    req.user = user;
    return next();
  })(req, res, next);
};

const requireLogin = function(req, res, next) {
    passport.authenticate("local", {session: false}, (err, user, apiError) => {
      if (err) { return next(err); }
      if (apiError) { return next(apiError); }
      if (!user) { return next(new ApiError(info.message, 401, ErrorCodes.ERR_SIGNIN_LOCAL_NO_USER)); }
      req.user = user;
      return next();
    })(req, res, next);
};

module.exports = function(app) {
  app.use(passport.initialize());

  // initialize router groups
  const apiRouter   = express.Router(),
        authRouter  = express.Router(),
        userRouter  = express.Router();

  // root GET
  apiRouter.get("/", (req, res, next) => {
    return res.status(200).json({message: "Welcome to the Domian-Project REST API!"});
  });

  // authentication router
  apiRouter.use("/auth", authRouter);
  authRouter.post("/signup", AuthCtrl.signup);
  authRouter.post("/signin", requireLogin, AuthCtrl.signin);

  apiRouter.use("/user", userRouter);
  userRouter.get("/:userId", requireAuth, UserCtrl.showInfo);

  app.use("/api/v1", apiRouter);

  // invalid route middleware
  app.use((req, res, next) => {
    return res.status(404).json({
      error: {
          message: "Invalid API route",
          code: ErrorCodes.ERR_API_INVALID_ROUTE
      }
    });
  });

  // error handler middleware
  app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
      error: {
        message: err.message,
        code: err.errorCode
      }
    });
  });
};
