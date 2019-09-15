"use strict";

var _opc = require("./opc");

require('./setupTests.js');

describe('composeOPCHeader', () => {
  it('works', () => {
    expect((0, _opc.composeOPCHeader)(4, 1337)).toBeCloseToBytes([0x04, 0x00, 0x05, 0x39]);
  });
});
describe('composeOPCMessage', () => {
  it('works', () => {
    expect((0, _opc.composeOPCMessage)(4, [{
      r: 0x01,
      g: 0x02,
      b: 0x03
    }, {
      r: 0x04,
      g: 0x05,
      b: 0x06
    }])).toBeCloseToBytes([0x04, 0x00, 0x00, 0x06, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06]);
  });
});