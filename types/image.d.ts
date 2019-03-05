declare type Filter = "Nearest" | "Triangle" | "CatmullRom" | "Gaussian" | "Lanczos3";
interface IPoint {
    x: number;
    y: number;
}
export declare class WasmImage {
    constructor();
    private currentImage;
    setImage(image: Uint8Array): void;
    getImage(): Uint8Array;
    private checkImage;
    rotate(deg: 90 | 180 | 270): Promise<void>;
    grayscale(): Promise<void>;
    invert(): Promise<void>;
    blur(sigma: number): Promise<void>;
    unsharpen(sigma: number, threshold: number): Promise<void>;
    adjustContrast(contrast: number): Promise<void>;
    brighten(value: number): Promise<void>;
    hueRotate(value: number): Promise<void>;
    flip(axis: "horizontally" | "vertically"): Promise<void>;
    crop(rectStartPoint: IPoint, rectEndPoint: IPoint): Promise<void>;
    resize(width: number, height: number, filter: Filter, aspectRatio?: "preserve" | "fill" | "mangle"): Promise<void>;
    thumbnail(width: number, height: number, aspectRatio?: "preserve" | "mangle"): Promise<void>;
}
export {};
