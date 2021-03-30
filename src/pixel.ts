import { Channel, Channels, ChannelsInput, channelsToU16Array, channelsToU8Array, normalizeChannels } from "./channels";
import { DynamicImage } from "./dynamic-image";
import { pixelConstructor, wasmDynamicImage } from "./symbols";
import * as wasm from "./wasm";



type ChannelFn = (channel: Channel) => Channel;
type TempPixelSourceIndex = 0 | 1;

// TODO: Enable PixelDepth.Bit16
let tempPixelSources: undefined | [ImagePixelSource, ImagePixelSource];
const doNothing = () => {};

// const getTemporaryPixelSource = (index: number) => {
//   if (index >= temporaryPixelSources.length) {
//     temporaryPixelSources.length = index + 1;
//   }

//   const dummyPixelSource =
//     temporaryPixelSources[index] ??
//     (temporaryPixelSources[index] = new ImagePixelSource(dummyImage, 0, 0));

//   return dummyPixelSource;
// };

const getTempPixelSource = (index: TempPixelSourceIndex) => {
  if (tempPixelSources === undefined) {
    tempPixelSources = [
      new ImagePixelSource(new DynamicImage({ width: 1, height: 1 }), 0, 0),
      new ImagePixelSource(new DynamicImage({ width: 1, height: 1 }), 0, 0),
    ];
  }

  return tempPixelSources[index];
};

export class Pixel {
  // TODO: Add constants

  private constructor(private source: PixelSource) {}

  private get x() {
    return this.source.x;
  }

  private get y() {
    return this.source.y;
  }

  static fromChannels = (channels: ChannelsInput) => {
    return new Pixel(new IndependentPixelSource(normalizeChannels(channels)));
  };

  static [pixelConstructor] = (
    dynamicImage: DynamicImage,
    x: number,
    y: number
  ) => new Pixel(new ImagePixelSource(dynamicImage, x, y));

  getChannels = () => {
    return this.source.read();
  };

  setChannels = (channels: ChannelsInput) => {
    this.source.write(channels);
  };

  map = (channelFn: ChannelFn) => {
    const newChannels = this.getChannels().map((channel: Channel) => channelFn(channel));

    return new Pixel(new IndependentPixelSource(newChannels));
  };

  apply = (channelFn: ChannelFn) => {
    const newChannels = this.getChannels().map((channel: Channel) => channelFn(channel));

    this.setChannels(newChannels);
  };

  applyWithAlpha = (colorChannelFn: ChannelFn, alphaChannelFn: ChannelFn) => {
    const channels = this.getChannels();
    const newChannels = channels.map((channel: Channel, index: number) => {
      return index === channels.length - 1
        ? alphaChannelFn(channel)
        : colorChannelFn(channel);
    });

    this.setChannels(newChannels);
  };

  applyWithoutAlpha = (colorChannelFn: ChannelFn) => {
    const channelsWithoutAlpha = this.getChannels().slice(0, -1);
    const newChannels = channelsWithoutAlpha.map((channel: Channel) =>
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
    const newChannels = selfChannels.map((channel: Channel, index: number) =>
      channelFn(channel, otherChannels[index])
    );

    this.setChannels(newChannels);
  };

  invert = () => {
    const [image, bringBack] = this.borrowWasmDynamicImage(0);

    image.pixelInvert(this.x, this.y);
    bringBack();
  };

  blend = (other: Pixel) => {
    if (
      this.source.type === PixelSourceType.Image &&
      other.source.type === PixelSourceType.Image &&
      this.source[wasmDynamicImage] === other.source[wasmDynamicImage]
    ) {
      this.source[wasmDynamicImage].pixelBlendSelf(
        this.x,
        this.y,
        other.x,
        other.y
      );

      return;
    }

    const [thisImage, bringThisImageBack] = this.borrowWasmDynamicImage(0);
    const [otherImage, bringOtherImageBack] = other.borrowWasmDynamicImage(1);

    thisImage.pixelBlendOther(this.x, this.y, other.x, other.y, otherImage);

    bringThisImageBack();
    bringOtherImageBack();
  };

  private borrowWasmDynamicImage = (index: TempPixelSourceIndex) => {
    if (this.source.type === PixelSourceType.Image) {
      return [this.source[wasmDynamicImage], doNothing] as const;
    }

    const originalSource = this.source;
    const tempSource = getTempPixelSource(index);

    tempSource.write(originalSource.read());
    this.source = tempSource;

    return [
      tempSource[wasmDynamicImage],
      () => {
        originalSource.write(tempSource.read());
        this.source = originalSource;
      },
    ] as const;
  };
}

enum PixelSourceType {
  Image = "Image",
  Independent = "Independent",
}

// This is intentionally not generic because we want to make it as easy as possible
// to switch between pixel depths without affecting the exposed interface.
// Since all TypedArrays share a common interface, this should be possible.
type PixelSourceCommon = {
  x: number;
  y: number;
  read(): Channels;
  write(channels: ChannelsInput): void;
};

type PixelSource = ImagePixelSource | IndependentPixelSource;

class ImagePixelSource implements PixelSourceCommon {
  readonly type = PixelSourceType.Image;

  [wasmDynamicImage]: wasm.WasmDynamicImage;

  constructor(dynamicImage: DynamicImage, public x: number, public y: number) {
    this[wasmDynamicImage] = dynamicImage[wasmDynamicImage];
  }

  read: PixelSourceCommon["read"] = () => {
    switch (this[wasmDynamicImage].color()) {
      case wasm.WasmColorType.L16:
      case wasm.WasmColorType.La16:
      case wasm.WasmColorType.Rgb16:
      case wasm.WasmColorType.Rgba16: {
        return this[wasmDynamicImage].pixelGetChannels16(this.x, this.y);
      }
      default: {
        return this[wasmDynamicImage].pixelGetChannels8(this.x, this.y);
      }
    }
  };

  write: PixelSourceCommon["write"] = (channels) => {
    switch (this[wasmDynamicImage].color()) {
      case wasm.WasmColorType.L16:
      case wasm.WasmColorType.La16:
      case wasm.WasmColorType.Rgb16:
      case wasm.WasmColorType.Rgba16: {
        this[wasmDynamicImage].pixelSetChannels16(this.x, this.y, channelsToU16Array(channels));
        break;
      }
      default: {
        this[wasmDynamicImage].pixelSetChannels8(this.x, this.y, channelsToU8Array(channels));
      }
    }
  }
}

class IndependentPixelSource implements PixelSourceCommon {
  readonly type = PixelSourceType.Independent;
  x = 0;
  y = 0;

  constructor(private channels: Channels) {}

  read: PixelSourceCommon["read"] = () => this.channels;

  write: PixelSourceCommon["write"] = (channels) => {
    const length = Math.min(this.channels.length, channels.length);

    this.channels.set(channels.slice(0, length));
  };
}
