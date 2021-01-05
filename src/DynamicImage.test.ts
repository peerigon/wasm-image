/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { DynamicImage, ImageFormat, OutputFormat } from "./lib";
import * as images from "./tests/images";
import * as snapshots from "./tests/snapshots";
import { writeGrayscale } from "./tests/snapshots";

const updateSnapshots = false;

describe("DynamicImage", () => {
  let dynamicImage: DynamicImage;

  afterEach(() => {
    dynamicImage?.dispose();
  });

  test("constructor() creates an instance", async () => {
    const bytes = await images.readBallPng();

    expect(() => new DynamicImage({ bytes })).not.toThrow();
  });

  test("constructor() with format creates an instance", async () => {
    const bytes = await images.readBallPng();

    expect(
      () => new DynamicImage({ bytes, format: ImageFormat.Png })
    ).not.toThrow();
  });

  test("constructor() with wrong format throws an error", async () => {
    const bytes = await images.readBallPng();

    expect(
      () => new DynamicImage({ bytes, format: ImageFormat.Jpeg })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Format error decoding Jpeg: invalid JPEG format: first two bytes is not a SOI marker"`
    );
  });

  test("grayscale()", async () => {
    const dynamicImage = new DynamicImage({ bytes: await images.readCatJpg() });

    dynamicImage.grayscale();

    const grayscaleBytes = dynamicImage.toBytes({
      format: OutputFormat.Jpeg,
      quality: 100,
    });
    const snapshot = await snapshots.readGrayscale();

    if (updateSnapshots) {
      await writeGrayscale(grayscaleBytes);
    } else {
        expect(snapshot.compare(grayscaleBytes)).toBe(0);
    }
  });
});
