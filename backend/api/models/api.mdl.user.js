"use strict";

const mongoose         = require("mongoose"),
      mongoosePaginate = require("mongoose-paginate"),
      bcrypt           = require("bcrypt"),
      Schema           = mongoose.Schema;

const Constants         = require("../api.constants"),
      ROLE_MEMBER       = Constants.ROLE_MEMBER,
      ROLE_ADMIN        = Constants.ROLE_ADMIN,
      ROLE_OWNER        = Constants.ROLE_OWNER,
      VERIFY_PENDING    = Constants.VERIFY_PENDING,
      VERIFY_DENIED     = Constants.VERIFY_DENIED,
      VERIFY_ACCEPTED   = Constants.VERIFY_ACCEPTED;

const UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [ROLE_MEMBER, ROLE_ADMIN, ROLE_OWNER],
    default: ROLE_MEMBER,
    required: true
  },
  verifyState: {
      type: Number,
      enum: [VERIFY_PENDING, VERIFY_DENIED, VERIFY_ACCEPTED],
      required: true,
      default: 0
  },
  applicationDate: {
      type: Date,
      required: false
  }
});

// Pre-save of user to database, hash if password is modified or new.
UserSchema.pre("save", function(next) {
  const user = this;
  const SALT_FACTOR = 5;

  if (!user.isModified("password")) { return next(); }

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, (err, isMatch) => {
        if (err) { return cb(err); }
        cb(null, isMatch);
    });
};

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", UserSchema);
