import {
  Channel,
  Channels,
  ChannelsInput,
  channelsToU16Array,
  channelsToU8Array,
  normalizeChannels,
} from "./channels";
import { ColorType } from "./color";
import { DynamicImage } from "./dynamic-image";
import * as symbols from "./symbols";
import * as wasm from "./wasm";

type ChannelFn = (channel: Channel) => Channel;
type TempPixelSourceIndex = 0 | 1;

const tempPixelSources = new Map<
  ColorType,
  [ImagePixelSource, ImagePixelSource]
>();
const doNothing = () => {};

const getTempImagePixelSource = (
  colorType: ColorType,
  index: TempPixelSourceIndex
) => {
  if (tempPixelSources.has(colorType) === false) {
    tempPixelSources.set(colorType, [
      new ImagePixelSource(
        new DynamicImage({ color: colorType, width: 1, height: 1 }),
        0,
        0
      ),
      new ImagePixelSource(
        new DynamicImage({ color: colorType, width: 1, height: 1 }),
        0,
        0
      ),
    ]);
  }

  return tempPixelSources.get(colorType)![index];
};

type MapOptions =  ChannelFn
| {
    color: ChannelFn;
    alpha?: ChannelFn;
  };


export class Pixel {
  // TODO: Add constants

  #source: PixelSource;

  private constructor(source: PixelSource) {
    this.#source = source;
  }

  static fromChannels = (colorType: ColorType, channels: ChannelsInput) => {
    return new Pixel(
      new IndependentPixelSource(colorType, normalizeChannels(channels))
    );
  };

  static [symbols.pixelConstructor] = (
    dynamicImage: DynamicImage,
    x: number,
    y: number
  ) => new Pixel(new ImagePixelSource(dynamicImage, x, y));

  get x() {
    return this.#source.x;
  }

  get y() {
    return this.#source.y;
  }

  set channels(channels: Channels) {
    this.#source.write(channels);
  }

  get channels(): Channels {
    return this.#source.read();
  }

  get color() {
    return this.#source[symbols.dynamicImage].color;
  }

  map = (
    mapOptions: MapOptions
  ) => {
    const image = this.#source[symbols.dynamicImage];
    const channels = this.channels;
    const hasAlpha = image.color.hasAlpha;
    let mapColor: ChannelFn;
    let mapAlpha: ChannelFn | undefined;

    if (typeof mapOptions === "function") {
      mapColor = mapOptions;
      mapAlpha = mapOptions;
    } else {
      mapColor = mapOptions.color;
      mapAlpha = mapOptions.alpha;
    }

    return channels.map((channel: Channel, index: number) =>
      hasAlpha && index === channels.length - 1
        ? mapAlpha
          ? mapAlpha(channel)
          : channel
        : mapColor(channel)
    );
  };

  apply = (
    mapOptions: MapOptions
  ) => {
    this.channels = this.map(mapOptions);
  };

  map2 = (
    other: Pixel,
    channelFn: (selfChannel: number, otherChannel: number) => number
  ) => {
    const selfChannels = this.channels;
    const otherChannels = other.channels;

    return selfChannels.map((channel: Channel, index: number) =>
      channelFn(channel, otherChannels[index])
    );
  };

  apply2 = (
    other: Pixel,
    channelFn: (selfChannel: number, otherChannel: number) => number
  ) => {
    this.channels = this.map2(other, channelFn);
  };

