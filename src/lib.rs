use image::{imageops::FilterType, io::Reader, DynamicImage, ImageFormat, ImageOutputFormat, GenericImageView};
use js_sys::Uint8Array;
use std::{convert::TryInto, io::Cursor};
use wasm_bindgen::prelude::*;
mod bounds;
use bounds::WasmBounds;
mod color_type;
use color_type::WasmColorType;
mod dimensions;
use dimensions::WasmDimensions;
mod errors;
mod filter_type;
use filter_type::WasmImageFilterType;
mod image_format;
use image_format::WasmImageFormat;
mod image_output_format;
use image_output_format::WasmImageOutputFormat;
mod pixel;
use pixel::WasmPixel;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen(js_name = "guessFormat")]
pub fn guess_format(bytes: &[u8]) -> Result<WasmImageFormat, JsValue> {
    set_panic_hook();

    let format = image::guess_format(bytes).map_err(errors::to_js_error)?;

    Ok(format.try_into().map_err(errors::to_js_error)?)
}

#[wasm_bindgen(js_name = "imageDimensions")]
pub fn image_dimensions(bytes: &[u8]) -> Result<Box<[u32]>, JsValue> {
    set_panic_hook();

    let reader = Reader::new(Cursor::new(bytes));
    let dimensions = reader
        .with_guessed_format()
        .map_err(errors::to_js_error)?
        .into_dimensions()
        .map_err(errors::to_js_error)?;

    Ok(Box::new([dimensions.0, dimensions.1]))
}

#[wasm_bindgen(js_name = "loadFromMemory")]
pub fn load_from_memory(bytes: &[u8]) -> Result<WasmDynamicImage, JsValue> {
    set_panic_hook();

    let dynamic_image = image::load_from_memory(bytes).map_err(errors::to_js_error)?;

    Ok(WasmDynamicImage {
        instance: dynamic_image,
    })
}

#[wasm_bindgen(js_name = "loadFromMemoryWithFormat")]
pub fn load_from_memory_with_format(
    bytes: &[u8],
    format: WasmImageFormat,
) -> Result<WasmDynamicImage, JsValue> {
    set_panic_hook();

    let image_format: ImageFormat = format.try_into().map_err(errors::to_js_error)?;
    let dynamic_image =
        image::load_from_memory_with_format(bytes, image_format).map_err(errors::to_js_error)?;

    Ok(WasmDynamicImage {
        instance: dynamic_image,
    })
}

#[wasm_bindgen]
pub struct WasmDynamicImage {
    instance: DynamicImage,
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
    pub fn dimensions(&self) -> WasmDimensions {
        self.instance.dimensions().into()
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
    pub fn bounds(&self) -> WasmBounds {
        self.instance.bounds().into()
    }

    /// Returns true if this x, y coordinate is contained inside the image.
    pub fn in_bounds(&self, x: u32, y: u32) -> bool {
        self.instance.in_bounds(x, y)
    }

    // Returns the pixel located at (x, y)
    //
    // # Panics
    //
    // Panics if `(x, y)` is out of bounds.
    //
    // TODO: Implement
    // pub fn get_pixel(&self, x: u32, y: u32) -> Self::Pixel;

    // Returns the pixel located at (x, y)
    //
    // This function can be implemented in a way that ignores bounds checking.
    // # Safety
    //
    // The coordinates must be [`in_bounds`] of the image.
    //
    // [`in_bounds`]: #method.in_bounds
    // unsafe fn unsafe_get_pixel(&self, x: u32, y: u32) -> Self::Pixel {
    //     self.get_pixel(x, y)
    // }

    // Returns an Iterator over the pixels of this image.
    // The iterator yields the coordinates of each pixel
    // along with their value
    // TODO: Implement
    // pub fn pixels(&self) -> Pixels<Self> {
    //     let (width, height) = self.dimensions();

    //     Pixels {
    //         image: self,
    //         x: 0,
    //         y: 0,
    //         width,
    //         height,
    //     }
    // }

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

    // Puts a pixel at location (x, y)
    //
    // This function can be implemented in a way that ignores bounds checking.
    // # Safety
    //
    // The coordinates must be [`in_bounds`] of the image.
    //
    // [`in_bounds`]: traits.GenericImageView.html#method.in_bounds
    // unsafe fn unsafe_put_pixel(&mut self, x: u32, y: u32, pixel: Self::Pixel) {
    //     self.put_pixel(x, y, pixel);
    // }

    // Copies all of the pixels from another image into this image.
    //
    // The other image is copied with the top-left corner of the
    // other image placed at (x, y).
    //
    // In order to copy only a piece of the other image, use [`GenericImageView::view`].
    //
    // You can use [`FlatSamples`] to source pixels from an arbitrary regular raster of channel
    // values, for example from a foreign interface or a fixed image.
    //
    // # Returns
    // Returns an error if the image is too large to be copied at the given position
    //
    // [`GenericImageView::view`]: trait.GenericImageView.html#method.view
    // [`FlatSamples`]: flat/struct.FlatSamples.html
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
}
