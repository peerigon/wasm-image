use image::{imageops::FilterType, io::Reader, DynamicImage, ImageFormat, ImageOutputFormat};
use js_sys::Uint8Array;
use std::{convert::TryInto, io::Cursor};
use wasm_bindgen::prelude::*;
mod color_type;
use color_type::WasmColorType;
mod errors;
mod filter_type;
use filter_type::WasmImageFilterType;
mod image_format;
use image_format::WasmImageFormat;
mod image_output_format;
use image_output_format::WasmImageOutputFormat;

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
    let dynamic_image = image::load_from_memory_with_format(bytes, image_format)
        .map_err(errors::to_js_error)?;

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
        let color_type: WasmColorType = self.instance.color().try_into().map_err(errors::to_js_error)?;

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
}
