use std::convert::TryFrom;
use image::ImageFormat;
use wasm_bindgen::prelude::*;

// Enums are not properly translated into TypeScript :(
// https://github.com/rustwasm/wasm-bindgen/issues/2154
#[wasm_bindgen]
pub enum WasmImageFormat {
    Png,
    Jpeg,
    Gif,
    WebP,
    Tiff,
    Bmp,
    Ico,
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
            WasmImageFormat::Tiff => Ok(ImageFormat::Tiff),
            WasmImageFormat::Bmp => Ok(ImageFormat::Bmp),
            WasmImageFormat::Ico => Ok(ImageFormat::Ico),
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
            ImageFormat::Tiff => Ok(WasmImageFormat::Tiff),
            ImageFormat::Bmp => Ok(WasmImageFormat::Bmp),
            ImageFormat::Ico => Ok(WasmImageFormat::Ico),
            ImageFormat::Avif => Ok(WasmImageFormat::Avif),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported image format"),
        }
    }
}