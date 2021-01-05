import * as pkg from "../pkg";
import { WasmImageFormat as ImageFormat } from "../pkg";

export { ImageFormat };

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
       * 100 = best quality
       **/
      quality: number;
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
        return this.instance.toFormatJpeg(outputFormatOptions.quality);
      }
      default: {
        return this.instance.toFormat(format);
      }
    }
  };

  grayscale = () => {
    this.instance.grayscale();
  };

  dispose = () => {
    this.instance.dispose();
    this.instance.free();
  };
}
