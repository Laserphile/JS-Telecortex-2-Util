// TODO remove this eslint disable
/* eslint-disable no-param-reassign */
import { clamp, flatten, mapValues } from 'lodash';
import { rgbToHex, rgbToHsv } from 'colorsys';
import chalk from 'chalk';

// 8bit unsigned integer must be less than this value
const uint8Max = 0x100;
// Constant prefix in first byte of sk9822 frame
const prefix = 0xe0;
// Mask for brightness bitfield in first byte of sk9822 frame
const brightnessMask = 0x1f;
// header bytes in sk9822 protocol
const resetFrame = [0x00, 0x00, 0x00, 0x00];
// order of colours in sk9822 frame
const colourOrder = ['b', 'g', 'r'];

export const msNowFloat = () => new Date().getTime();

export const msNow = () => Math.round(msNowFloat());

export const nowFloat = () => msNowFloat() / 1000.0;

export const now = () => Math.round(nowFloat());

/**
 * Callback given to spi transfer which logs errors and ignores data returned
 * @param {Error} e optional error if SPI transfer fails
 */
export const consoleErrorHandler = e => {
  if (e) console.error(e);
  // if (d) console.log(`spi data received: ${d}`);
};

/**
 * Calculate the position of a normalized coordnate from a given image shape
 * @param {Array} shape The shape of the image which this coordinate is being mapped on to
 * @param {Array} coordinate The coordinate, [x, y] where x, y in [0, 1]
 */
export const denormalizeCoordinate = (shape, coordinate) => {
  const minDimension = Math.min(shape[0], shape[1]);
  const maxDimension = Math.max(shape[0], shape[1]);
  const deltaDimension = maxDimension - minDimension;
  if (shape[1] > shape[0]) {
    return [
      clamp(minDimension * coordinate[0], 0, shape[0] - 1),
      clamp(minDimension * coordinate[1] + deltaDimension / 2, 0, shape[1] - 1)
    ];
  }
  return [
    clamp(minDimension * coordinate[0] + deltaDimension / 2, 0, shape[0] - 1),
    clamp(minDimension * coordinate[1], 0, shape[1] - 1)
  ];
};

/**
 * Build a gamma table for a particular value
 * Stolen from https://github.com/ajfisher/node-pixel/blob/9f956c26cd5dbe16f6066eb659cf08350c8b3fea/lib/pixel.js#L401
 */
export const createGammaTable = (steps, gamma) =>
  Array.from({ length: steps }).map((_, i) => Math.floor((i / 255.0) ** gamma * 255 + 0.5));

export const SK9822_GAMMA = createGammaTable(uint8Max, 2.8);

export const RPI_SPIDEVS = {
  0: {
    bus: 0,
    device: 0
  },
  1: {
    bus: 0,
    device: 1
  },
  2: {
    bus: 1,
    device: 0
  },
  3: {
    bus: 1,
    device: 1
  }
};

export const opcPort = 42069;

export const SERVER_CONF = {
  // port used to listen for OPC commands
  opcPort,
  // SPI Clock Speed
  spiClockSpeed: 10e6,
  // SPI Data Mode
  spiMode: 0
};

export const CLIENT_CONF = {};

export const FRESH_CONTEXT = {
  // Frame counter for FPS calculation
  frames: 0,
  // FPS rate calculated
  rate: 0.0,
  // time when script started for FPS calculation
  start: now(),
  // Last time something was printed
  lastPrint: now(),
  // Brightness of all strips on the server
  brightness: 0.1,
};

export const OPC_BODY_FIELDS = ['r', 'g', 'b'];

// eslint-disable-next-line no-bitwise
export const composeOPCHeader = (channel, bytes) => [channel, 0, bytes >> 8, bytes % 0x100];

/**
 * TODO: write OPC composer
 */
export const composeOPCMessage = (channel, colours) =>
  Buffer.from(
    colours.reduce((opcArray, colour) => {
      const pixelBytes = OPC_BODY_FIELDS.map(key => colour[key]);
      opcArray.push(...pixelBytes);
      return opcArray;
    }, composeOPCHeader(channel, colours.length * 3))
  );

export const sk9822GammaCorrect = colour =>
  mapValues(colour, colorVal => SK9822_GAMMA[Math.round(colorVal)]);

/**
 * Given a colorsys RGB objects and a float brightness value from 0 to 1,
 * @return {number[]} the sk9822 frame for this pixel
 */
export const rgb2sk9822 = (colour, brightness = 0.5) => {
  // first byte is a constant 0xE0 + 5 bit brightness value
  const correctedColour = sk9822GammaCorrect(colour);
  return [prefix + Math.round(brightness * brightnessMask)].concat(
    colourOrder.map(key => correctedColour[key] % uint8Max)
  );
};

/**
 * Given a list of colosys RGB objects, and a float brightness value from 0 to 1,
 * @return {number[]} a complete sk9822 message for the strip
 */
export const colours2sk9822 = (colours, brightness) =>
  Array.from(resetFrame).concat(flatten(colours.map(colour => rgb2sk9822(colour, brightness))));
/**
 * Convert a single colorsys object to string
 * @param {colorsys RGB object} colour
 */
export const colourToString = colour => rgbToHex(colour);
export const colourMessage = (hue, msg) => chalk.hsv(hue, 50, 100)(msg);
/**
 * Convert a colours specification to string
 * @param {Array of colorsys RGB objects} colours
 */
export const coloursToString = colours =>
  colours.reduce(
    (accumulator, colour) =>
      accumulator.concat(colourMessage(rgbToHsv(colour).h, colourToString(colour))),
    ''
  );
/**
 * Middleware used to log a colour being processed, and the framerate.
 * @param {object} context
 */
export const colourRateLogger = context => {
  const { start = 0, lastPrint = now(), frames = 0, channelColours } = context;
  context.frames += 1;
  if (now() - lastPrint > 1) {
    context.rate = frames / (now() - start + 1);
    console.log(
      `${coloursToString(Object.values(channelColours)[0].slice(0, 10))} : ${context.rate.toFixed(
        2
      )}`
    );
    context.lastPrint = now();
  }
  return context;
};
