import * as wasm from "./wasm";
import { Position } from "./position";

type ChannelFn = (channel: number) => number;

export class Pixel implements Position {
  // TODO: Add constants
  constructor(
    private readonly instance: wasm.WasmDynamicImage,
    public readonly x: number,
    public readonly y: number
  ) {}

  getChannels = () => {
    return this.instance.pixelGetChannels(this.x, this.y);
  };

  setChannels = (channels: Array<number> | Uint8Array) => {
    channels = channels instanceof Uint8Array ? channels : Uint8Array.from(channels);

    this.instance.pixelSetChannels(this.x, this.y, channels);
  };

  apply = (channelFn: ChannelFn) => {
    const newChannels = this.getChannels().map(channelFn);

    this.setChannels(newChannels);
  };

  applyWithAlpha = (colorChannelFn: ChannelFn, alphaChannelFn: ChannelFn) => {
    const channels = this.getChannels();
    const newChannels = this.getChannels().map((channel, i) => {
      return i === channels.length - 1 ? alphaChannelFn(channel) : colorChannelFn(channel);
    });

    this.setChannels(newChannels);
  };
}
