"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGammaTable = void 0;

/**
 * Build a gamma table for a particular value
 * Stolen from https://github.com/ajfisher/node-pixel/blob/9f956c26cd5dbe16f6066eb659cf08350c8b3fea/lib/pixel.js#L401
 */
const createGammaTable = (steps, gamma) => Array.from({
  length: steps
}).map((_, i) => Math.floor((i / 255.0) ** gamma * 255 + 0.5));

exports.createGammaTable = createGammaTable;