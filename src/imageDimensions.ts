import * as pkg from "../pkg";

export const imageDimensions = (buffer: Uint8Array): {width: number, height: number} => {
    const [width, height] = pkg.imageDimensions(buffer);

    return {width, height};
};