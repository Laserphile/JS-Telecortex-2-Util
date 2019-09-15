// TODO remove this eslint disable
/* eslint-disable no-param-reassign */
import { rgbToHex, rgbToHsv } from 'colorsys';
import chalk from 'chalk';

export { opcPort, OPC_BODY_FIELDS, composeOPCHeader, composeOPCMessage } from './opc'
export { uint8Max, uint8Bits } from './bitwise';

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

/**
 * Convert a single colorsys object to string
 * @param {colorsys RGB object} colour
 */
export const colourToString = rgbToHex;
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

export const toBeCloseToBytes = (received, argument) => {
  // console.log(received);
  const pass = received.length === argument.length;
  if (!pass) {
    return {
      message: () =>
        `expected ${JSON.stringify(received)} to be the same length as ${JSON.stringify(
          argument
        )}`,
      pass
    };
  }
  received.forEach((vector, index) => {
    expect(vector.length).toEqual(argument[index].length);
  });
  return {
    message: () =>
      `expected ${JSON.stringify(received)} to be close to matrix ${JSON.stringify(argument)}`,
    pass
  };
}
