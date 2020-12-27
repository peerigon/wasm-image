use image::{io::Reader, DynamicImage, ImageError, ImageFormat};
use js_sys::Error as JsError;
use std::{
    convert::{TryFrom, TryInto},
    io::{Cursor, Error as IoError},
};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct WasmImage {
    dynamic_image: DynamicImage,
}

// Enums are not properly translated into TypeScript :(
// https://github.com/rustwasm/wasm-bindgen/issues/2154
#[wasm_bindgen]
pub enum WasmImageFormat {
    /// An Image in PNG Format
    Png,

    /// An Image in JPEG Format
    Jpeg,

    /// An Image in GIF Format
    Gif,

    /// An Image in WEBP Format
    WebP,

    /// An Image in general PNM Format
    Pnm,

    /// An Image in TIFF Format
    Tiff,

    /// An Image in TGA Format
    Tga,

    /// An Image in DDS Format
    Dds,

    /// An Image in BMP Format
    Bmp,

    /// An Image in ICO Format
    Ico,

    /// An Image in Radiance HDR Format
    Hdr,

    /// An Image in farbfeld Format
    Farbfeld,

    /// An Image in AVIF format.
    Avif,
}

impl TryFrom<WasmImageFormat> for ImageFormat {
    type Error = &'static str;

    fn try_from(wasm_image_format: WasmImageFormat) -> Result<Self, Self::Error> {
        match wasm_image_format {
            WasmImageFormat::Png => Ok(ImageFormat::Png),
            WasmImageFormat::Jpeg => Ok(ImageFormat::Jpeg),
            WasmImageFormat::Gif => Ok(ImageFormat::Gif),
            WasmImageFormat::WebP => Ok(ImageFormat::WebP),
            WasmImageFormat::Pnm => Ok(ImageFormat::Pnm),
            WasmImageFormat::Tiff => Ok(ImageFormat::Tiff),
            WasmImageFormat::Tga => Ok(ImageFormat::Tga),
            WasmImageFormat::Dds => Ok(ImageFormat::Dds),
            WasmImageFormat::Bmp => Ok(ImageFormat::Bmp),
            WasmImageFormat::Ico => Ok(ImageFormat::Ico),
            WasmImageFormat::Hdr => Ok(ImageFormat::Hdr),
            WasmImageFormat::Farbfeld => Ok(ImageFormat::Farbfeld),
            WasmImageFormat::Avif => Ok(ImageFormat::Avif),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported image format"),
        }
    }
}

impl TryFrom<ImageFormat> for WasmImageFormat {
    type Error = &'static str;

    fn try_from(image_format: ImageFormat) -> Result<Self, Self::Error> {
        match image_format {
            ImageFormat::Png => Ok(WasmImageFormat::Png),
            ImageFormat::Jpeg => Ok(WasmImageFormat::Jpeg),
            ImageFormat::Gif => Ok(WasmImageFormat::Gif),
            ImageFormat::WebP => Ok(WasmImageFormat::WebP),
            ImageFormat::Pnm => Ok(WasmImageFormat::Pnm),
            ImageFormat::Tiff => Ok(WasmImageFormat::Tiff),
            ImageFormat::Tga => Ok(WasmImageFormat::Tga),
            ImageFormat::Dds => Ok(WasmImageFormat::Dds),
            ImageFormat::Bmp => Ok(WasmImageFormat::Bmp),
            ImageFormat::Ico => Ok(WasmImageFormat::Ico),
            ImageFormat::Hdr => Ok(WasmImageFormat::Hdr),
            ImageFormat::Farbfeld => Ok(WasmImageFormat::Farbfeld),
            ImageFormat::Avif => Ok(WasmImageFormat::Avif),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported image format"),
        }
    }
}

fn image_error_to_js_error(image_error: ImageError) -> JsError {
    JsError::new(&image_error.to_string())
}

fn io_error_to_js_error(io_error: IoError) -> JsError {
    JsError::new(&io_error.to_string())
}

fn message_to_js_error(message: &str) -> JsError {
    JsError::new(&message.to_string())
}

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
pub fn guess_format(buffer: &[u8]) -> Result<WasmImageFormat, JsValue> {
    let format = image::guess_format(buffer).map_err(image_error_to_js_error)?;

    Ok(format.try_into().map_err(message_to_js_error)?)
}

#[wasm_bindgen]
pub struct ImageDimensions(pub u32, pub u32);

#[wasm_bindgen(js_name = "imageDimensions")]
pub fn image_dimensions(buffer: &[u8]) -> Result<Box<[u32]>, JsValue> {
    let reader = Reader::new(Cursor::new(buffer));
    let dimensions = reader
        .with_guessed_format()
        .map_err(io_error_to_js_error)?
        .into_dimensions()
        .map_err(image_error_to_js_error)?;

    Ok(Box::new([dimensions.0, dimensions.1]))
}

#[wasm_bindgen]
impl WasmImage {
    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Vec<u8>) -> Result<WasmImage, JsValue> {
        set_panic_hook();

        let dynamic_image = image::load_from_memory(&bytes).map_err(image_error_to_js_error)?;

        Ok(WasmImage { dynamic_image })
    }

    #[wasm_bindgen(js_name = "fromBytesWithFormat")]
    pub fn from_bytes_with_format(
        buffer: Vec<u8>,
        format: WasmImageFormat,
    ) -> Result<WasmImage, JsValue> {
        set_panic_hook();

        let image_format = format.try_into().map_err(message_to_js_error)?;
        let dynamic_image = image::load_from_memory_with_format(&buffer, image_format)
            .map_err(image_error_to_js_error)?;

        Ok(WasmImage { dynamic_image })
    }

    #[wasm_bindgen(js_name = "getBytes")]
    pub fn get_bytes(self) -> Vec<u8> {
        self.dynamic_image.into_bytes()
    }

    pub fn grayscale(&mut self) {
        self.dynamic_image = self.dynamic_image.grayscale();
    }

    pub fn dispose(self) {
        // TODO: Check if this is necessary
        drop(self);
    }
}
