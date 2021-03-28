import * as fs from "fs/promises";
import { resolve } from "path";

const pathToImages = resolve(__dirname, "images");
const cache = new Map<string, Uint8Array>();

export const paths = {
    ballPng: resolve(pathToImages, "ball.png"),
    basi2c08Png: resolve(pathToImages, "basi2c08.png"),
    catJpg: resolve(pathToImages, "cat.jpg"),
    rgb16bitPng: resolve(pathToImages, "rgb16bit.png"),
};

export const read = async (path: string) => {
  if (cache.has(path) === false) {
    cache.set(path, await fs.readFile(path));
  }

  return cache.get(path)!;
}
