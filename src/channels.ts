export enum PixelDepth {
  Bit8 = "Bit8",
  Bit16 = "Bit16",
}

export type PixelDepthToChannels = {
  [PixelDepth.Bit8]: Uint8Array;
  [PixelDepth.Bit16]: Uint16Array;
};
export type Channels = PixelDepthToChannels[keyof PixelDepthToChannels];

export type Channel = Channels[number];

export type ChannelsInput = Channels | Uint8ClampedArray | Array<number>;

export const normalizeChannels = (channels: ChannelsInput) =>
  channels instanceof Uint8Array
    ? channels
    : channels instanceof Uint16Array
    ? channels
    : Uint16Array.from(channels);

export const channelsToU16Array = (channels: ChannelsInput) =>
  channels instanceof Uint16Array ? channels : Uint16Array.from(channels);

export const channelsToU8Array = (channels: ChannelsInput) =>
  channels instanceof Uint8Array ? channels : Uint8Array.from(channels);
