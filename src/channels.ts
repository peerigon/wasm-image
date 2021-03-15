export type Channels = Array<number> | Uint8Array;

export const channelsToUint8Array = (channels: Channels) =>
  channels instanceof Uint8Array ? channels : Uint8Array.from(channels);
