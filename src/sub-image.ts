import { Bounds } from "./bounds";
import { DynamicImage } from "./dynamic-image";
import { wasmDynamicImage } from "./symbols";
import { Pixel } from "./pixel";
import { Position } from "./position";
import { Channels, channelsToUint8Array } from "./channels";

export class SubImage implements Bounds {
  // We stick as close as possible with https://docs.rs/image/0.23.14/image/struct.SubImage.html
  // eslint-disable-next-line max-params
  constructor(
    private readonly image: DynamicImage,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  // Not implemented since you can just change x, y, width and height directly
  // changeBounds = (
  //   x: number,
  //   y: number,
  //   width: number,
  //   height: number
  // ) => {}

  getPixel = ({x, y}: Position) =>
    new Pixel(this.image[wasmDynamicImage], this.x + x, this.y + y);

  putPixel = ({x, y}: Position, pixel: Pixel) => {
  }

  putChannels = ({x, y}: Position, channels: Channels) => {
    this.image[wasmDynamicImage].pixelSetChannels(x, y, channelsToUint8Array(channels));
  };

  // fn put_pixel(&mut self, x: u32, y: u32, pixel: Self::Pixel) {
  //     self.image
  //         .put_pixel(x + self.xoffset, y + self.yoffset, pixel)
  // }

  // /// DEPRECATED: This method will be removed. Blend the pixel directly instead.
  // fn blend_pixel(&mut self, x: u32, y: u32, pixel: Self::Pixel) {
  //     self.image
  //         .blend_pixel(x + self.xoffset, y + self.yoffset, pixel)
  // }

  // fn sub_image(
  //     &mut self,
  //     x: u32,
  //     y: u32,
  //     width: u32,
  //     height: u32,
  // ) -> SubImage<&mut Self::InnerImage> {
  //     let x = self.xoffset + x;
  //     let y = self.yoffset + y;
  //     SubImage::new(self.inner_mut(), x, y, width, height)
  // }

  // fn inner_mut(&mut self) -> &mut Self::InnerImage {
  //     &mut self.image
  // }
}
