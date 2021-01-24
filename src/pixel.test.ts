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

  test("getChannels(), setChannels()", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);
    const pixel = dynamicImage.getPixel({ x: 0, y: 0 });

    expect(pixel.getChannels()).toMatchObject(
      Uint8Array.from([142, 152, 115, 255])
    );

    pixel.setChannels([0, 0]);

    expect(pixel.getChannels()).toMatchObject(
      Uint8Array.from([0, 0, 115, 255])
    );
  });

  // TODO: Write same test for image with alpha channel
  test("apply(), applyWithAlpha() for image without alpha channel", async () => {
    const dynamicImage = await createInstance(images.paths.catJpg);
    const pixel = dynamicImage.getPixel({ x: 0, y: 0 });
    const channels: Array<number> = [];

    pixel.apply((channel) => {
      channels.push(channel);

      return 0;
    });

    expect(channels).toMatchObject([142, 152, 115, 255]);
    // The underlying image has no alpha channel which is why 255 is returned again
    expect(pixel.getChannels()).toMatchObject(Uint8Array.from([0, 0, 0, 255]));

    channels.length = 0;

    pixel.applyWithAlpha(
      (channel) => {
        channels.push(channel);

        return 0;
      },
      (alphaChannel) => {
        channels.push(alphaChannel);

        return 255;
      }
    );

    expect(channels).toMatchObject([0, 0, 0, 255]);
    expect(pixel.getChannels()).toMatchObject(Uint8Array.from([0, 0, 0, 255]));
  });

  // TODO: Check pixel transformations in actual jpg
});
