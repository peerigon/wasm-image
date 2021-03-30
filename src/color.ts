import { DynamicImage } from "./dynamic-image";
import { wasmDynamicImage } from "./symbols";
import * as wasm from "./wasm";

export const ColorType = wasm.WasmColorType;
export type ColorType = wasm.WasmColorType;

export class Color {

    [wasmDynamicImage]: wasm.WasmDynamicImage;
    
    get type(): ColorType {
        return this[wasmDynamicImage].colorType();
    }

    constructor(dynamicImage: DynamicImage) {
        this[wasmDynamicImage] = dynamicImage[wasmDynamicImage];
    }
}