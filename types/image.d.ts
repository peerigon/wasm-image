declare type Filter = "Nearest" | "Triangle" | "CatmullRom" | "Gaussian" | "Lanczos3";
export default class WasmImage {
    constructor();
    private currentImage;
    setImage(image: Uint8Array): void;
    getImage(): Uint8Array;
    private checkImage;
    rotate(deg: 90 | 180 | 270): void;
    resize(width: number, height: number, filter: Filter, aspectRatio?: "preserve" | "mangle"): void;
}
export {};
