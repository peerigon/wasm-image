import { Color, ColorType } from "./color";
import { DynamicImage, ImageFormat, OutputFormat } from "./lib";
import { Pixel } from "./pixel";
import * as images from "./tests/images";
import * as snapshots from "./tests/snapshots";

const updateSnapshot = false;

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

  test("copyAs()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const bytesOfImage = image.toBytes();

    const imageCopy = image.copyAs(ColorType.L8);

    expect(bytesOfImage).toMatchObject(image.toBytes());

    const result = imageCopy.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.convertInto,
      updateSnapshot,
    });
  });

  test("convertInto()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.convertInto(ColorType.L8);

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.convertInto,
      updateSnapshot,
    });
  });

  test("crop()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.crop({ x: 100, y: 100, width: 100, height: 100 });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.croppedJpg,
      updateSnapshot,
    });
  });

  test("color", async () => {
    const image = await createInstance(images.paths.catJpg);

    expect(image.color).toBeInstanceOf(Color);
  });

  test("grayscale()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.grayscale();

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.grayscaleJpg,
      updateSnapshot,
    });
  });

  test("invert()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.invert();

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.invertedJpg,
      updateSnapshot,
    });
  });

  test("resize() by width", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.resize({
      width: 100,
    });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.resizedByWidthJpg,
      updateSnapshot,
    });
  });

  test("resize() by height", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.resize({
      height: 100,
    });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.resizedByHeightJpg,
      updateSnapshot,
    });
  });

  test("resize() by width and height", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.resize({
      width: 100,
      height: 100,
    });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.resizedByWidthHeightJpg,
      updateSnapshot,
    });
  });

  test("thumbnail() by width", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.thumbnail({
      width: 100,
    });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.thumbnailByWidthJpg,
      updateSnapshot,
    });
  });

  test("thumbnail() by height", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.thumbnail({
      height: 100,
    });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.thumbnailByHeightJpg,
      updateSnapshot,
    });
  });

  test("thumbnail() by width and height", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.thumbnail({
      width: 100,
      height: 100,
    });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.thumbnailByWidthHeightJpg,
      updateSnapshot,
    });
  });

  test("blur()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.blur(3);

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.blurJpg,
      updateSnapshot,
    });
  });

  test("unsharpen()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.unsharpen({ sigma: 3, threshold: 20 });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.unsharpenJpg,
      updateSnapshot,
    });
  });

  // TODO: Find out if this is working as intended
  test("filter3x3()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.filter3x3(Float32Array.from([0, 1, 0, 0, 1, 0, 0, 1, 0]));

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.filter3x3Jpg,
      updateSnapshot,
    });
  });

  test("adjustContrast()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.adjustContrast(100);

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.adjustContrastJpg,
      updateSnapshot,
    });
  });

  test("brighten()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.brighten(100);

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.brightenJpg,
      updateSnapshot,
    });
  });

  test("huerotate()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.huerotate(100);

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.huerotateJpg,
      updateSnapshot,
    });
  });

  test("flipv()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.flipv();

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.flipvJpg,
      updateSnapshot,
    });
  });

  test("fliph()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.fliph();

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.fliphJpg,
      updateSnapshot,
    });
  });

  test("rotate90()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.rotate90();

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.rotate90Jpg,
      updateSnapshot,
    });
  });

  test("rotate180()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.rotate180();

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.rotate180Jpg,
      updateSnapshot,
    });
  });

  test("rotate270()", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.rotate270();

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.rotate270Jpg,
      updateSnapshot,
    });
  });

  test("dimensions, width, height, bounds, inBounds()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const { dimensions, width, height, bounds } = image;

    expect(dimensions).toMatchObject({ width: 320, height: 240 });
    expect(width).toBe(320);
    expect(height).toBe(240);
    expect(bounds).toMatchObject({ x: 0, y: 0, width: 320, height: 240 });

    expect(image.inBounds({ x: 0, y: -1 })).toBe(false);
    expect(image.inBounds({ x: 0, y: 0 })).toBe(true);
    expect(image.inBounds({ x: 319, y: 239 })).toBe(true);
    expect(image.inBounds({ x: 320, y: 239 })).toBe(false);
  });

  test("getPixel()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel = image.getPixel({ x: 0, y: 0 });

    expect(pixel).toBeInstanceOf(Pixel);
  });

  test("pixels()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const totalPixelCount = 320 * 240;
    let i = 0;
    let pixel;

    expect.assertions(totalPixelCount + 9);

    for (pixel of image.pixels()) {
      expect(pixel).toBeInstanceOf(Pixel);
      if (i === 0) {
        expect(pixel.x).toBe(0);
        expect(pixel.y).toBe(0);
      } else if (i === 319) {
        expect(pixel.x).toBe(319);
        expect(pixel.y).toBe(0);
      } else if (i === 320) {
        expect(pixel.x).toBe(0);
        expect(pixel.y).toBe(1);
      }
      i++;
    }

    expect(i).toBe(totalPixelCount);
    if (pixel) {
      expect(pixel.x).toBe(319);
      expect(pixel.y).toBe(239);
    }
  });

  test("dispose() is callable twice without error", async () => {
    const image = await createInstance(images.paths.catJpg);

    // Should be callable twice without error
    image.dispose();
    image.dispose();
  });

  test("dispose() makes the image unusable afterwards", async () => {
    const image = await createInstance(images.paths.catJpg);

    image.dispose();

    expect(() => image.rotate180()).toThrowErrorMatchingInlineSnapshot(
      `"Cannot read property 'rotate180' of null"`
    );
  });
});
