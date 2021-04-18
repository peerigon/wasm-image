import * as fs from "fs/promises";
import { resolve } from "path";

const pathToSnapshots = resolve(__dirname, "snapshots");

export const paths = {
    grayscaleJpg: resolve(pathToSnapshots, "grayscale.jpg"),
    convertInto: resolve(pathToSnapshots, "convertInto.jpg"),
    croppedJpg: resolve(pathToSnapshots, "cropped.jpg"),
    invertedJpg: resolve(pathToSnapshots, "inverted.jpg"),
    resizedByWidthJpg: resolve(pathToSnapshots, "resizedByWidth.jpg"),
    resizedByHeightJpg: resolve(pathToSnapshots, "resizedByHeight.jpg"),
    resizedByWidthHeightJpg: resolve(pathToSnapshots, "resizedByWidthHeight.jpg"),
    thumbnailByWidthJpg: resolve(pathToSnapshots, "thumbnailByWidth.jpg"),
    thumbnailByHeightJpg: resolve(pathToSnapshots, "thumbnailByHeight.jpg"),
    thumbnailByWidthHeightJpg: resolve(pathToSnapshots, "thumbnailByWidthHeight.jpg"),
    blurJpg: resolve(pathToSnapshots, "blur.jpg"),
    unsharpenJpg: resolve(pathToSnapshots, "unsharpen.jpg"),
    filter3x3Jpg: resolve(pathToSnapshots, "filter3x3.jpg"),
    adjustContrastJpg: resolve(pathToSnapshots, "adjustContrast.jpg"),
    brightenJpg: resolve(pathToSnapshots, "brighten.jpg"),
    huerotateJpg: resolve(pathToSnapshots, "huerotate.jpg"),
    flipvJpg: resolve(pathToSnapshots, "flipv.jpg"),
    fliphJpg: resolve(pathToSnapshots, "fliph.jpg"),
    rotate90Jpg: resolve(pathToSnapshots, "rotate90.jpg"),
    rotate180Jpg: resolve(pathToSnapshots, "rotate180.jpg"),
    rotate270Jpg: resolve(pathToSnapshots, "rotate270.jpg"),
    copyFrom: resolve(pathToSnapshots, "copyFrom.jpg"),
    copyFromSubImage: resolve(pathToSnapshots, "copyFromSubImage.jpg"),
    copyWithin: resolve(pathToSnapshots, "copyWithin.jpg"),
    copyWithinSubImage: resolve(pathToSnapshots, "copyWithinSubImage.jpg"),
    toImage: resolve(pathToSnapshots, "toImage.jpg"),
};

const read = async (path: string) =>
  fs.readFile(path);

const write = async (path: string, bytes: Uint8Array) =>
  fs.writeFile(path, bytes);

export const compare = async ({
  result,
  snapshot,
  updateSnapshot,
}: {
  result: Uint8Array;
  snapshot: string;
  updateSnapshot: boolean;
}) => {
  if (updateSnapshot) {
    await write(snapshot, result);
  } else {
    const snapshotBuffer = await read(snapshot);

    expect(snapshotBuffer.compare(result)).toBe(0);
  }
};