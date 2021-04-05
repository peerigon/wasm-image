import { Bounds } from "./bounds";
import { DynamicImage } from "./dynamic-image";
import { GenericImage } from "./generic-image";
import { Position } from "./position";

export class SubImage implements Bounds, Omit<GenericImage, "#image"> {
  #image: DynamicImage;

  #genericImage: GenericImage;

  x: number;

  y: number;

  width: number;

  height: number;

  constructor(image: DynamicImage, { x, y, width, height }: Bounds) {
    this.#image = image;
    this.#genericImage = new GenericImage(image);
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

  #getOffsetPosition = ({ x, y }: Position): Position => ({ x: this.x + x, y: this.y + y })

  getPixel: GenericImage["getPixel"] = (position) =>
    this.#genericImage.getPixel(this.#getOffsetPosition(position));

  putPixel: GenericImage["putPixel"] = (position, pixel) =>
    this.#genericImage.putPixel(this.#getOffsetPosition(position), pixel);

  copyFrom: GenericImage["copyFrom"] = () => {
    // TODO: Implement copyFrom
  };

  copyWithin: GenericImage["copyWithin"] = () => {
    // TODO: Implement copyWithin
  };

  subImage: GenericImage["subImage"] = ({ x, y, ...bounds }) => this.#genericImage.subImage({
    ...bounds,
    ...this.#getOffsetPosition({ x, y }),
  });
}
