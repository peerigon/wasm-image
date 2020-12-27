import { imageDimensions } from "./lib";
import * as images from "./tests/images";

describe("imageDimensions()", () => {
  test("Calculates the image dimensions", async () => {
    expect(imageDimensions(await images.ballPng())).toMatchObject({width: 100, height: 100});
    expect(imageDimensions(await images.basi2c08Png())).toMatchObject({width: 32, height: 32});
    expect(imageDimensions(await images.catJpg())).toMatchObject({width: 320, height: 240});
  });
});
