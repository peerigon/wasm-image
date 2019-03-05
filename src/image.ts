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

  private checkImage() {
    if (!this.currentImage) {
      throw new Error("no image set!");
    }
  }

  public async rotate(deg: 90 | 180 | 270) {
    this.checkImage();

    if ([90, 180, 270].includes(deg)) {
      this.currentImage = await wasm.rotate(this.currentImage, deg);
      return;
    }

    throw new Error("invalid rotation degree (must be 90, 180 or 270)");
  }

  public async resize(width: number, height: number, filter: Filter, aspectRatio: "preserve" | "mangle" = "preserve") {
    this.checkImage();

    const filterMap = {
      Nearest: 0,
      Lanczos3: 1,
      Gaussian: 2,
      CatmullRom: 3,
      Triangle: 4,
    };

    this.currentImage = await wasm.resize(this.currentImage, width, height, filterMap[filter], aspectRatio === "preserve");
  }
}
