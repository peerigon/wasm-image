import { Bounds } from "./bounds";
import { DynamicImage } from "./dynamic-image";
import { Pixel } from "./pixel";
import { Position } from "./position";
import { SubImage } from "./sub-image";
import * as symbols from "./symbols";

export class GenericImage {
  #image;

  constructor(image: DynamicImage) {
    this.#image = image;
  }

  getPixel = ({ x, y }: Position) =>
    Pixel[symbols.pixelConstructor](this.#image, x, y);

  putPixel = (position: Position, pixel: Pixel) => {
    this.getPixel(position).channels = pixel.channels;
  };

  copyFrom = () => {
    // TODO: Implement copyFrom
  };

  copyWithin = () => {
    // TODO: Implement copyWithin
  };

  subImage = ({ x, y, width, height }: Bounds) => {
    return new SubImage(this.#image, {
      x,
      y,
      width,
      height,
    });
  };
}
