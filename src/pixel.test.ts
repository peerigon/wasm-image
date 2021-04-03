import { ColorType, DynamicImage } from "./lib";
import { Pixel } from "./pixel";
import * as images from "./tests/images";

describe("Pixel (image)", () => {
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

  test("channels (8bit)", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel = image.getPixel({ x: 0, y: 0 });

    expect(pixel.channels).toMatchObject(Uint8Array.from([142, 152, 115]));

    pixel.channels = Uint8Array.from([0, 0]);

    expect(pixel.channels).toMatchObject(Uint8Array.from([0, 0, 115]));
  });

  test("channels (16bit)", async () => {
    const image = await createInstance(images.paths.rgb16bitPng);
    const pixel = image.getPixel({ x: 0, y: 0 });

    expect(pixel.channels).toMatchObject(Uint16Array.from([65535, 25702, 2]));

    pixel.channels = Uint16Array.from([0, 0]);

    expect(pixel.channels).toMatchObject(Uint16Array.from([0, 0, 2]));
  });

  // TODO: Check pixel transformations in actual jpg

  test("apply() without alpha channel", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel = image.getPixel({ x: 0, y: 0 });
    const channels: Array<number> = [];

    pixel.apply((channel) => {
      channels.push(channel);

      return 0;
    });

    expect(channels).toMatchObject([142, 152, 115]);
    expect(pixel.channels).toMatchObject(Uint8Array.from([0, 0, 0]));

    channels.length = 0;

    pixel.apply({
      color: (channel) => {
        channels.push(channel);

        return 1;
      },
      alpha: () => {
        throw new Error("Should not be called");
      },
    });

    expect(channels).toMatchObject([0, 0, 0]);
    expect(pixel.channels).toMatchObject(Uint8Array.from([1, 1, 1]));

    channels.length = 0;

    pixel.apply({
      color: (channel) => {
        channels.push(channel);

        return 2;
      },
    });

    expect(channels).toMatchObject([1, 1, 1]);
    expect(pixel.channels).toMatchObject(Uint8Array.from([2, 2, 2]));
  });

  test("apply() with alpha channel", async () => {
    const image = await createInstance(images.paths.ballPng);
    const pixel = image.getPixel({ x: 50, y: 50 });
    const channels: Array<number> = [];

    pixel.apply((channel) => {
      channels.push(channel);

      return 0;
    });

    expect(channels).toMatchObject([227, 227, 50, 255]);
    expect(pixel.channels).toMatchObject(Uint8Array.from([0, 0, 0, 0]));

    channels.length = 0;

    pixel.apply({
      color: (channel) => {
        channels.push(channel);

        return 1;
      },
      alpha: (channel) => {
        channels.push(channel);

        return 1;
      },
    });

    expect(channels).toMatchObject([0, 0, 0, 0]);
    expect(pixel.channels).toMatchObject(Uint8Array.from([1, 1, 1, 1]));

    channels.length = 0;

    pixel.apply({
      color: (channel) => {
        channels.push(channel);

        return 2;
      },
    });

    expect(channels).toMatchObject([1, 1, 1]);
    expect(pixel.channels).toMatchObject(Uint8Array.from([2, 2, 2, 1]));
  });

  test("map2()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel = image.getPixel({ x: 0, y: 0 });
    const otherPixel = image.getPixel({ x: 100, y: 0 });
    const channelTuples: Array<Array<number>> = [];

    const result = pixel.map2(otherPixel, (selfChannel, otherChannel) => {
      channelTuples.push([selfChannel, otherChannel]);

      return 0;
    });

    expect(channelTuples).toMatchObject([
      [142, 165],
      [152, 170],
      [115, 148],
    ]);
    expect(pixel.channels).toMatchObject(Uint8Array.from([142, 152, 115]));
    expect(otherPixel.channels).toMatchObject(Uint8Array.from([165, 170, 148]));
    expect(result).toMatchObject(Uint8Array.from([0, 0, 0]));
  });

  test("apply2()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel = image.getPixel({ x: 0, y: 0 });
    const otherPixel = image.getPixel({ x: 100, y: 0 });
    const channelTuples: Array<Array<number>> = [];

    pixel.apply2(otherPixel, (selfChannel, otherChannel) => {
      channelTuples.push([selfChannel, otherChannel]);

      return 0;
    });

    expect(channelTuples).toMatchObject([
      [142, 165],
      [152, 170],
      [115, 148],
    ]);
    expect(pixel.channels).toMatchObject(Uint8Array.from([0, 0, 0]));
  });

  test("invert()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel = image.getPixel({ x: 0, y: 0 });

    expect(pixel.channels).toMatchObject(Uint8Array.from([142, 152, 115]));

    pixel.invert();

    expect(pixel.channels).toMatchObject(Uint8Array.from([113, 103, 140]));
  });

  test("blend()", async () => {
    const image = await createInstance(images.paths.catJpg);
    const pixel = image.getPixel({ x: 0, y: 0 });
    const otherPixel = image.getPixel({ x: 100, y: 0 });

    expect(pixel.channels).toMatchObject(Uint8Array.from([142, 152, 115]));

    pixel.blend(otherPixel);

    expect(pixel.channels).toMatchObject(Uint8Array.from([165, 170, 148]));

    const otherImage = await createInstance(images.paths.catJpg);
    const pixelFromOtherImage = otherImage.getPixel({ x: 50, y: 0 });

    pixel.blend(pixelFromOtherImage);

    expect(pixel.channels).toMatchObject(Uint8Array.from([150, 163, 120]));
  });
});

