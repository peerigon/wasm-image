import * as wasm from "wasm-rust-image";

type Filter = "Nearest" | "Triangle" | "CatmullRom" | "Gaussian" | "Lanczos3";

export class WasmImage {
  constructor() {}

  private currentImage: Uint8Array;

  public setImage(image: Uint8Array): void {
    this.currentImage = image;
  }

  public getImage(): Uint8Array {
    return this.currentImage;
  }

  public rotate(deg: 90 | 180 | 270) {
    switch (deg) {
      case 90:
        this.currentImage = wasm.rotate(this.currentImage, 90);
      case 180:
        this.currentImage = wasm.rotate(this.currentImage, 180);
      case 270:
        this.currentImage = wasm.rotate(this.currentImage, 270);
      default:
        throw new Error("invalid rotation degree (must be 90, 180 or 270)");
    }
  }

  public resize(width: number, height: number, filter: Filter, aspectRatio: "preserve" | "mangle" = "preserve") {
    const filterMap = {
      Nearest: 0,
      Lanczos3: 1,
      Gaussian: 2,
      CatmullRom: 3,
      Triangle: 4,
    };
    this.currentImage = wasm.resize(this.currentImage, width, height, filterMap[filter], aspectRatio === "preserve");
  }
}
