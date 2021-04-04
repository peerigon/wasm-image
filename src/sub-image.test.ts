import { DynamicImage } from "./lib";
import { SubImage } from "./sub-image";
import * as images from "./tests/images";

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

  test("constructor()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const bounds = { x: 1, y: 2, width: 3, height: 4 };
    const subImage = new SubImage(image, bounds);

    expect(subImage).toMatchObject(bounds);
  });

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
    const subImage = new SubImage(image, bounds).subImage(bounds);
    const subImagePixel = subImage.getPixel({ x: 0, y: 0 });

    expect(pixel.channels).toMatchObject(subImagePixel.channels);
  });
});
