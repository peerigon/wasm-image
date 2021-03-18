import * as wasm from "./wasm";

type ChannelFn = (channel: number) => number;

export class Pixel {
  // TODO: Add constants

  constructor(
    private wasmDynamicImage: wasm.WasmDynamicImage,
    private x: number,
    private y: number
  ) {}

  getChannels = () => {
    return this.wasmDynamicImage.pixelGetChannels(this.x, this.y);
  };

  setChannels = (channels: Array<number> | Uint8Array) => {
    channels =
      channels instanceof Uint8Array ? channels : Uint8Array.from(channels);

    this.wasmDynamicImage.pixelSetChannels(this.x, this.y, channels);
  };

  apply = (channelFn: ChannelFn) => {
    const newChannels = this.getChannels().map((channel) => channelFn(channel));

    this.setChannels(newChannels);
  };

  applyWithAlpha = (colorChannelFn: ChannelFn, alphaChannelFn: ChannelFn) => {
    const channels = this.getChannels();
    const newChannels = channels.map((channel, i) => {
      return i === channels.length - 1
        ? alphaChannelFn(channel)
        : colorChannelFn(channel);
    });

    this.setChannels(newChannels);
  };

  applyWithoutAlpha = (colorChannelFn: ChannelFn) => {
    const channelsWithoutAlpha = this.getChannels().slice(0, -1);
    const newChannels = channelsWithoutAlpha.map((channel) =>
      colorChannelFn(channel)
    );

    this.setChannels(newChannels);
  };

  apply2 = (
    other: Pixel,
    channelFn: (selfChannel: number, otherChannel: number) => number
  ) => {
    const selfChannels = this.getChannels();
    const otherChannels = other.getChannels();
    const newChannels = selfChannels.map((channel, i) =>
      channelFn(channel, otherChannels[i])
    );

    this.setChannels(newChannels);
  };

  invert = () => {
    this.wasmDynamicImage.pixelInvert(this.x, this.y);
  };

  blend = (other: Pixel) => {
    if (this.wasmDynamicImage === other.wasmDynamicImage) {
      this.wasmDynamicImage.pixelBlendSelf(this.x, this.y, other.x, other.y);
    } else {
      this.wasmDynamicImage.pixelBlendOther(
        this.x,
        this.y,
        other.x,
        other.y,
        other.wasmDynamicImage
      );
    }
  };
}
