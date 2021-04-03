import { DynamicImage } from "./dynamic-image";
import { wasmDynamicImage } from "./symbols";
import * as wasm from "./wasm";

export const ColorType = wasm.WasmColorType;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ColorType = wasm.WasmColorType;

export class Color {

    [wasmDynamicImage]: wasm.WasmDynamicImage;

    constructor(dynamicImage: DynamicImage) {
        this[wasmDynamicImage] = dynamicImage[wasmDynamicImage];
    }

    get type(): ColorType {
        return this[wasmDynamicImage].colorType();
    };

    get bytesPerPixel() {
        return this[wasmDynamicImage].colorBytesPerPixel();
    };

    get hasAlpha() {
        return this[wasmDynamicImage].colorHasAlpha();
    };

    get hasColor() {
        return this[wasmDynamicImage].colorHasColor();
    };

    get bitsPerPixel() {
        return this[wasmDynamicImage].colorBitsPerPixel();
    };

    get channelCount() {
        return this[wasmDynamicImage].colorChannelCount();
    };
}