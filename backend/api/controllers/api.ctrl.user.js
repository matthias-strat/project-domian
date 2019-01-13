"use strict";

const _           = require("lodash"),
      User        = require("../models/api.mdl.user"),
      Utilities   = require("../api.utilities"),
      Constants   = require("../api.constants"),
      ApiError    = require("../api.error"),
      ErrorCodes  = require("../api.errorCodes");

exports.showInfo = function(req, res, next) {
  const userId = req.params.userId;

  User.findById(userId, (err, user) => {
    if (err) {
      return next(new ApiError("No user could be found for this ID.", 400, ErrorCodes.ERR_USER_NOT_FOUND))
    }

    const userInfo = Utilities.setUserInfo(user);
    return res.status(200).json({ user: userInfo });
  });
};
