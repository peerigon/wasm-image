import { Channels, initializeChannels, normalizeChannels } from "./channels";
import { DynamicImage } from "./dynamic-image";
import { pixelConstructor, wasmDynamicImage } from "./symbols";
import * as wasm from "./wasm";

type ChannelFn = (channel: number) => number;
type TempPixelSourceIndex = 0 | 1;

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

  static fromChannels = (channels: Channels) => {
    const normalizedChannels = initializeChannels(channels);

    return new Pixel(new IndependentPixelSource(normalizedChannels));
  };

  static [pixelConstructor] = (
    dynamicImage: DynamicImage,
    x: number,
    y: number
  ) => new Pixel(new ImagePixelSource(dynamicImage, x, y));

  getChannels = () => {
    const channels = this.source.read();
    const dataView = new DataView(channels.buffer, channels.byteOffset, channels.byteLength);
    const length = channels.byteLength / Uint16Array.BYTES_PER_ELEMENT;
    const uint16Array = new Uint16Array(length);

    for (let i = 0; i < length; i++) {
      uint16Array[i] = dataView.getUint16(i * Uint16Array.BYTES_PER_ELEMENT, true);
    }

    console.log(channels, uint16Array);

    return channels;
  };

  setChannels = (channels: Channels) => {
    this.source.write(normalizeChannels(channels));
  };

  map = (channelFn: ChannelFn) => {
    const newChannels = this.getChannels().map((channel) => channelFn(channel));

    return new Pixel(new IndependentPixelSource(newChannels));
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

type PixelSourceCommon = {
  x: number;
  y: number;
  read(): Uint8Array;
  write(channels: Uint8Array): void;
};

type PixelSource = ImagePixelSource | IndependentPixelSource;

class ImagePixelSource implements PixelSourceCommon {
  readonly type = PixelSourceType.Image;

  [wasmDynamicImage]: wasm.WasmDynamicImage;

  constructor(dynamicImage: DynamicImage, public x: number, public y: number) {
    this[wasmDynamicImage] = dynamicImage[wasmDynamicImage];
  }

  read = () => this[wasmDynamicImage].pixelGetChannels(this.x, this.y);

  write = (channels: Uint8Array) =>
    this[wasmDynamicImage].pixelSetChannels(this.x, this.y, channels);
}

class IndependentPixelSource implements PixelSourceCommon {
  readonly type = PixelSourceType.Independent;
  x = 0;
  y = 0;

  constructor(private channels: Uint8Array) {}

  read = () => this.channels;

  write = (channels: Uint8Array) => {
    const length = Math.min(this.channels.length, channels.length);

    this.channels.set(channels.slice(0, length));
  };
}
