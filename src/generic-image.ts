import { Bounds } from "./bounds";
import { DynamicImage } from "./dynamic-image";
import { GenericImageView } from "./generic-image-view";
import { Pixel } from "./pixel";
import { Position } from "./position";
import { $toGlobalPosition, $viewBounds, $wasmDynamicImage } from "./symbols";
import { WasmDynamicImage } from "./wasm";

export class GenericImage extends GenericImageView {

  constructor(wasmDynamicImage: WasmDynamicImage, viewBounds?: Bounds) {
    super(wasmDynamicImage, viewBounds);
    this[$wasmDynamicImage] = wasmDynamicImage;
  }

  putPixel = (position: Position, pixel: Pixel) => {
    this.getPixel(position).channels = pixel.channels;
  };

  copyFrom = () => {
    // TODO: Implement copyFrom
  };

  copyWithin = () => {
    // TODO: Implement copyWithin
  };

  subImage = (bounds: Bounds) => {
    const { width, height } = bounds;
    const { x, y } = this[$toGlobalPosition](bounds);

    return new GenericSubImage(this[$wasmDynamicImage], {
      x,
      y,
      width,
      height,
    });
  };
}

class GenericSubImage extends GenericImage {
  set bounds(bounds: Bounds) {
    this[$viewBounds] = bounds;
  }

  toImage = () => {
    // TODO: Implement
  }
}

export class SubImage extends GenericSubImage {
  constructor(dynamicImage: DynamicImage, bounds: Bounds) {
    super(dynamicImage[$wasmDynamicImage], bounds);
  }
}