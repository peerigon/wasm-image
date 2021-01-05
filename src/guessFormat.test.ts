import { guessFormat, WasmImageFormat } from "./lib";
import * as images from "./tests/images";

describe("guessFormat()", () => {
  const expectFormat = (format: WasmImageFormat) => (buffer: Buffer) =>{
    expect(guessFormat(buffer)).toBe(format);
  };

  test("Detects jpg", async () => {
    const buffers = await Promise.all([
      images.readCatJpg()
    ]);

    buffers.forEach(expectFormat(WasmImageFormat.Jpeg));
  });

  test("Detects png", async () => {
    const buffers = await Promise.all([
      images.readBallPng(),
      images.readBasi2c08Png()
    ]);

    buffers.forEach(expectFormat(WasmImageFormat.Png));
  });
});
