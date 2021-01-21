import * as wasm from "./wasm";
import { Dimensions } from "./dimensions";

export const imageDimensions = (buffer: Uint8Array): Dimensions => {
    const [width, height] = wasm.imageDimensions(buffer);

    return {width, height};
};