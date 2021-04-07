// TODO: Hint https://stackoverflow.com/questions/51544240/how-can-i-free-memory-allocated-by-rust-code-exposed-in-webassembly
// TODO: Rename DynamicImage to Image?
// TODO: Decrease file size
// TODO: Throw on negative x, y

import * as wasm from "./wasm";
import { FilterType, ImageFormat } from "./lib";
import { Dimensions } from "./dimensions";
import { $wasmDynamicImage } from "./symbols";
import { Color, ColorType } from "./color";
import { GenericImage } from "./generic-image";

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

const createWasmDynamicImage = ({ width, height, color = ColorType.Rgba8 }: Dimensions & { color?: ColorType }) => {
  return new wasm.WasmDynamicImage(color, width, height);
};

const loadWasmDynamicImageFromMemory = ({ bytes, format }: { bytes: Uint8Array; format?: ImageFormat }) => {
  return format === undefined
  ? wasm.loadFromMemory(bytes)
  : wasm.loadFromMemoryWithFormat(bytes, format);
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

export class DynamicImage extends GenericImage {
  [$wasmDynamicImage]: wasm.WasmDynamicImage;

  #color: Color;

  get color() {
    return this.#color;
  }

  constructor(
    options:
      | Parameters<typeof loadWasmDynamicImageFromMemory>[0]
      | Parameters<typeof createWasmDynamicImage>[0]
  ) {
    super("bytes" in options ? loadWasmDynamicImageFromMemory(options) : createWasmDynamicImage(options));
    this.#color = new Color(this[$wasmDynamicImage]);
  }

  toBytes = (outputFormatOptions?: OutputFormatOptions) => {
    if (outputFormatOptions === undefined) {
      return this[$wasmDynamicImage].toBytes();
    }

    const format = mapOutputFormatNameToWasmImageOutputFormat(
      outputFormatOptions.format
    );

    switch (outputFormatOptions.format) {
      case OutputFormat.Jpeg: {
        const { quality = 100 } = outputFormatOptions;

        return this[$wasmDynamicImage].toFormatJpeg(quality);
      }
      default: {
        return this[$wasmDynamicImage].toFormat(format);
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
    this[$wasmDynamicImage].crop(x, y, width, height);
  };

  grayscale = () => {
    this[$wasmDynamicImage].grayscale();
  };

  invert = () => {
    this[$wasmDynamicImage].invert();
  };

  resize = ({ width, height, filter = FilterType.Lanczos3 }: ResizeOptions) => {
    if (width !== undefined && height !== undefined) {
      this[$wasmDynamicImage].resizeExact(width, height, filter);
    } else {
      this[$wasmDynamicImage].resize(
        width ?? U32_MAX,
        height ?? U32_MAX,
        filter
      );
    }
  };

  thumbnail = ({ width, height }: ThumbnailOptions) => {
    if (width !== undefined && height !== undefined) {
      this[$wasmDynamicImage].thumbnailExact(width, height);
    } else {
      this[$wasmDynamicImage].thumbnail(width ?? U32_MAX, height ?? U32_MAX);
    }
  };

  blur = (sigma: number) => {
    this[$wasmDynamicImage].blur(sigma);
  };

  unsharpen = (sigma: number, threshold: number) => {
    this[$wasmDynamicImage].unsharpen(sigma, threshold);
  };

  filter3x3 = (kernel: Float32Array) => {
    this[$wasmDynamicImage].filter3x3(kernel);
  };

  adjustContrast = (contrast: number) => {
    this[$wasmDynamicImage].adjustContrast(contrast);
  };

  brighten = (value: number) => {
    this[$wasmDynamicImage].brighten(value);
  };

  huerotate = (degree: number) => {
    this[$wasmDynamicImage].huerotate(degree);
  };

  flipv = () => {
    this[$wasmDynamicImage].flipv();
  };

  fliph = () => {
    this[$wasmDynamicImage].fliph();
  };

  rotate90 = () => {
    this[$wasmDynamicImage].rotate90();
  };

  rotate180 = () => {
    this[$wasmDynamicImage].rotate180();
  };

  rotate270 = () => {
    this[$wasmDynamicImage].rotate270();
  };

  dispose = () => {
    this[$wasmDynamicImage].free();
  };
}
