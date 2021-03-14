use crate::color_type::WasmColorType;
use crate::errors;
use crate::filter_type::WasmImageFilterType;
use crate::image_output_format::WasmImageOutputFormat;
use image::{imageops::FilterType, DynamicImage, GenericImage, GenericImageView, ImageOutputFormat, Pixel};
use js_sys::{Uint32Array, Uint8Array};
use std::convert::TryInto;
use std::cmp;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmDynamicImage {
    instance: DynamicImage,
}

// Cannot be part of impl WasmDynamicImage because we don't
// want to expose it to JS land.
pub fn new(instance: DynamicImage) -> WasmDynamicImage {
    WasmDynamicImage {
        instance,
    }
}

#[wasm_bindgen]
impl WasmDynamicImage {
    #[wasm_bindgen(js_name = "toBytes")]
    pub fn to_bytes(&self) -> Uint8Array {
        self.instance.as_bytes().into()
    }

    #[wasm_bindgen(js_name = "toFormat")]
    pub fn to_format(&self, format: WasmImageOutputFormat) -> Result<Vec<u8>, JsValue> {
        let mut buffer = vec![];
        let format: ImageOutputFormat = format.try_into().map_err(errors::to_js_error)?;

        self.instance
            .write_to(&mut buffer, format)
            .map_err(errors::to_js_error)?;

        Ok(buffer)
    }

    /// wasm_bindgen currently does not support enums with values.
    /// See https://github.com/rustwasm/wasm-bindgen/issues/2407
    /// This is why we need extra methods for enums that carry values, such as ImageOutputFormat::Jpeg
    #[wasm_bindgen(js_name = "toFormatJpeg")]
    pub fn to_format_jpeg(&self, quality: u8) -> Result<Vec<u8>, JsValue> {
        let mut buffer = vec![];

        self.instance
            .write_to(&mut buffer, ImageOutputFormat::Jpeg(quality))
            .map_err(errors::to_js_error)?;

        Ok(buffer)
    }

    pub fn crop(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.instance = self.instance.crop_imm(x, y, width, height);
    }

    pub fn color(&self) -> Result<WasmColorType, JsValue> {
        let color_type: WasmColorType = self
            .instance
            .color()
            .try_into()
            .map_err(errors::to_js_error)?;

        Ok(color_type)
    }

    pub fn grayscale(&mut self) {
        self.instance = self.instance.grayscale();
    }

    pub fn invert(&mut self) {
        self.instance.invert();
    }

    pub fn resize(
        &mut self,
        nwidth: u32,
        nheight: u32,
        filter: WasmImageFilterType,
    ) -> Result<(), JsValue> {
        let filter: FilterType = filter.try_into().map_err(errors::to_js_error)?;

        self.instance = self.instance.resize(nwidth, nheight, filter);

        Ok(())
    }

    #[wasm_bindgen(js_name = "resizeExact")]
    pub fn resize_exact(
        &mut self,
        nwidth: u32,
        nheight: u32,
        filter: WasmImageFilterType,
    ) -> Result<(), JsValue> {
        let filter: FilterType = filter.try_into().map_err(errors::to_js_error)?;

        self.instance = self.instance.resize_exact(nwidth, nheight, filter);

        Ok(())
    }

    pub fn thumbnail(&mut self, nwidth: u32, nheight: u32) -> Result<(), JsValue> {
        self.instance = self.instance.thumbnail(nwidth, nheight);

        Ok(())
    }

    #[wasm_bindgen(js_name = "thumbnailExact")]
    pub fn thumbnail_exact(&mut self, nwidth: u32, nheight: u32) -> Result<(), JsValue> {
        self.instance = self.instance.thumbnail_exact(nwidth, nheight);

        Ok(())
    }

    pub fn blur(&mut self, sigma: f32) {
        self.instance = self.instance.blur(sigma);
    }

    pub fn unsharpen(&mut self, sigma: f32, threshold: i32) {
        self.instance = self.instance.unsharpen(sigma, threshold);
    }

    pub fn filter3x3(&mut self, kernel: &[f32]) {
        self.instance = self.instance.filter3x3(kernel);
    }

    #[wasm_bindgen(js_name = "adjustContrast")]
    pub fn adjust_contrast(&mut self, contrast: f32) {
        self.instance = self.instance.adjust_contrast(contrast);
    }

    pub fn brighten(&mut self, value: i32) {
        self.instance = self.instance.brighten(value);
    }

    pub fn huerotate(&mut self, value: i32) {
        self.instance = self.instance.huerotate(value);
    }

    pub fn flipv(&mut self) {
        self.instance = self.instance.flipv();
    }

    pub fn fliph(&mut self) {
        self.instance = self.instance.fliph();
    }

    pub fn rotate90(&mut self) {
        self.instance = self.instance.rotate90();
    }

    pub fn rotate180(&mut self) {
        self.instance = self.instance.rotate180();
    }

