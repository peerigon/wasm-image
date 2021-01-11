/* eslint-disable import/extensions */
import * as pkg from "../pkg";
/* eslint-enable import/extensions */
import { FilterType, ImageFormat } from "./lib";

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
): pkg.WasmImageOutputFormat => {
  const format = pkg.WasmImageOutputFormat[formatName];

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
  protected instance: pkg.WasmDynamicImage;

  constructor({ bytes, format }: { bytes: Uint8Array; format?: ImageFormat }) {
    this.instance =
      format === undefined
        ? pkg.loadFromMemory(bytes)
        : pkg.loadFromMemoryWithFormat(bytes, format);
  }

  toBytes = (outputFormatOptions?: OutputFormatOptions) => {
    if (outputFormatOptions === undefined) {
      return this.instance.toBytes();
    }

    const format = mapOutputFormatNameToWasmImageOutputFormat(
      outputFormatOptions.format
    );

    switch (outputFormatOptions.format) {
      case OutputFormat.Jpeg: {
        const { quality = 100 } = outputFormatOptions;

        return this.instance.toFormatJpeg(quality);
      }
      default: {
        return this.instance.toFormat(format);
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
    this.instance.crop(x, y, width, height);
  };

  color = () => {
    return this.instance.color();
  };

  grayscale = () => {
    this.instance.grayscale();
  };

  invert = () => {
    this.instance.invert();
  };

  resize = ({ width, height, filter = FilterType.Lanczos3 }: ResizeOptions) => {
    if (width !== undefined && height !== undefined) {
      this.instance.resizeExact(width, height, filter);
    } else {
      this.instance.resize(width ?? U32_MAX, height ?? U32_MAX, filter);
    }
  };

  thumbnail = ({ width, height }: ThumbnailOptions) => {
    if (width !== undefined && height !== undefined) {
      this.instance.thumbnailExact(width, height);
    } else {
      this.instance.thumbnail(width ?? U32_MAX, height ?? U32_MAX);
    }
  };

  blur = (sigma: number) => {
    this.instance.blur(sigma);
  };

  unsharpen = (sigma: number, threshold: number) => {
    this.instance.unsharpen(sigma, threshold);
  };

  filter3x3 = (kernel: Float32Array) => {
    this.instance.filter3x3(kernel);
  };

  adjustContrast = (contrast: number) => {
    this.instance.adjustContrast(contrast);
  };

  brighten = (value: number) => {
    this.instance.brighten(value);
  };

  huerotate = (degree: number) => {
    this.instance.huerotate(degree);
  };

  flipv = () => {
    this.instance.flipv();
  };

  fliph = () => {
    this.instance.fliph();
  };

  rotate90 = () => {
    this.instance.rotate90();
  };

  rotate180 = () => {
    this.instance.rotate180();
  };

  rotate270 = () => {
    this.instance.rotate270();
  };

  dispose = () => {
    this.instance.free();
  };
}
