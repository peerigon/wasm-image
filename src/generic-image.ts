import { Bounds } from "./bounds";
import { Dimensions } from "./dimensions";
import { DynamicImage } from "./dynamic-image";
import { Pixel } from "./pixel";
import { Position } from "./position";
import {
  $pixelConstructor,
  $toGlobalPosition,
  $wasmDynamicImage,
} from "./symbols";
import { WasmDynamicImage } from "./wasm";

const $viewBounds = Symbol("viewBounds");

export class GenericImage {
  [$wasmDynamicImage]: WasmDynamicImage;

  [$viewBounds]: Bounds | undefined;

  constructor(wasmDynamicImage: WasmDynamicImage, viewBounds?: Bounds) {
    this[$wasmDynamicImage] = wasmDynamicImage;
    this[$viewBounds] = viewBounds;
  }

  get dimensions(): Dimensions {
    const { [$viewBounds]: viewBounds } = this;
    let width: number;
    let height: number;

    if (viewBounds) {
      width = viewBounds.width;
      height = viewBounds.width;
    } else {
      [width, height] = this[$wasmDynamicImage].dimensions();
    }

    return { width, height };
  }

  get bounds(): Bounds {
    const { [$viewBounds]: viewBounds } = this;
    let x: number;
    let y: number;
    let width: number;
    let height: number;

    if (viewBounds) {
      x = viewBounds.x;
      y = viewBounds.y;
      width = viewBounds.width;
      height = viewBounds.width;
    } else {
      [x, y, width, height] = this[$wasmDynamicImage].bounds();
    }

    return { x, y, width, height };
  }

  [$toGlobalPosition] = (position: Position): Position => {
    const { [$viewBounds]: viewBounds } = this;

    if (viewBounds) {
      return { x: viewBounds.x + position.x, y: viewBounds.y + position.y };
    }

    return position;
  };

  getPixel = (position: Position) => {
    const { x, y } = this[$toGlobalPosition](position);

    return Pixel[$pixelConstructor](this[$wasmDynamicImage], x, y);
  };

  putPixel = (position: Position, pixel: Pixel) => {
    this.getPixel(position).channels = pixel.channels;
  };

  get width() {
    return this[$wasmDynamicImage].width();
  }

  get height() {
    return this[$wasmDynamicImage].height();
  }

  inBounds = (position: Position) => {
    const { x, y } = this[$toGlobalPosition](position);

    return this[$wasmDynamicImage].inBounds(x, y);
  };

  *pixels() {
    const { width, height } = this.dimensions;
    let x = 0;
    let y = 0;

    while (x < width && y < height) {
      yield this.getPixel({ x, y });

      x++;

      if (x >= width) {
        x = 0;
        y++;
      }
    }
  }

  copyFrom = () => {
    // TODO: Implement copyFrom
  };

  copyWithin = (source: Bounds, target: Position) => {
    const { x: sourceX, y: sourceY } = this[$toGlobalPosition](source);
    const { x: targetX, y: targetY } = this[$toGlobalPosition](target);

    return this[$wasmDynamicImage].genericImageCopyWithin(
      sourceX,
      sourceY,
      source.width,
      source.height,
      targetX,
      targetY
    );
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
  };
}

export class SubImage extends GenericSubImage {
  constructor(dynamicImage: DynamicImage, bounds: Bounds) {
    super(dynamicImage[$wasmDynamicImage], bounds);
  }
}
