/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { Color } from "./color";
import { DynamicImage, ImageFormat, OutputFormat } from "./lib";
import { Pixel } from "./pixel";
import * as images from "./tests/images";
import * as snapshots from "./tests/snapshots";

const updateSnapshots = false;

describe("DynamicImage", () => {
  const instances: Array<DynamicImage> = [];

  afterEach(() => {
    instances.forEach((instance) => instance.dispose());
    instances.length = 0;
  });

  const createInstance = async (imgPath: string) => {
    const instance = new DynamicImage({
      bytes: await images.read(imgPath),
    });

    instances.push(instance);

    return instance;
  };

  const compare = async ({
    result,
    snapshot,
  }: {
    result: Uint8Array;
    snapshot: string;
  }) => {
    if (updateSnapshots) {
      await snapshots.write(snapshot, result);
    } else {
      const snapshotBuffer = await snapshots.read(snapshot);

      expect(snapshotBuffer.compare(result)).toBe(0);
    }
  };

  test("constructor() creates an instance", async () => {
    expect(async () => {
      await createInstance(images.paths.ballPng);
    }).not.toThrow();
  });

  test("constructor() with format creates an instance", async () => {
    const bytes = await images.read(images.paths.ballPng);

    expect(
      () => new DynamicImage({ bytes, format: ImageFormat.Png })
    ).not.toThrow();
  });

  test("constructor() with wrong format throws an error", async () => {
    const bytes = await images.read(images.paths.ballPng);

    expect(
      () => new DynamicImage({ bytes, format: ImageFormat.Jpeg })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Format error decoding Jpeg: invalid JPEG format: first two bytes is not a SOI marker"`
    );
  });

  // We can't call dispose() on these instances.
  // We need to make sure that the allocated buffer is free'ed
  // wasm_bindgen should take care of this but you never know...
  test.todo("constructor() with wrong format does not leak memory");

  test("toBytes() with no arguments", async () => {
    const image1 = await createInstance(images.paths.catJpg);
    const bytesOfImage1 = image1.toBytes();

    expect(bytesOfImage1).toBeInstanceOf(Uint8Array);
    expect(bytesOfImage1.length).toBe(230400);
    expect(Buffer.compare(bytesOfImage1, image1.toBytes())).toBe(0);

    const image2 = await createInstance(images.paths.catJpg);

    expect(Buffer.compare(bytesOfImage1, image2.toBytes())).toBe(0);
  });

  test("crop()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.crop({ x: 100, y: 100, width: 100, height: 100 });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.croppedJpg,
    });
  });

  test("color", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    expect(dynamicImage.color).toBeInstanceOf(Color);
  });

  test("grayscale()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.grayscale();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.grayscaleJpg,
    });
  });

  test("invert()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.invert();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.invertedJpg,
    });
  });

  test("resize() by width", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.resize({
      width: 100,
    });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.resizedByWidthJpg,
    });
  });

  test("resize() by height", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.resize({
      height: 100,
    });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.resizedByHeightJpg,
    });
  });

  test("resize() by width and height", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.resize({
      width: 100,
      height: 100,
    });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.resizedByWidthHeightJpg,
    });
  });

  test("thumbnail() by width", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.thumbnail({
      width: 100,
    });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.thumbnailByWidthJpg,
    });
  });

  test("thumbnail() by height", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.thumbnail({
      height: 100,
    });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.thumbnailByHeightJpg,
    });
  });

  test("thumbnail() by width and height", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.thumbnail({
      width: 100,
      height: 100,
    });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.thumbnailByWidthHeightJpg,
    });
  });

  test("blur()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.blur(3);

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.blurJpg,
    });
  });

  test("unsharpen()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.unsharpen(3, 20);

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.unsharpenJpg,
    });
  });

  // TODO: Find out if this is working as intended
  test("filter3x3()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.filter3x3(Float32Array.from([0, 1, 0, 0, 1, 0, 0, 1, 0]));

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.filter3x3Jpg,
    });
  });

  test("adjustContrast()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.adjustContrast(100);

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.adjustContrastJpg,
    });
  });

  test("brighten()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.brighten(100);

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.brightenJpg,
    });
  });

  test("huerotate()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.huerotate(100);

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.huerotateJpg,
    });
  });

  test("flipv()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.flipv();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.flipvJpg,
    });
  });

  test("fliph()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.fliph();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.fliphJpg,
    });
  });

  test("rotate90()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.rotate90();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.rotate90Jpg,
    });
  });

  test("rotate180()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.rotate180();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.rotate180Jpg,
    });
  });

  test("rotate270()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);

    dynamicImage.rotate270();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.rotate270Jpg,
    });
  });

  test("dimensions, width, height, bounds, inBounds()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);
    const { dimensions, width, height, bounds } = dynamicImage;

    expect(dimensions).toMatchObject({ width: 320, height: 240 });
    expect(width).toBe(320);
    expect(height).toBe(240);
    expect(bounds).toMatchObject({ x: 0, y: 0, width: 320, height: 240 });

    expect(dynamicImage.inBounds({ x: 0, y: -1 })).toBe(false);
    expect(dynamicImage.inBounds({ x: 0, y: 0 })).toBe(true);
    expect(dynamicImage.inBounds({ x: 319, y: 239 })).toBe(true);
    expect(dynamicImage.inBounds({ x: 320, y: 239 })).toBe(false);
  });

  test("getPixel()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);
    const pixel = dynamicImage.getPixel({ x: 0, y: 0 });

    expect(pixel).toBeInstanceOf(Pixel);
  });

  test("pixels()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);
    const totalPixelCount = 320 * 240;
    let i = 0;
    let pixel;

    expect.assertions(totalPixelCount + 5);

    for (pixel of dynamicImage.pixels()) {
      expect(pixel).toBeInstanceOf(Pixel);
      if (i === 0) {
        expect(pixel).toMatchObject({ x: 0, y: 0 });
      } else if (i === 319) {
        expect(pixel).toMatchObject({ x: 319, y: 0 });
      } else if (i === 320) {
        expect(pixel).toMatchObject({ x: 0, y: 1 });
      }
      i++;
    }

    expect(i).toBe(totalPixelCount);
    expect(pixel).toMatchObject({ x: 319, y: 239 });
  });
});
