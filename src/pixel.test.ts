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

  test("color", async () => {
    const image = await createInstance(images.paths.rgb16bitPng);
    const pixel = image.getPixel({ x: 0, y: 0 });
    const color = pixel.color;

    expect(color.type).toBe(ColorType.Rgb16);
    expect(color.channelCount).toBe(3);
  });

  test("toLuma()", () => {
    const pixel8 = Pixel.fromChannels(ColorType.Rgba8, [255, 0, 255, 100]);
    const lumaPixel8 = pixel8.toLuma();

    expect(lumaPixel8.channels).toMatchObject(Uint8Array.from([72]));

    const pixel16 = Pixel.fromChannels(ColorType.Rgba16, [
      30000,
      0,
      30000,
      100,
    ]);
    const lumaPixel16 = pixel16.toLuma();

    expect(lumaPixel16.channels).toMatchObject(Uint16Array.from([8544]));
  });

  test("toLumaAlpha()", () => {
    const pixel8 = Pixel.fromChannels(ColorType.Rgba8, [255, 0, 255, 100]);
    const lumaAlphaPixel8 = pixel8.toLumaAlpha();

    expect(lumaAlphaPixel8.channels).toMatchObject(Uint8Array.from([72, 100]));

    const pixel16 = Pixel.fromChannels(ColorType.Rgba16, [
      30000,
      0,
      30000,
      100,
    ]);
    const lumaAlphaPixel16 = pixel16.toLumaAlpha();

    expect(lumaAlphaPixel16.channels).toMatchObject(
      Uint16Array.from([8544, 100])
    );
  });

  test("toRgb()", () => {
    const pixel8 = Pixel.fromChannels(ColorType.Rgba8, [255, 0, 255, 100]);
    const rgbPixel8 = pixel8.toRgb();

    expect(rgbPixel8.channels).toMatchObject(Uint8Array.from([255, 0, 255]));

    const pixel16 = Pixel.fromChannels(ColorType.Rgba16, [
      30000,
      0,
      30000,
      100,
    ]);
    const rgbPixel16 = pixel16.toRgb();

    expect(rgbPixel16.channels).toMatchObject(
      Uint16Array.from([30000, 0, 30000])
    );
  });

  test("toRgba()", () => {
    const pixel8 = Pixel.fromChannels(ColorType.Rgb8, [255, 0, 255]);
    const rgbaPixel8 = pixel8.toRgba();

    expect(rgbaPixel8.channels).toMatchObject(
      Uint8Array.from([255, 0, 255, 255])
    );

    const pixel16 = Pixel.fromChannels(ColorType.Rgb16, [30000, 0, 30000]);
    const rgbaPixel16 = pixel16.toRgba();

    expect(rgbaPixel16.channels).toMatchObject(
      Uint16Array.from([30000, 0, 30000, 65535])
    );
  });

  test("toBgr()", () => {
    const pixel8 = Pixel.fromChannels(ColorType.Rgba8, [1, 2, 3, 4]);
    const bgrPixel8 = pixel8.toBgr();

    expect(bgrPixel8.channels).toMatchObject(Uint8Array.from([3, 2, 1]));

    const pixel16 = Pixel.fromChannels(ColorType.Rgba16, [
      10000,
      20000,
      30000,
      40000,
    ]);

    expect(() => pixel16.toBgr()).toThrowErrorMatchingInlineSnapshot(
      `"toBgr() not implemented for 16-bit images"`
    );
  });

  test("toBgra()", () => {
    const pixel8 = Pixel.fromChannels(ColorType.Rgb8, [1, 2, 3]);
    const bgraPixel8 = pixel8.toBgra();

    expect(bgraPixel8.channels).toMatchObject(Uint8Array.from([3, 2, 1, 255]));

    const pixel16 = Pixel.fromChannels(ColorType.Rgb16, [10000, 20000, 30000]);

    expect(() => pixel16.toBgra()).toThrowErrorMatchingInlineSnapshot(
      `"toBgra() not implemented for 16-bit images"`
    );
  });

  test("map()", async () => {
    // map() is called during apply() that's why we don't have an extra test for map()
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

  test("map2()", () => {
    // map2() is called during apply2() that's why we don't have an extra test for map2()
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
