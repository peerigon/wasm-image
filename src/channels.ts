export type Channels = Array<number> | Uint8Array;

export const normalizeChannels = (channels: Channels) => channels instanceof Uint8Array ? channels : Uint8Array.from(channels);

export const initializeChannels = (channels: Channels) => {
  if (channels instanceof Uint8Array && channels.length === 4) {
    return channels;
  }

  const normalizedChannels = new Uint8Array(4);

  normalizedChannels.set(channels.slice(0, 4));

  return normalizedChannels;
}