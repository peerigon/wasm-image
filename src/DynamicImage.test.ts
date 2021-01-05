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
    const dynamicImage = new DynamicImage({ bytes: await images.read(images.paths.catJpg) });

    dynamicImage.crop({x: 100, y: 100, width: 100, height: 100});

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });
    
    if (updateSnapshots) {
        await snapshots.write(snapshots.paths.croppedJpg, result);
    } else {
        const snapshot = await snapshots.read(snapshots.paths.croppedJpg);

        expect(snapshot.compare(result)).toBe(0);
    }
  });

  test("invert()", async () => {
    const dynamicImage = new DynamicImage({ bytes: await images.read(images.paths.catJpg) });

    dynamicImage.invert();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });
    
    if (updateSnapshots) {
        await snapshots.write(snapshots.paths.invertedJpg, result);
    } else {
        const snapshot = await snapshots.read(snapshots.paths.invertedJpg);

        expect(snapshot.compare(result)).toBe(0);
    }
  });

  test("resize() by width", async () => {
    const dynamicImage = new DynamicImage({ bytes: await images.read(images.paths.catJpg) });

    dynamicImage.resize({
        width: 100,
    });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });
    
    if (updateSnapshots) {
        await snapshots.write(snapshots.paths.resizedByWidthJpg, result);
    } else {
        const snapshot = await snapshots.read(snapshots.paths.resizedByWidthJpg);

        expect(snapshot.compare(result)).toBe(0);
    }
  });

  test("resize() by height", async () => {
    const dynamicImage = new DynamicImage({ bytes: await images.read(images.paths.catJpg) });

    dynamicImage.resize({
        height: 100,
    });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });
    
    if (updateSnapshots) {
        await snapshots.write(snapshots.paths.resizedByHeightJpg, result);
    } else {
        const snapshot = await snapshots.read(snapshots.paths.resizedByHeightJpg);

        expect(snapshot.compare(result)).toBe(0);
    }
  });

  test("resize() by width and height", async () => {
    const dynamicImage = new DynamicImage({ bytes: await images.read(images.paths.catJpg) });

    dynamicImage.resize({
        width: 100,
        height: 100,
    });

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });
    
    if (updateSnapshots) {
        await snapshots.write(snapshots.paths.resizedByWidthHeightJpg, result);
    } else {
        const snapshot = await snapshots.read(snapshots.paths.resizedByWidthHeightJpg);

        expect(snapshot.compare(result)).toBe(0);
    }
  });

  test("grayscale()", async () => {
    const dynamicImage = new DynamicImage({ bytes: await images.read(images.paths.catJpg) });

    dynamicImage.grayscale();

    const result = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
    });
    
    if (updateSnapshots) {
        await snapshots.write(snapshots.paths.grayscaleJpg, result);
    } else {
        const snapshot = await snapshots.read(snapshots.paths.grayscaleJpg);

        expect(snapshot.compare(result)).toBe(0);
    }
  });
});
