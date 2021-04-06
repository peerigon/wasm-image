import { WasmDynamicImage } from "../pkg/wasm_image";
import { Bounds } from "./bounds";
import { Dimensions } from "./dimensions";
import { Pixel } from "./pixel";
import { Position } from "./position";
import { $pixelConstructor, $toGlobalPosition, $viewBounds, $wasmDynamicImage } from "./symbols";

export class GenericImageView {
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
  }

  getPixel = (position: Position) => {
    const { x, y } = this[$toGlobalPosition](position);

    return Pixel[$pixelConstructor](this[$wasmDynamicImage], x, y);
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
    const { [$viewBounds]: viewBounds } = this;
    const { width, height } = this.dimensions;
    let x = viewBounds?.x ?? 0;
    let y = viewBounds?.y ?? 0;

    while (x < width && y < height) {
      yield Pixel[$pixelConstructor](this[$wasmDynamicImage], x, y);

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
}
