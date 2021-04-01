// TODO: Implement methods from GenericImage-Trait https://docs.rs/image/0.23.12/image/trait.GenericImage.html
// TODO: Implement methods from GenericImageView-Trait https://docs.rs/image/0.23.12/image/trait.GenericImageView.html
// TODO: Implement methods from SubImage-Trait https://docs.rs/image/0.23.12/image/struct.SubImage.html
// TODO: Hint https://stackoverflow.com/questions/51544240/how-can-i-free-memory-allocated-by-rust-code-exposed-in-webassembly
// TODO: Use getter and setters?
// TODO: Rename DynamicImage to Image?
// TODO: Decrease file size

import * as wasm from "./wasm";
import { FilterType, ImageFormat } from "./lib";
import { Dimensions } from "./dimensions";
import { Bounds } from "./bounds";
import { Position } from "./position";
import { Pixel } from "./pixel";
import { pixelConstructor, wasmDynamicImage } from "./symbols";
import { Color } from "./color";

/**
 * The max value that can be represented with unsigned 32 bit.
 * See https://doc.rust-lang.org/std/primitive.u32.html
 */
const U32_MAX = 4294967295;

export enum OutputFormat {
  Png = "Png",
  Jpeg = "Jpeg",
  Gif = "Gif",
  Ico = "Ico",
  Bmp = "Bmp",
  Avif = "Avif",
}

const mapOutputFormatNameToWasmImageOutputFormat = (
  formatName: OutputFormat
): wasm.WasmImageOutputFormat => {
  const format = wasm.WasmImageOutputFormat[formatName];

  if (typeof format !== "number") {
    throw new TypeError(`Unknown format ${formatName}`);
  }

  return format;
};

export type OutputFormatOptions =
  | {
      format: OutputFormat.Png;
    }
  | {
      format: OutputFormat.Jpeg;
      /**
       * The image quality in percent from 0 to 100:
       * 0 = worst quality
       * 100 = best quality (default)
       **/
      quality?: number;
    }
  | {
      format: OutputFormat.Gif;
    }
  | {
      format: OutputFormat.Ico;
    }
  | {
      format: OutputFormat.Bmp;
    }
  | {
      format: OutputFormat.Avif;
    };

export type ResizeOptions = {
  filter?: FilterType;
} & (
  | {
      width: number;
      height?: number;
    }
  | {
      width?: number;
      height: number;
    }
);

export type ThumbnailOptions =
  | {
      width: number;
      height?: number;
    }
  | {
      width?: number;
      height: number;
    };

export class DynamicImage {
  [wasmDynamicImage]: wasm.WasmDynamicImage;

  #color: Color;

  constructor(options: { bytes: Uint8Array; format?: ImageFormat } | Dimensions) {
    if ("bytes" in options) {
      const { bytes, format } = options;

      this[wasmDynamicImage] =
        format === undefined
          ? wasm.loadFromMemory(bytes)
          : wasm.loadFromMemoryWithFormat(bytes, format);
    } else {
      const { width, height } = options;

      this[wasmDynamicImage] = wasm.WasmDynamicImage.newRgba8(width, height);
    }
    this.#color = new Color(this);
  }

  get color() {
    return this.#color;
  };

  toBytes = (outputFormatOptions?: OutputFormatOptions) => {
    if (outputFormatOptions === undefined) {
      return this[wasmDynamicImage].toBytes();
    }

    const format = mapOutputFormatNameToWasmImageOutputFormat(
      outputFormatOptions.format
    );

    switch (outputFormatOptions.format) {
      case OutputFormat.Jpeg: {
        const { quality = 100 } = outputFormatOptions;

        return this[wasmDynamicImage].toFormatJpeg(quality);
      }
      default: {
        return this[wasmDynamicImage].toFormat(format);
      }
    }
  };

  crop = ({
    x,
    y,
    width,
    height,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    this[wasmDynamicImage].crop(x, y, width, height);
  };

  grayscale = () => {
    this[wasmDynamicImage].grayscale();
  };

  invert = () => {
    this[wasmDynamicImage].invert();
  };

  resize = ({ width, height, filter = FilterType.Lanczos3 }: ResizeOptions) => {
    if (width !== undefined && height !== undefined) {
      this[wasmDynamicImage].resizeExact(width, height, filter);
    } else {
      this[wasmDynamicImage].resize(width ?? U32_MAX, height ?? U32_MAX, filter);
    }
  };

  thumbnail = ({ width, height }: ThumbnailOptions) => {
    if (width !== undefined && height !== undefined) {
      this[wasmDynamicImage].thumbnailExact(width, height);
    } else {
      this[wasmDynamicImage].thumbnail(width ?? U32_MAX, height ?? U32_MAX);
    }
  };

  blur = (sigma: number) => {
    this[wasmDynamicImage].blur(sigma);
  };

  unsharpen = (sigma: number, threshold: number) => {
    this[wasmDynamicImage].unsharpen(sigma, threshold);
  };

  filter3x3 = (kernel: Float32Array) => {
    this[wasmDynamicImage].filter3x3(kernel);
  };

  adjustContrast = (contrast: number) => {
    this[wasmDynamicImage].adjustContrast(contrast);
  };

  brighten = (value: number) => {
    this[wasmDynamicImage].brighten(value);
  };

  huerotate = (degree: number) => {
    this[wasmDynamicImage].huerotate(degree);
  };

  flipv = () => {
    this[wasmDynamicImage].flipv();
  };

  fliph = () => {
    this[wasmDynamicImage].fliph();
  };

  rotate90 = () => {
    this[wasmDynamicImage].rotate90();
  };

  rotate180 = () => {
    this[wasmDynamicImage].rotate180();
  };

  rotate270 = () => {
    this[wasmDynamicImage].rotate270();
  };

  get dimensions(): Dimensions {
    const [width, height] = this[wasmDynamicImage].dimensions();

    return { width, height };
  };

  get width() {
    return this[wasmDynamicImage].width();
  };

  get height() {
    return this[wasmDynamicImage].height();
  };

  get bounds(): Bounds {
    const [x, y, width, height] = this[wasmDynamicImage].bounds();

    return { x, y, width, height };
  };

  inBounds = ({ x, y }: Position) => {
    return this[wasmDynamicImage].inBounds(x, y);
  };

  getPixel = ({ x, y }: Position) => {
    return Pixel[pixelConstructor](this, x, y);
  };

  *pixels() {
    const { width, height } = this.dimensions;
    let x = 0;
    let y = 0;

    while (x < width && y < height) {
      yield Pixel[pixelConstructor](this, x, y);

      x++;

      if (x >= width) {
        x = 0;
        y++;
      }
    }
  }

  view = () => {
    // TODO: Add when SubImage-Trait has been implemented
  };

  dispose = () => {
    this[wasmDynamicImage].free();
  };
}