    pub fn rotate270(&mut self) {
        self.instance = self.instance.rotate270();
    }

    /// The width and height of this image.
    pub fn dimensions(&self) -> Uint32Array {
        let dimensions = self.instance.dimensions();

        (&[dimensions.0, dimensions.1][..]).into()
    }

    /// The width of this image.
    pub fn width(&self) -> u32 {
        self.instance.width()
    }

    /// The height of this image.
    pub fn height(&self) -> u32 {
        self.instance.height()
    }

    /// The bounding rectangle of this image.
    pub fn bounds(&self) -> Uint32Array {
        let bounds = self.instance.bounds();

        (&[bounds.0, bounds.1, bounds.2, bounds.3][..]).into()
    }

    #[wasm_bindgen(js_name = "inBounds")]
    /// Returns true if this x, y coordinate is contained inside the image.
    pub fn in_bounds(&self, x: u32, y: u32) -> bool {
        self.instance.in_bounds(x, y)
    }

    // Implemented in JavaScript
    // pub fn get_pixel(&self, x: u32, y: u32) -> Self::Pixel;

    // Not implemented
    // unsafe fn unsafe_get_pixel(&self, x: u32, y: u32) -> Self::Pixel

    // Implemented in JavaScript
    // pub fn pixels(&self) -> Pixels<Self>

    // Returns an subimage that is an immutable view into this image.
    // You can use [`GenericImage::sub_image`] if you need a mutable view instead.
    // TODO: Implement
    // pub fn view(&self, x: u32, y: u32, width: u32, height: u32) -> SubImage<&Self::InnerImageView> {
    //     SubImage::new(self.inner(), x, y, width, height)
    // }

    // Gets a reference to the mutable pixel at location `(x, y)`
    //
    // # Panics
    //
    // Panics if `(x, y)` is out of bounds.
    // TODO: Implement
    // pub fn get_pixel_mut(&mut self, x: u32, y: u32) -> &mut Self::Pixel;

    // Put a pixel at location (x, y)
    //
    // # Panics
    //
    // Panics if `(x, y)` is out of bounds.
    // TODO: Implement
    // fn put_pixel(&mut self, x: u32, y: u32, pixel: Self::Pixel);

    // Not implemented
    // unsafe fn unsafe_put_pixel(&mut self, x: u32, y: u32, pixel: Self::Pixel) {
    //     self.put_pixel(x, y, pixel);
    // }

    // TODO: Implement
    // pub fn copy_from<O>(&mut self, other: &O, x: u32, y: u32) -> ImageResult<()>
    // where
    //     O: GenericImageView<Pixel = Self::Pixel>,
    // {
    //     // Do bounds checking here so we can use the non-bounds-checking
    //     // functions to copy pixels.
    //     if self.width() < other.width() + x || self.height() < other.height() + y {
    //         return Err(ImageError::Parameter(ParameterError::from_kind(
    //             ParameterErrorKind::DimensionMismatch,
    //         )));
    //     }

    //     for i in 0..other.width() {
    //         for k in 0..other.height() {
    //             let p = other.get_pixel(i, k);
    //             self.put_pixel(i + x, k + y, p);
    //         }
    //     }
    //     Ok(())
    // }

    // Copies all of the pixels from one part of this image to another part of this image.
    //
    // The destination rectangle of the copy is specified with the top-left corner placed at (x, y).
    //
    // # Returns
    // `true` if the copy was successful, `false` if the image could not
    // be copied due to size constraints.
    // TODO: Implement
    // fn copy_within(&mut self, source: Rect, x: u32, y: u32) -> bool {
    //     let Rect { x: sx, y: sy, width, height } = source;
    //     let dx = x;
    //     let dy = y;
    //     assert!(sx < self.width() && dx < self.width());
    //     assert!(sy < self.height() && dy < self.height());
    //     if self.width() - dx.max(sx) < width || self.height() - dy.max(sy) < height {
    //         return false;
    //     }
    //     // since `.rev()` creates a new dype we would either have to go with dynamic dispatch for the ranges
    //     // or have quite a lot of code bloat. A macro gives us static dispatch with less visible bloat.
    //     macro_rules! copy_within_impl_ {
    //         ($xiter:expr, $yiter:expr) => {
    //             for y in $yiter {
    //                 let sy = sy + y;
    //                 let dy = dy + y;
    //                 for x in $xiter {
    //                     let sx = sx + x;
    //                     let dx = dx + x;
    //                     let pixel = self.get_pixel(sx, sy);
    //                     self.put_pixel(dx, dy, pixel);
    //                 }
    //             }
    //         };
    //     }
    //     // check how target and source rectangles relate to each other so we dont overwrite data before we copied it.
    //     match (sx < dx, sy < dy) {
    //         (true, true) => copy_within_impl_!((0..width).rev(), (0..height).rev()),
    //         (true, false) => copy_within_impl_!((0..width).rev(), 0..height),
    //         (false, true) => copy_within_impl_!(0..width, (0..height).rev()),
    //         (false, false) => copy_within_impl_!(0..width, 0..height),
    //     }
    //     true
    // }

