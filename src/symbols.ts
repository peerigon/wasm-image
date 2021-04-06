import type { DynamicImage } from "./dynamic-image";

export const $dynamicImage = Symbol("dynamicImage");
export const $wasmDynamicImage = Symbol("wasmDynamicImage");
export const $toGlobalPosition = Symbol("toGlobalPosition");
export const $pixelConstructor = Symbol("pixelConstructor");

export const dynamicImageSymbols = (instance: DynamicImage) => ({
    get [$dynamicImage]() {
        return instance;
    },
    get [$wasmDynamicImage]() {
        return instance[$wasmDynamicImage];
    },
});

export type DynamicImageSymbols = ReturnType<typeof dynamicImageSymbols>;