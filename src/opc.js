import { uint8Max } from './bitwise'

export const opcPort = 42069;
export const OPC_BODY_FIELDS = ['r', 'g', 'b'];

// eslint-disable-next-line no-bitwise
export const composeOPCHeader = (channel, bytes) => [channel, 0, bytes >> 8, bytes % uint8Max];

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
