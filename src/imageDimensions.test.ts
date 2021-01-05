import { imageDimensions } from "./lib";
import * as images from "./tests/images";

describe("imageDimensions()", () => {
  test("Calculates the image dimensions", async () => {
    expect(imageDimensions(await images.readBallPng())).toMatchObject({width: 100, height: 100});
    expect(imageDimensions(await images.readBasi2c08Png())).toMatchObject({width: 32, height: 32});
    expect(imageDimensions(await images.readCatJpg())).toMatchObject({width: 320, height: 240});
  });
});
