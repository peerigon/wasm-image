use wasm_bindgen::prelude::*;
use crate::dynamic_image::{WasmDynamicImage};

#[wasm_bindgen]
impl WasmDynamicImage {
    // fn selected_pixel(&self) {
    //     let pos = self.selected_pixel_position;

    //     self.instance.dynamic_image.get_pixel()
    // }

    // /// Returns the components as a slice.
    // pub fn channels(&self) -> &[Self::Subpixel] {
    //     self.instance.dynamic_image.get_pixel()
    // }

//     /// Returns the components as a mutable slice
//     fn channels_mut(&mut self) -> &mut [Self::Subpixel];

//     /// A string that can help to interpret the meaning each channel
//     /// See [gimp babl](http://gegl.org/babl/).
//     const COLOR_MODEL: &'static str;
//     /// Returns a string that can help to interpret the meaning each channel
//     /// See [gimp babl](http://gegl.org/babl/).
//     #[deprecated(note="please use COLOR_MODEL associated constant")]
//     fn color_model() -> &'static str {
//         Self::COLOR_MODEL
//     }

//     /// ColorType for this pixel format
//     const COLOR_TYPE: ColorType;
//     /// Returns the ColorType for this pixel format
//     #[deprecated(note="please use COLOR_TYPE associated constant")]
//     fn color_type() -> ColorType {
//         Self::COLOR_TYPE
//     }

//     /// Returns the channels of this pixel as a 4 tuple. If the pixel
//     /// has less than 4 channels the remainder is filled with the maximum value
//     ///
//     /// TODO deprecate
//     fn channels4(
//         &self,
//     ) -> (
//         Self::Subpixel,
//         Self::Subpixel,
//         Self::Subpixel,
//         Self::Subpixel,
//     );

//     /// Construct a pixel from the 4 channels a, b, c and d.
//     /// If the pixel does not contain 4 channels the extra are ignored.
//     ///
//     /// TODO deprecate
//     fn from_channels(
//         a: Self::Subpixel,
//         b: Self::Subpixel,
//         c: Self::Subpixel,
//         d: Self::Subpixel,
//     ) -> Self;

//     /// Returns a view into a slice.
//     ///
//     /// Note: The slice length is not checked on creation. Thus the caller has to ensure
//     /// that the slice is long enough to prevent panics if the pixel is used later on.
//     fn from_slice(slice: &[Self::Subpixel]) -> &Self;

//     /// Returns mutable view into a mutable slice.
//     ///
//     /// Note: The slice length is not checked on creation. Thus the caller has to ensure
//     /// that the slice is long enough to prevent panics if the pixel is used later on.
//     fn from_slice_mut(slice: &mut [Self::Subpixel]) -> &mut Self;

//     /// Convert this pixel to RGB
//     fn to_rgb(&self) -> Rgb<Self::Subpixel>;

//     /// Convert this pixel to RGB with an alpha channel
//     fn to_rgba(&self) -> Rgba<Self::Subpixel>;

//     /// Convert this pixel to luma
//     fn to_luma(&self) -> Luma<Self::Subpixel>;

//     /// Convert this pixel to luma with an alpha channel
//     fn to_luma_alpha(&self) -> LumaA<Self::Subpixel>;

//     /// Convert this pixel to BGR
//     fn to_bgr(&self) -> Bgr<Self::Subpixel>;

//     /// Convert this pixel to BGR with an alpha channel
//     fn to_bgra(&self) -> Bgra<Self::Subpixel>;

//     /// Apply the function ```f``` to each channel of this pixel.
//     fn map<F>(&self, f: F) -> Self
//     where
//         F: FnMut(Self::Subpixel) -> Self::Subpixel;

//     /// Apply the function ```f``` to each channel of this pixel.
//     fn apply<F>(&mut self, f: F)
//     where
//         F: FnMut(Self::Subpixel) -> Self::Subpixel;

//     /// Apply the function ```f``` to each channel except the alpha channel.
//     /// Apply the function ```g``` to the alpha channel.
//     fn map_with_alpha<F, G>(&self, f: F, g: G) -> Self
//     where
//         F: FnMut(Self::Subpixel) -> Self::Subpixel,
//         G: FnMut(Self::Subpixel) -> Self::Subpixel;

//     /// Apply the function ```f``` to each channel except the alpha channel.
//     /// Apply the function ```g``` to the alpha channel. Works in-place.
//     fn apply_with_alpha<F, G>(&mut self, f: F, g: G)
//     where
//         F: FnMut(Self::Subpixel) -> Self::Subpixel,
//         G: FnMut(Self::Subpixel) -> Self::Subpixel;

//     /// Apply the function ```f``` to each channel except the alpha channel.
//     fn map_without_alpha<F>(&self, f: F) -> Self
//     where
//         F: FnMut(Self::Subpixel) -> Self::Subpixel,
//     {
//         let mut this = *self;
//         this.apply_with_alpha(f, |x| x);
//         this
//     }

//     /// Apply the function ```f``` to each channel except the alpha channel.
//     /// Works in place.
//     fn apply_without_alpha<F>(&mut self, f: F)
//     where
//         F: FnMut(Self::Subpixel) -> Self::Subpixel,
//     {
//         self.apply_with_alpha(f, |x| x);
//     }

//     /// Apply the function ```f``` to each channel of this pixel and
//     /// ```other``` pairwise.
//     fn map2<F>(&self, other: &Self, f: F) -> Self
//     where
//         F: FnMut(Self::Subpixel, Self::Subpixel) -> Self::Subpixel;

//     /// Apply the function ```f``` to each channel of this pixel and
//     /// ```other``` pairwise. Works in-place.
//     fn apply2<F>(&mut self, other: &Self, f: F)
//     where
//         F: FnMut(Self::Subpixel, Self::Subpixel) -> Self::Subpixel;

//     /// Invert this pixel
//     fn invert(&mut self);

//     /// Blend the color of a given pixel into ourself, taking into account alpha channels
//     fn blend(&mut self, other: &Self);
// }
}
