
use image::{Rgb, Rgba, Luma, LumaA, Bgr, Bgra};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum WasmPixel {
    Rgb(Rgb<u8>),
    /// Sendable Rgb + alpha channel image buffer
    Rgba(Rgba<u8>),
    /// Sendable grayscale image buffer
    Luma(Luma<u8>),
    /// Sendable grayscale + alpha channel image buffer
    LumaA(LumaA<u8>),
    /// Sendable Bgr image buffer
    Bgr(Bgr<u8>),
    /// Sendable Bgr + alpha channel image buffer
    Bgra(Bgra<u8>),
    /// Sendable 16-bit Rgb image buffer
    Rgb(Rgb<u16>),
    /// Sendable 16-bit Rgb + alpha channel image buffer
    Rgba(Rgba<u16>),
    /// Sendable 16-bit grayscale image buffer
    Luma(Luma<u16>),
    /// Sendable 16-bit grayscale + alpha channel image buffer
    LumaA(LumaA<u16>),
}

// #[wasm_bindgen]
// pub struct WasmPixel {
//     instance: Box<dyn Pixel>
// }

// #[wasm_bindgen]
// impl Pixel for WasmPixel {
//     type Bla: Pixel;

//     /// The number of channels of this pixel type.
//     const CHANNEL_COUNT: u8;
//     /// Returns the number of channels of this pixel type.
//     #[deprecated(note="please use CHANNEL_COUNT associated constant")]
//     fn channel_count() -> u8 {
//         Self::CHANNEL_COUNT
//     }

//     /// Returns the components as a slice.
//     fn channels(&self) -> &[Self::Subpixel];

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