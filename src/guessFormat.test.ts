import { guessFormat, ImageFormat } from "./lib";
import * as images from "./tests/images";

describe("guessFormat()", () => {
  const expectFormat = (format: ImageFormat) => (buffer: Buffer) =>{
    expect(guessFormat(buffer)).toBe(format);
  };

  test("Detects jpg", async () => {
    const buffers = await Promise.all([
      await images.read(images.paths.catJpg)
    ]);

    buffers.forEach(expectFormat(ImageFormat.Jpeg));
  });

  test("Detects png", async () => {
    const buffers = await Promise.all([
      await images.read(images.paths.ballPng),
      await images.read(images.paths.basi2c08Png)
    ]);

    buffers.forEach(expectFormat(ImageFormat.Png));
  });
});
