import * as wasm from "./wasm";
import { Position } from "./position";

export class Pixel implements Position {
  constructor(
    private readonly instance: wasm.WasmDynamicImage,
    public readonly x: number,
    public readonly y: number
  ) {}

  getChannels = () => {
    this.instance.selectPixel(this.x, this.y);
    
    return this.instance.pixelChannels();
  };
}
