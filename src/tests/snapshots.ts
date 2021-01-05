import * as fs from "fs/promises";
import { resolve } from "path";

const pathToSnapshots = resolve(__dirname, "snapshots");

export const readGrayscale = async () =>
  fs.readFile(resolve(pathToSnapshots, "grayscale.jpg"));
  
export const writeGrayscale = async (bytes: Uint8Array) =>
  fs.writeFile(resolve(pathToSnapshots, "grayscale.jpg"), bytes);
