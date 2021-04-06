import { WasmColorType, WasmDynamicImage } from "../pkg/wasm_image";
import { $wasmDynamicImage } from "./symbols";

export const ColorType = WasmColorType;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ColorType = WasmColorType;

export class Color {

    [$wasmDynamicImage]: WasmDynamicImage;

    constructor(wasmDynamicImage: WasmDynamicImage) {
        this[$wasmDynamicImage] = wasmDynamicImage;
    }

    get type(): ColorType {
        return this[$wasmDynamicImage].colorType();
    };

    get bytesPerPixel() {
        return this[$wasmDynamicImage].colorBytesPerPixel();
    };

    get hasAlpha() {
        return this[$wasmDynamicImage].colorHasAlpha();
    };

    get hasColor() {
        return this[$wasmDynamicImage].colorHasColor();
    };

    get bitsPerPixel() {
        return this[$wasmDynamicImage].colorBitsPerPixel();
    };

    get channelCount() {
        return this[$wasmDynamicImage].colorChannelCount();
    };
}