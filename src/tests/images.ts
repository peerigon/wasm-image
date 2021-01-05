import * as fs from "fs/promises";
import { resolve } from "path";

const pathToImages = resolve(__dirname, "images");

export const paths = {
    ballPng: resolve(pathToImages, "ball.png"),
    basi2c08Png: resolve(pathToImages, "basi2c08.png"),
    catJpg: resolve(pathToImages, "cat.jpg"),
};

export const read = async (path: string) =>
  fs.readFile(path);

export const write = async (path: string, bytes: Uint8Array) =>
  fs.writeFile(path, bytes);
