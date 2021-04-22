use std::convert::TryFrom;
use image::ImageOutputFormat;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum WasmImageOutputFormat {
    Png,
    Jpeg,
    Gif,
    Ico,
    Bmp,
    Avif,
}

impl TryFrom<WasmImageOutputFormat> for ImageOutputFormat {
    type Error = &'static str;

    fn try_from(wasm_image_format: WasmImageOutputFormat) -> Result<Self, Self::Error> {
        match wasm_image_format {
            #[cfg(feature = "image/png")]
            WasmImageOutputFormat::Png => Ok(ImageOutputFormat::Png),
            #[cfg(feature = "image/jpeg")]
            WasmImageOutputFormat::Jpeg => Ok(ImageOutputFormat::Jpeg(75)),
            #[cfg(feature = "image/gif")]
            WasmImageOutputFormat::Gif => Ok(ImageOutputFormat::Gif),
            #[cfg(feature = "image/bmp")]
            WasmImageOutputFormat::Bmp => Ok(ImageOutputFormat::Bmp),
            #[cfg(feature = "image/ico")]
            WasmImageOutputFormat::Ico => Ok(ImageOutputFormat::Ico),
            #[cfg(feature = "image/avif")]
            WasmImageOutputFormat::Avif => Ok(ImageOutputFormat::Avif),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported image format"),
        }
    }
}
