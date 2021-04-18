import { ColorType, DynamicImage, OutputFormat } from "./lib";
import { SubImage } from "./generic-image";
import { Pixel } from "./pixel";
import * as images from "./tests/images";
import * as snapshots from "./tests/snapshots";

const updateSnapshot = false;

describe("SubImage", () => {
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

  test("getPixel()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel1 = image.getPixel({ x: 0, y: 0 });
    const pixel2 = image.getPixel({ x: 100, y: 100 });

    expect(pixel1.channels).not.toMatchObject(pixel2.channels);

    const bounds = { x: 100, y: 100, width: 1, height: 1 };
    const subImage = new SubImage(image, bounds);
    const subImagePixel = subImage.getPixel({ x: 0, y: 0 });

    expect(subImagePixel.channels).toMatchObject(pixel2.channels);
  });

  test("putPixel()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel1 = image.getPixel({ x: 0, y: 0 });
    const pixel2 = image.getPixel({ x: 100, y: 100 });

    expect(pixel1.channels).not.toMatchObject(pixel2.channels);

    const bounds = { x: 100, y: 100, width: 1, height: 1 };
    const subImage = new SubImage(image, bounds);
    const subImagePixel = subImage.getPixel({ x: 0, y: 0 });

    expect(subImagePixel.channels).toMatchObject(pixel2.channels);

    subImage.putPixel({ x: 0, y: 0 }, pixel1);

    expect(subImagePixel.channels).toMatchObject(pixel1.channels);
    expect(pixel1.channels).toMatchObject(pixel2.channels);
  });

  test("subImage()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel = image.getPixel({ x: 100, y: 100 });
    const bounds = { x: 50, y: 50, width: 100, height: 100 };
    // Creating a SubImage from a SubImage should give us the expected pixel
    // x = 0px + 2 * 50px = 100px
    // y = 0px + 2 * 50px = 100px
    const subImage = image.subImage(bounds).subImage(bounds);
    const subImagePixel = subImage.getPixel({ x: 0, y: 0 });

    expect(pixel.channels).toMatchObject(subImagePixel.channels);
  });

  test("pixels()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const subImage = image.subImage({
      x: 100,
      y: 100,
      width: 100,
      height: 100,
    });
    const totalPixelCount = 100 * 100;
    let i = 0;
    let pixel;

    expect.assertions(totalPixelCount + 9);

    for (pixel of subImage.pixels()) {
      expect(pixel).toBeInstanceOf(Pixel);
      if (i === 0) {
        expect(pixel.x).toBe(100);
        expect(pixel.y).toBe(100);
      } else if (i === 99) {
        expect(pixel.x).toBe(199);
        expect(pixel.y).toBe(100);
      } else if (i === 100) {
        expect(pixel.x).toBe(100);
        expect(pixel.y).toBe(101);
      }
      i++;
    }

    expect(i).toBe(totalPixelCount);
    if (pixel) {
      expect(pixel.x).toBe(199);
      expect(pixel.y).toBe(199);
    }
  });

  test("copyFrom()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const otherImage = await createInstance(images.paths.ballPng);

    image.copyFrom(otherImage, { x: 50, y: 50 });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.copyFrom,
      updateSnapshot,
    });
  });

  test("copyFrom() (subImage)", async () => {
    const image = await createInstance(images.paths.catJpg);
    const otherImage = await createInstance(images.paths.ballPng);
    const subImage = otherImage.subImage({
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    });

    image.copyFrom(subImage, { x: 50, y: 50 });

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.copyFromSubImage,
      updateSnapshot,
    });
  });

  test("copyFrom() (error)", async () => {
    const image = await createInstance(images.paths.catJpg);
    const otherImage = await createInstance(images.paths.ballPng);

    expect(() =>
      image.copyFrom(otherImage, { x: 320, y: 240 })
    ).toThrowErrorMatchingInlineSnapshot(
      `"The Image's dimensions are either too small or too large"`
    );
  });

  test("copyWithin()", async () => {
    const image = await createInstance(images.paths.catJpg);

    const returned = image.copyWithin({ x: 0, y: 0, width: 100, height: 100 }, { x: 100, y: 100 });

    expect(returned).toBe(true);
    
    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.copyWithin,
      updateSnapshot,
    });
  });

  test("copyWithin() (subImage)", async () => {
    const image = await createInstance(images.paths.catJpg);
    const subImage = image.subImage({ x: 50, y: 50, width: 100, height: 100 });

    const returned = subImage.copyWithin(
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 50, y: 50 }
    );

    expect(returned).toBe(true);

    const result = image.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.copyWithinSubImage,
      updateSnapshot,
    });
  });

  test("toImage() (subImage)", async () => {
    const image = await createInstance(images.paths.catJpg);
    const imageSection = image.subImage({ x: 50, y: 50, width: 100, height: 100 }).toImage();

    image.convertInto(ColorType.L8);

    const result = imageSection.toBytes({
      format: OutputFormat.Jpeg,
    });

    await snapshots.compare({
      result,
      snapshot: snapshots.paths.toImage,
      updateSnapshot,
    });
  });
});
