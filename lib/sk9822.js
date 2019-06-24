"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colours2sk9822 = exports.rgb2sk9822 = exports.sk9822GammaCorrect = exports.SK9822_GAMMA = void 0;

var _lodash = require("lodash");

var _bitwise = require("./bitwise");

var _gamma = require("./gamma");

// Constant prefix in first byte of sk9822 frame
const sk9822Prefix = 0xe0; // Mask for brightness bitfield in first byte of sk9822 frame

const sk9822BrightnessMask = 0x1f; // header bytes in sk9822 protocol

const sk9822ResetFrame = [0x00, 0x00, 0x00, 0x00]; // order of colours in sk9822 frame

const sk9822ColourOrder = ['b', 'g', 'r'];
const SK9822_GAMMA = (0, _gamma.createGammaTable)(_bitwise.uint8Max, 2.8);
exports.SK9822_GAMMA = SK9822_GAMMA;

const sk9822GammaCorrect = colour => (0, _lodash.mapValues)(colour, colorVal => SK9822_GAMMA[Math.round(colorVal)]);
/**
 * Given a colorsys RGB objects and a float brightness value from 0 to 1,
 * @return {number[]} the sk9822 frame for this pixel
 */


exports.sk9822GammaCorrect = sk9822GammaCorrect;

const rgb2sk9822 = (colour, brightness = 0.5) => {
  // first byte is a constant 0xE0 + 5 bit brightness value
  const correctedColour = sk9822GammaCorrect(colour);
  return [sk9822Prefix + Math.round(brightness * sk9822BrightnessMask)].concat(sk9822ColourOrder.map(key => correctedColour[key] % _bitwise.uint8Max));
};
/**
 * Given a list of colosys RGB objects, and a float brightness value from 0 to 1,
 * @return {number[]} a complete sk9822 message for the strip
 */


exports.rgb2sk9822 = rgb2sk9822;

const colours2sk9822 = (colours, brightness) => Array.from(sk9822ResetFrame).concat((0, _lodash.flatten)(colours.map(colour => rgb2sk9822(colour, brightness))));

exports.colours2sk9822 = colours2sk9822;