"use strict";

var _ = require(".");

var expect = require('expect');

expect.extend({
  toBeCloseToBytes: _.toBeCloseToBytes
});