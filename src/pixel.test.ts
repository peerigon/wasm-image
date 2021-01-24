import { DynamicImage } from "./lib";
import * as images from "./tests/images";

describe("Pixel", () => {
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

  test.only("getChannels() & setChannels()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);
    const pixel = dynamicImage.getPixel({ x: 0, y: 0 });
    let channels = pixel.getChannels();

    expect(channels).toMatchObject(Uint8Array.from([142, 152, 115, 255]));

    pixel.setChannels([0, 0]);

    channels = pixel.getChannels();

    expect(channels).toMatchObject(Uint8Array.from([0, 0, 115, 255]));
  });
});