    // Returns a mutable subimage that is a view into this image.
    // If you want an immutable subimage instead, use [`GenericImageView::view`]
    // TODO: Implement
    // fn sub_image(
    //     &mut self,
    //     x: u32,
    //     y: u32,
    //     width: u32,
    //     height: u32,
    // ) -> SubImage<&mut Self::InnerImage> {
    //     SubImage::new(self.inner_mut(), x, y, width, height)
    // }

    // --------------------------------------------------------------
    // Pixel

    #[wasm_bindgen(js_name = "pixelGetChannels")]
    /// Returns the color bytes as Uint8Array
    pub fn pixel_get_channels(&self, x: u32, y: u32) -> Uint8Array {
        self.instance.get_pixel(x, y).channels().into()
    }

    #[wasm_bindgen(js_name = "pixelSetChannels")]
    /// Sets the color bytes as Uint8Array
    pub fn pixel_set_channels(&mut self, x: u32, y: u32, new_channels: &Uint8Array) {
        let mut pixel = self.instance.get_pixel(x, y);
        let current_channels = pixel.channels_mut();
        let length = cmp::min(current_channels.len(), new_channels.length() as usize);
        
        for i in 0..length {
            current_channels[i] = new_channels.get_index(i as u32);
        }

        // get_pixel() actually returns a copy of the pixel which is why
        // we need to put the pixel back again into the image
        self.instance.put_pixel(x, y, pixel);
    }

    // Not implemented
    // fn pixel_from_slice(slice: &[Self::Subpixel]) -> &Self;

    // Not implemented
    // fn pixel_from_slice_mut(slice: &mut [Self::Subpixel]) -> &mut Self;

    // Not implemented
    // fn pixel_to_rgb(&self) -> Rgb<Self::Subpixel>;

    // Not implemented
    // fn pixel_to_rgba(&self) -> Rgba<Self::Subpixel>;

    // Not implemented
    // fn pixel_to_luma(&self) -> Luma<Self::Subpixel>;

    // Not implemented
    // fn pixel_to_luma_alpha(&self) -> LumaA<Self::Subpixel>;

    // Not implemented
    // fn pixel_to_bgr(&self) -> Bgr<Self::Subpixel>;

    // Not implemented
    // fn pixel_to_bgra(&self) -> Bgra<Self::Subpixel>;

    // Not implemented, use apply()
    // fn pixel_map(&self, f: &js_sys::Function) -> Self;

    // Implemented in JavaScript
    // fn pixel_apply(&mut self, x: u32, y: u32, f: &js_sys::Function);

    // Not implemented
    // fn pixel_map_with_alpha<F, G>(&self, f: F, g: G) -> Self;

    // Implemented in JavaScript
    // fn pixel_apply_with_alpha<F, G>(&mut self, f: F, g: G);

    // Not implemented
    // fn pixel_map_without_alpha<F>(&self, f: F) -> Self
    // where
    //     F: FnMut(Self::Subpixel) -> Self::Subpixel,
    // {
    //     let mut this = *self;
    //     this.apply_with_alpha(f, |x| x);
    //     this
    // }

    // Implemented in JavaScript
    // fn pixel_apply_without_alpha<F>(&mut self, f: F)
    // where
    //     F: FnMut(Self::Subpixel) -> Self::Subpixel,
    // {
    //     self.apply_with_alpha(f, |x| x);
    // }

    // Not implemented
    // fn pixel_map2<F>(&self, other: &Self, f: F) -> Self
    // where
    //     F: FnMut(Self::Subpixel, Self::Subpixel) -> Self::Subpixel;

    // Implemented in JavaScript
    // fn pixel_apply2<F>(&mut self, other: &Self, f: F)
    // where
    //     F: FnMut(Self::Subpixel, Self::Subpixel) -> Self::Subpixel;

    #[wasm_bindgen(js_name = "pixelInvert")]
    pub fn pixel_invert(&mut self, x: u32, y: u32) {
        let mut pixel = self.instance.get_pixel(x, y);
        
        pixel.invert();

        // get_pixel() actually returns a copy of the pixel which is why
        // we need to put the pixel back again into the image
        self.instance.put_pixel(x, y, pixel);
    }

    #[wasm_bindgen(js_name = "pixelBlend")]
    pub fn blend(&mut self, x: u32, y: u32, other_x: u32, other_y: u32) {
        let mut pixel = self.instance.get_pixel(x, y);
        let other_pixel = self.instance.get_pixel(other_x, other_y);

        pixel.blend(&other_pixel);

        // get_pixel() actually returns a copy of the pixel which is why
        // we need to put the pixel back again into the image
        self.instance.put_pixel(x, y, pixel);
    }
}
