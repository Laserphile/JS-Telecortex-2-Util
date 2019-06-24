"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeOPCMessage = exports.composeOPCHeader = exports.OPC_BODY_FIELDS = exports.opcPort = void 0;

var _bitwise = require("./bitwise");

const opcPort = 42069;
exports.opcPort = opcPort;
const OPC_BODY_FIELDS = ['r', 'g', 'b']; // eslint-disable-next-line no-bitwise

exports.OPC_BODY_FIELDS = OPC_BODY_FIELDS;

const composeOPCHeader = (channel, bytes) => [channel, 0, bytes >> 8, bytes % _bitwise.uint8Max];
/**
 * TODO: write OPC composer
 */


exports.composeOPCHeader = composeOPCHeader;

const composeOPCMessage = (channel, colours) => Buffer.from(colours.reduce((opcArray, colour) => {
  const pixelBytes = OPC_BODY_FIELDS.map(key => colour[key]);
  opcArray.push(...pixelBytes);
  return opcArray;
}, composeOPCHeader(channel, colours.length * 3)));

exports.composeOPCMessage = composeOPCMessage;