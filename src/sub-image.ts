import { Bounds } from "./bounds";
import { DynamicImage } from "./dynamic-image";
import * as symbols from "./symbols";
import { Pixel } from "./pixel";
import { Position } from "./position";

export class SubImage implements Bounds {
  #image: DynamicImage;

  x: number;

  y: number;

  width: number;

  height: number;

  constructor(image: DynamicImage, { x, y, width, height }: Bounds) {
    this.#image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // Not implemented since you can just change x, y, width and height directly
  // changeBounds = (
  //   x: number,
  //   y: number,
  //   width: number,
  //   height: number
  // ) => {}

  getPixel = ({ x, y }: Position) =>
    Pixel[symbols.pixelConstructor](this.#image, this.x + x, this.y + y);

  putPixel = (position: Position, pixel: Pixel) => {
    this.getPixel(position).channels = pixel.channels;
  };

  subImage = ({ x, y, width, height }: Bounds) => {
    return new SubImage(this.#image, {
      x: this.x + x,
      y: this.y + y,
      width,
      height,
    });
  };
}
