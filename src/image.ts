import * as wasm from "wasm-rust-image";

type Filter = "Nearest" | "Triangle" | "CatmullRom" | "Gaussian" | "Lanczos3";
interface IPoint {
  x: number;
  y: number;
}

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

  public async grayscale() {
    this.checkImage();
    this.currentImage = await wasm.grayscale(this.currentImage);
  }

  public async invert() {
    this.checkImage();
    this.currentImage = await wasm.invert(this.currentImage);
  }

  public async blur(sigma: number) {
    this.checkImage();
    this.currentImage = await wasm.blur(this.currentImage, sigma);
  }

  public async unsharpen(sigma: number, threshold: number) {
    this.checkImage();
    this.currentImage = await wasm.unsharpen(this.currentImage, sigma, threshold);
  }

  public async adjustContrast(contrast: number) {
    this.checkImage();
    this.currentImage = await wasm.adjust_contrast(this.currentImage, contrast);
  }

  public async brighten(value: number) {
    this.checkImage();
    this.currentImage = await wasm.brighten(this.currentImage, value);
  }

  public async hueRotate(value: number) {
    this.checkImage();
    this.currentImage = await wasm.hue_rotate(this.currentImage, value);
  }

  public async flip(axis: "horizontally" | "vertically") {
    this.checkImage();

    const flipMap = {
      horizontally: 0,
      vertically: 1,
    };
    this.currentImage = await wasm.flip(this.currentImage, flipMap[axis]);
  }

  public async crop(rectStartPoint: IPoint, rectEndPoint: IPoint) {
    this.checkImage();

    this.currentImage = await wasm.crop(this.currentImage, rectStartPoint.x, rectStartPoint.y, rectEndPoint.x, rectEndPoint.y);
  }

  public async resize(width: number, height: number, filter: Filter, aspectRatio: "preserve" | "fill" | "mangle" = "preserve") {
    this.checkImage();

    const filterMap = {
      Nearest: 0,
      Lanczos3: 1,
      Gaussian: 2,
      CatmullRom: 3,
      Triangle: 4,
    };

    this.currentImage = await wasm.resize(
      this.currentImage,
      width,
      height,
      filterMap[filter],
      aspectRatio === "preserve" || aspectRatio === "fill",
      aspectRatio === "fill",
      false
    );
  }

  public async thumbnail(width: number, height: number, aspectRatio: "preserve" | "mangle" = "preserve") {
    this.checkImage();

    this.currentImage = await wasm.resize(this.currentImage, width, height, 0, aspectRatio === "preserve", false, true);
  }
}
