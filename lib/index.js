"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "opcPort", {
  enumerable: true,
  get: function () {
    return _opc.opcPort;
  }
});
Object.defineProperty(exports, "OPC_BODY_FIELDS", {
  enumerable: true,
  get: function () {
    return _opc.OPC_BODY_FIELDS;
  }
});
Object.defineProperty(exports, "composeOPCHeader", {
  enumerable: true,
  get: function () {
    return _opc.composeOPCHeader;
  }
});
Object.defineProperty(exports, "composeOPCMessage", {
  enumerable: true,
  get: function () {
    return _opc.composeOPCMessage;
  }
});
Object.defineProperty(exports, "SK9822_GAMMA", {
  enumerable: true,
  get: function () {
    return _sk.SK9822_GAMMA;
  }
});
Object.defineProperty(exports, "sk9822GammaCorrect", {
  enumerable: true,
  get: function () {
    return _sk.sk9822GammaCorrect;
  }
});
Object.defineProperty(exports, "rgb2sk9822", {
  enumerable: true,
  get: function () {
    return _sk.rgb2sk9822;
  }
});
Object.defineProperty(exports, "colours2sk9822", {
  enumerable: true,
  get: function () {
    return _sk.colours2sk9822;
  }
});
Object.defineProperty(exports, "colours2ws2811", {
  enumerable: true,
  get: function () {
    return _ws281x.colours2ws2811;
  }
});
Object.defineProperty(exports, "colours2ws2812", {
  enumerable: true,
  get: function () {
    return _ws281x.colours2ws2812;
  }
});
exports.colourRateLogger = exports.coloursToString = exports.colourMessage = exports.colourToString = exports.FRESH_CONTEXT = exports.consoleErrorHandler = exports.now = exports.nowFloat = exports.msNow = exports.msNowFloat = void 0;

var _colorsys = require("colorsys");

var _chalk = _interopRequireDefault(require("chalk"));

var _opc = require("./opc");

var _sk = require("./sk9822");

var _ws281x = require("./ws281x");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO remove this eslint disable

/* eslint-disable no-param-reassign */
const msNowFloat = () => new Date().getTime();

exports.msNowFloat = msNowFloat;

const msNow = () => Math.round(msNowFloat());

exports.msNow = msNow;

const nowFloat = () => msNowFloat() / 1000.0;

exports.nowFloat = nowFloat;

const now = () => Math.round(nowFloat());
/**
 * Callback given to spi transfer which logs errors and ignores data returned
 * @param {Error} e optional error if SPI transfer fails
 */


exports.now = now;

const consoleErrorHandler = e => {
  if (e) console.error(e); // if (d) console.log(`spi data received: ${d}`);
};

exports.consoleErrorHandler = consoleErrorHandler;
const FRESH_CONTEXT = {
  // Frame counter for FPS calculation
  frames: 0,
  // FPS rate calculated
  rate: 0.0,
  // time when script started for FPS calculation
  start: now(),
  // Last time something was printed
  lastPrint: now(),
  // Brightness of all strips on the server
  brightness: 0.1
};
/**
 * Convert a single colorsys object to string
 * @param {colorsys RGB object} colour
 */

exports.FRESH_CONTEXT = FRESH_CONTEXT;
const colourToString = _colorsys.rgbToHex;
exports.colourToString = colourToString;

const colourMessage = (hue, msg) => _chalk.default.hsv(hue, 50, 100)(msg);
/**
 * Convert a colours specification to string
 * @param {Array of colorsys RGB objects} colours
 */


exports.colourMessage = colourMessage;

const coloursToString = colours => colours.reduce((accumulator, colour) => accumulator.concat(colourMessage((0, _colorsys.rgbToHsv)(colour).h, colourToString(colour))), '');
/**
 * Middleware used to log a colour being processed, and the framerate.
 * @param {object} context
 */


exports.coloursToString = coloursToString;

const colourRateLogger = context => {
  const {
    start = 0,
    lastPrint = now(),
    frames = 0,
    channelColours
  } = context;
  context.frames += 1;

  if (now() - lastPrint > 1) {
    context.rate = frames / (now() - start + 1);
    console.log(`${coloursToString(Object.values(channelColours)[0].slice(0, 10))} : ${context.rate.toFixed(2)}`);
    context.lastPrint = now();
  }

  return context;
};

exports.colourRateLogger = colourRateLogger;