import * as fs from "fs/promises";
import { resolve } from "path";

const pathToSnapshots = resolve(__dirname, "snapshots");

export const paths = {
    grayscaleJpg: resolve(pathToSnapshots, "grayscale.jpg"),
    croppedJpg: resolve(pathToSnapshots, "cropped.jpg"),
    invertedJpg: resolve(pathToSnapshots, "inverted.jpg"),
    resizedByWidthJpg: resolve(pathToSnapshots, "resizedByWidth.jpg"),
    resizedByHeightJpg: resolve(pathToSnapshots, "resizedByHeight.jpg"),
    resizedByWidthHeightJpg: resolve(pathToSnapshots, "resizedByWidthHeight.jpg"),
};

export const read = async (path: string) =>
  fs.readFile(path);

export const write = async (path: string, bytes: Uint8Array) =>
  fs.writeFile(path, bytes);