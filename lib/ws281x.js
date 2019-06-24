"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colours2ws2812 = exports.colours2ws2811 = exports.rgb2ws2812 = exports.rgb2ws2811 = exports.pack3BitSymbols = exports.toWs281x3BitSymbols = void 0;

var _lodash = require("lodash");

var _bitwise = require("./bitwise");

// order of colours in ws2811 frame
const ws2811ColourOrder = ['r', 'g', 'b'];
const ws2812ColourOrder = ['g', 'r', 'b']; // symbols in ws281x protocol

const ws281xReset = 0b000;
const ws281xBit1 = 0b110;
const ws281xBit0 = 0b100;
/**
 * Given a byte
 * @return {number[]} , a list of 3bit symbols for ws281x
 */

const toWs281x3BitSymbols = byte => {
  return (0, _lodash.rangeRight)(0, 8).map(bit => 0b1 << bit & byte ? ws281xBit1 : ws281xBit0);
};
/**
 * Given a list of 3 bit symbols,
 * @return {number[]} the symbos concatenated into a single stream of bytes to be transmitted MSB first
 */


exports.toWs281x3BitSymbols = toWs281x3BitSymbols;

const pack3BitSymbols = symbols => {
  const symbolSize = 3;
  const out = new Uint8Array(Math.ceil(symbols.length * symbolSize / _bitwise.uint8Bits));
  var bitCount = 0;
  var mask, shift, byteIndex;
  symbols.forEach(symbol => {
    byteIndex = Math.floor(bitCount / _bitwise.uint8Bits);
    shift = _bitwise.uint8Bits - symbolSize - bitCount % _bitwise.uint8Bits;

    if (shift >= 0) {
      mask = (symbol << shift) % _bitwise.uint8Max;
      out[byteIndex] |= mask; // console.log(`out[${byteIndex}] |= (0b${symbol.toString(2)} << ${shift} => 0b${mask.toString(2)}) => 0b${out[byteIndex].toString(2)}`)
    } else {
      mask = symbol >> -shift;
      out[byteIndex] |= mask; // console.log(`out[${byteIndex}] |= (0b${symbol.toString(2)} >> ${-shift} => 0b${mask.toString(2)}) => 0b${out[byteIndex].toString(2)}`)
      // Do the second byte

      shift += _bitwise.uint8Bits;
      mask = (symbol << shift) % _bitwise.uint8Max;
      byteIndex += 1;
      out[byteIndex] |= mask; // console.log(`out[${byteIndex}] |= (0b${symbol.toString(2)} << ${shift} => 0b${mask.toString(2)}) => 0b${out[byteIndex].toString(2)}`)
    }

    bitCount += symbolSize;
  });
  return out;
};
/**
 * Given a colorsys RGB objects and a float brightness value from 0 to 1,
 * @return {number[]} the ws2811 frame for this pixel as a list of 3-bit symbols
 */


exports.pack3BitSymbols = pack3BitSymbols;

const rgb2ws2811 = (colour, brightness = 0.5) => {
  return (0, _lodash.flatten)(ws2811ColourOrder.map(key => toWs281x3BitSymbols(Math.round(brightness * colour[key]) % _bitwise.uint8Max)));
};
/**
 * Given a colorsys RGB objects and a float brightness value from 0 to 1,
 * @return {number[]} the ws2812 frame for this pixel as a list of 3-bit symbols
 */


exports.rgb2ws2811 = rgb2ws2811;

const rgb2ws2812 = (colour, brightness = 0.5) => {
  return (0, _lodash.flatten)(ws2812ColourOrder.map(key => toWs281x3BitSymbols(Math.round(brightness * colour[key]) % _bitwise.uint8Max)));
};
/**
 * Given a list of colosys RGB objects, and a float brightness value from 0 to 1,
 * @return {number[]} a complete ws2811 message for the strip
 */


exports.rgb2ws2812 = rgb2ws2812;

const colours2ws2811 = (colours, brightness) => pack3BitSymbols([ws281xReset].concat((0, _lodash.flatten)(colours.map(colour => rgb2ws2811(colour, brightness)))));
/**
 * Given a list of colosys RGB objects, and a float brightness value from 0 to 1,
 * @return {number[]} a complete ws2812 message for the strip
 */


exports.colours2ws2811 = colours2ws2811;

const colours2ws2812 = (colours, brightness) => pack3BitSymbols([ws281xReset].concat((0, _lodash.flatten)(colours.map(colour => rgb2ws2812(colour, brightness)))));

exports.colours2ws2812 = colours2ws2812;