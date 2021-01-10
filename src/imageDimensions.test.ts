import { imageDimensions } from "./lib";
import * as images from "./tests/images";

describe("imageDimensions()", () => {
  test("Calculates the image dimensions", async () => {
    expect(
      imageDimensions(await images.read(images.paths.ballPng))
    ).toMatchObject({ width: 100, height: 100 });
    expect(
      imageDimensions(await images.read(images.paths.basi2c08Png))
    ).toMatchObject({ width: 32, height: 32 });
    expect(
      imageDimensions(await images.read(images.paths.catJpg))
    ).toMatchObject({ width: 320, height: 240 });
  });
});
