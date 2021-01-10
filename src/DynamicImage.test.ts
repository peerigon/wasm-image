/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { DynamicImage, ImageFormat, OutputFormat } from "./lib";
import * as images from "./tests/images";
import * as snapshots from "./tests/snapshots";

const updateSnapshots = false;

describe("DynamicImage", () => {
  let dynamicImage: DynamicImage;

  afterEach(() => {
    dynamicImage?.dispose();
  });

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
    const bytes = await images.read(images.paths.ballPng);

    expect(() => new DynamicImage({ bytes })).not.toThrow();
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

  test("crop()", async () => {
    const dynamicImage = new DynamicImage({
      bytes: await images.read(images.paths.catJpg),
    });

    dynamicImage.crop({ x: 100, y: 100, width: 100, height: 100 });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.croppedJpg,
    });
  });

  test("invert()", async () => {
    const dynamicImage = new DynamicImage({
      bytes: await images.read(images.paths.catJpg),
    });

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
    const dynamicImage = new DynamicImage({
      bytes: await images.read(images.paths.catJpg),
    });

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
    const dynamicImage = new DynamicImage({
      bytes: await images.read(images.paths.catJpg),
    });

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
    const dynamicImage = new DynamicImage({
      bytes: await images.read(images.paths.catJpg),
    });

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
    const dynamicImage = new DynamicImage({
      bytes: await images.read(images.paths.catJpg),
    });

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
    const dynamicImage = new DynamicImage({
      bytes: await images.read(images.paths.catJpg),
    });

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
    const dynamicImage = new DynamicImage({
      bytes: await images.read(images.paths.catJpg),
    });

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

  test("grayscale()", async () => {
    const dynamicImage = new DynamicImage({
      bytes: await images.read(images.paths.catJpg),
    });

    dynamicImage.grayscale();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });

    await compare({
      result,
      snapshot: snapshots.paths.grayscaleJpg,
    });
  });
});
