import { ColorType, DynamicImage } from "./lib";
import * as images from "./tests/images";

describe("Color", () => {
  const instances: Array<DynamicImage> = [];

  const createInstance = async (imgPath: string) => {
    const instance = new DynamicImage({
      bytes: await images.read(imgPath),
    });

    instances.push(instance);

    return instance;
  };

  const createAllInstances = async () => {
    return Promise.all(
      Object.values(images.paths).map(async (path) => createInstance(path))
    );
  };

  let allInstances: Array<DynamicImage>;

  beforeAll(async () => {
    allInstances = await createAllInstances();
  });

  afterAll(() => {
    instances.forEach((instance) => instance.dispose());
    instances.length = 0;
  });

  test("type", () => {
    expect(allInstances.map((image) => image.color.type)).toMatchObject([
      ColorType.Rgba8,
      ColorType.Rgb8,
      ColorType.Rgb8,
      ColorType.Rgb16,
    ])
  });

  test("bytesPerPixel", () => {
    expect(allInstances.map((image) => image.color.bytesPerPixel)).toMatchObject([
      4,
      3,
      3,
      6,
    ])
  });

  test("hasAlpha", () => {
    expect(allInstances.map((image) => image.color.hasAlpha)).toMatchObject([
      true,
      false,
      false,
      false,
    ])
  });

  test("hasColor", () => {
    expect(allInstances.map((image) => image.color.hasColor)).toMatchObject([
      true,
      true,
      true,
      true,
    ])
  });

  test("bitsPerPixel", () => {
    expect(allInstances.map((image) => image.color.bitsPerPixel)).toMatchObject([
      32,
      24,
      24,
      48,
    ])
  });

  test("channelCount", () => {
    expect(allInstances.map((image) => image.color.channelCount)).toMatchObject([
      4,
      3,
      3,
      3,
    ])
  });
});