  invert = () => {
    const [image, bringBack] = this.#borrowWasmDynamicImage(0);

    image.pixelInvert(this.#source.x, this.#source.y);
    bringBack();
  };

  blend = (other: Pixel) => {
    if (
      this.#source.type === PixelSourceType.Image &&
      other.#source.type === PixelSourceType.Image &&
      this.#source[symbols.wasmDynamicImage] ===
        other.#source[symbols.wasmDynamicImage]
    ) {
      this.#source[symbols.wasmDynamicImage].pixelBlendSelf(
        this.#source.x,
        this.#source.y,
        other.#source.x,
        other.#source.y
      );

      return;
    }

    const [thisImage, bringThisImageBack] = this.#borrowWasmDynamicImage(0);
    const [otherImage, bringOtherImageBack] = other.#borrowWasmDynamicImage(1);

    thisImage.pixelBlendOther(
      this.#source.x,
      this.#source.y,
      other.#source.x,
      other.#source.y,
      otherImage
    );

    bringThisImageBack();
    bringOtherImageBack();
  };

  #borrowWasmDynamicImage = (index: TempPixelSourceIndex) => {
    if (this.#source.type === PixelSourceType.Image) {
      return [this.#source[symbols.wasmDynamicImage], doNothing] as const;
    }

    const originalSource = this.#source;
    const tempSource = getTempImagePixelSource(
      originalSource[symbols.dynamicImage].color.type,
      index
    );

    tempSource.write(originalSource.read());
    this.#source = tempSource;

    return [
      tempSource[symbols.wasmDynamicImage],
      () => {
        originalSource.write(tempSource.read());
        this.#source = originalSource;
      },
    ] as const;
  };
}

enum PixelSourceType {
  Image = "Image",
  Independent = "Independent",
}

type PixelSource = ImagePixelSource | IndependentPixelSource;

// This is intentionally not generic because we want to make it as easy as possible
// to switch between pixel depths without affecting the exposed interface.
// Since all TypedArrays share a common interface, this should be possible.
abstract class CommonPixelSource {
  abstract readonly type: PixelSourceType;

  [symbols.dynamicImage]: DynamicImage;

  get [symbols.wasmDynamicImage]() {
    return this[symbols.dynamicImage][symbols.wasmDynamicImage];
  }

  constructor(dynamicImage: DynamicImage, public x: number, public y: number) {
    this[symbols.dynamicImage] = dynamicImage;
  }

  abstract read: () => Channels;

  abstract write: (channels: Channels) => void;
}

class ImagePixelSource extends CommonPixelSource {
  readonly type = PixelSourceType.Image;

  read: CommonPixelSource["read"] = () => {
    switch (this[symbols.wasmDynamicImage].colorType()) {
      case wasm.WasmColorType.L16:
      case wasm.WasmColorType.La16:
      case wasm.WasmColorType.Rgb16:
      case wasm.WasmColorType.Rgba16: {
        return this[symbols.wasmDynamicImage].pixelGetChannels16(
          this.x,
          this.y
        );
      }
      default: {
        return this[symbols.wasmDynamicImage].pixelGetChannels8(this.x, this.y);
      }
    }
  };

  write: CommonPixelSource["write"] = (channels) => {
    switch (this[symbols.wasmDynamicImage].colorType()) {
      case wasm.WasmColorType.L16:
      case wasm.WasmColorType.La16:
      case wasm.WasmColorType.Rgb16:
      case wasm.WasmColorType.Rgba16: {
        this[symbols.wasmDynamicImage].pixelSetChannels16(
          this.x,
          this.y,
          channelsToU16Array(channels)
        );
        break;
      }
      default: {
        this[symbols.wasmDynamicImage].pixelSetChannels8(
          this.x,
          this.y,
          channelsToU8Array(channels)
        );
      }
    }
  };
}

class IndependentPixelSource extends CommonPixelSource {
  readonly type = PixelSourceType.Independent;

  #channels: Channels;

  constructor(colorType: ColorType, channels: Channels) {
    super(getTempImagePixelSource(colorType, 0)[symbols.dynamicImage], 0, 0);
    this.#channels = channels;
  }

  read: CommonPixelSource["read"] = () => this.#channels;

  write: CommonPixelSource["write"] = (channels) => {
    const length = Math.min(this.#channels.length, channels.length);

    this.#channels.set(channels.slice(0, length));
  };
}