describe("Pixel (independent)", () => {
  test("channels", () => {
    const pixel = Pixel.fromChannels(ColorType.Rgba8, [142, 152, 115, 255]);

    expect(pixel.channels).toMatchObject(
      // Regular array inputs get normalized to Uint16Array
      Uint16Array.from([142, 152, 115, 255])
    );

    // Although channels is now set to Uint8Array
    // the original array type (Uint16Array in this case) is preserved
    pixel.channels = Uint8Array.from([0, 0]);

    expect(pixel.channels).toMatchObject(Uint16Array.from([0, 0, 115, 255]));
  });

  test("apply() without alpha channel", () => {
    const pixel = Pixel.fromChannels(ColorType.Rgb8, [142, 152, 115]);
    const channels: Array<number> = [];

    pixel.apply((channel) => {
      channels.push(channel);

      return 0;
    });

    expect(channels).toMatchObject([142, 152, 115]);
    expect(pixel.channels).toMatchObject(Uint16Array.from([0, 0, 0]));

    channels.length = 0;

    pixel.apply({
      color: (channel) => {
        channels.push(channel);

        return 1;
      },
      alpha: () => {
        throw new Error("Should not be called");
      },
    });

    expect(channels).toMatchObject([0, 0, 0]);
    expect(pixel.channels).toMatchObject(Uint16Array.from([1, 1, 1]));

    channels.length = 0;

    pixel.apply({
      color: (channel) => {
        channels.push(channel);

        return 2;
      },
    });

    expect(channels).toMatchObject([1, 1, 1]);
    expect(pixel.channels).toMatchObject(Uint16Array.from([2, 2, 2]));
  });

  test("apply() with alpha channel", () => {
    const pixel = Pixel.fromChannels(ColorType.Rgba8, [142, 152, 115, 255]);
    const channels: Array<number> = [];

    pixel.apply((channel) => {
      channels.push(channel);

      return 0;
    });

    expect(channels).toMatchObject([142, 152, 115, 255]);
    expect(pixel.channels).toMatchObject(Uint16Array.from([0, 0, 0, 0]));

    channels.length = 0;

    pixel.apply({
      color: (channel) => {
        channels.push(channel);

        return 1;
      },
      alpha: (alphaChannel) => {
        channels.push(alphaChannel);

        return 1;
      },
    });

    expect(channels).toMatchObject([0, 0, 0, 0]);
    expect(pixel.channels).toMatchObject(Uint16Array.from([1, 1, 1, 1]));

    channels.length = 0;

    pixel.apply({
      color: (channel) => {
        channels.push(channel);

        return 2;
      },
    });

    expect(channels).toMatchObject([1, 1, 1]);
    expect(pixel.channels).toMatchObject(Uint16Array.from([2, 2, 2, 1]));
  });

  test("map2()", () => {
    const pixel = Pixel.fromChannels(ColorType.Rgba8, [1, 1, 1, 1]);
    const otherPixel = Pixel.fromChannels(ColorType.Rgba8, [2, 2, 2, 2]);
    const channelTuples: Array<Array<number>> = [];

    const result = pixel.map2(otherPixel, (selfChannel, otherChannel) => {
      channelTuples.push([selfChannel, otherChannel]);

      return 0;
    });

    expect(channelTuples).toMatchObject([
      [1, 2],
      [1, 2],
      [1, 2],
      [1, 2],
    ]);
    expect(result).toMatchObject(Uint16Array.from([0, 0, 0, 0]));
    expect(pixel.channels).toMatchObject(Uint16Array.from([1, 1, 1, 1]));
    expect(otherPixel.channels).toMatchObject(Uint16Array.from([2, 2, 2, 2]));
  });

  test("apply2()", () => {
    const pixel = Pixel.fromChannels(ColorType.Rgba8, [1, 1, 1, 1]);
    const otherPixel = Pixel.fromChannels(ColorType.Rgba8, [2, 2, 2, 2]);
    const channelTuples: Array<Array<number>> = [];

    pixel.apply2(otherPixel, (selfChannel, otherChannel) => {
      channelTuples.push([selfChannel, otherChannel]);

      return 0;
    });

    expect(channelTuples).toMatchObject([
      [1, 2],
      [1, 2],
      [1, 2],
      [1, 2],
    ]);
    expect(pixel.channels).toMatchObject(Uint16Array.from([0, 0, 0, 0]));
  });

  test("invert()", () => {
    const pixel = Pixel.fromChannels(ColorType.Rgba8, [1, 1, 1, 1]);

    expect(pixel.channels).toMatchObject(Uint16Array.from([1, 1, 1, 1]));

    pixel.invert();

    expect(pixel.channels).toMatchObject(Uint16Array.from([254, 254, 254, 1]));
  });

  test("blend()", () => {
    const pixel = Pixel.fromChannels(ColorType.Rgba8, [1, 1, 1, 1]);
    const otherPixel = Pixel.fromChannels(ColorType.Rgba8, [3, 3, 3, 3]);

    expect(pixel.channels).toMatchObject(Uint16Array.from([1, 1, 1, 1]));

    pixel.blend(otherPixel);

    expect(pixel.channels).toMatchObject(
      Uint16Array.from([2, 2, 2, 3]) // Alpha channels are not blended. blend() just picks the highest alpha channel value
    );
    expect(otherPixel.channels).toMatchObject(Uint16Array.from([3, 3, 3, 3]));
  });
});
