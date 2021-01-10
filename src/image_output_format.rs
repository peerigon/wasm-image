use std::convert::TryFrom;
use image::ImageOutputFormat;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, PartialEq, Eq, Debug)]
pub enum WasmImageOutputFormat {
    // #[cfg(feature = "png")]
    /// An Image in PNG Format
    Png,

    // #[cfg(feature = "jpeg")]
    /// An Image in JPEG Format with specified quality
    Jpeg,

    // #[cfg(feature = "pnm")]
    // /// An Image in one of the PNM Formats
    // Pnm(PNMSubtype),

    // #[cfg(feature = "gif")]
    /// An Image in GIF Format
    Gif,

    // #[cfg(feature = "ico")]
    /// An Image in ICO Format
    Ico,

    // #[cfg(feature = "bmp")]
    /// An Image in BMP Format
    Bmp,

    // #[cfg(feature = "farbfeld")]
    // /// An Image in farbfeld Format
    // Farbfeld,

    // #[cfg(feature = "tga")]
    // /// An Image in TGA Format
    // Tga,

    // #[cfg(feature = "avif")]
    /// An image in AVIF Format
    Avif,
}

impl TryFrom<WasmImageOutputFormat> for ImageOutputFormat {
    type Error = &'static str;

    fn try_from(wasm_image_format: WasmImageOutputFormat) -> Result<Self, Self::Error> {
        match wasm_image_format {
            // #[cfg(feature = "png")]
            WasmImageOutputFormat::Png => Ok(ImageOutputFormat::Png),
            // #[cfg(feature = "jpeg")]
            WasmImageOutputFormat::Jpeg => Ok(ImageOutputFormat::Jpeg(75)),
            // #[cfg(feature = "gif")]
            WasmImageOutputFormat::Gif => Ok(ImageOutputFormat::Gif),
            // #[cfg(feature = "pnm")]
            // WasmImageOutputFormat::Pnm => Ok(ImageOutputFormat::Pnm),
            // #[cfg(feature = "bmp")]
            WasmImageOutputFormat::Bmp => Ok(ImageOutputFormat::Bmp),
            // #[cfg(feature = "ico")]
            WasmImageOutputFormat::Ico => Ok(ImageOutputFormat::Ico),
            // #[cfg(feature = "farbfeld")]
            // WasmImageOutputFormat::Farbfeld => Ok(ImageOutputFormat::Farbfeld),
            // #[cfg(feature = "avif")]
            WasmImageOutputFormat::Avif => Ok(ImageOutputFormat::Avif),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported image format"),
        }
    }
}

impl TryFrom<ImageOutputFormat> for WasmImageOutputFormat {
    type Error = &'static str;

    fn try_from(image_format: ImageOutputFormat) -> Result<Self, Self::Error> {
        match image_format {
            #[cfg(feature = "png")]
            ImageOutputFormat::Png => Ok(WasmImageOutputFormat::Png),
            #[cfg(feature = "jpeg")]
            ImageOutputFormat::Jpeg => Ok(WasmImageOutputFormat::Jpeg),
            #[cfg(feature = "gif")]
            ImageOutputFormat::Gif => Ok(WasmImageOutputFormat::Gif),
            #[cfg(feature = "webp")]
            ImageOutputFormat::WebP => Ok(WasmImageOutputFormat::WebP),
            // #[cfg(feature = "pnm")]
            // ImageOutputFormat::Pnm => Ok(WasmImageOutputFormat::Pnm),
            #[cfg(feature = "tiff")]
            ImageOutputFormat::Tiff => Ok(WasmImageOutputFormat::Tiff),
            // #[cfg(feature = "tga")]
            // ImageOutputFormat::Tga => Ok(WasmImageOutputFormat::Tga),
            // #[cfg(feature = "dds")]
            // ImageOutputFormat::Dds => Ok(WasmImageOutputFormat::Dds),
            #[cfg(feature = "bmp")]
            ImageOutputFormat::Bmp => Ok(WasmImageOutputFormat::Bmp),
            #[cfg(feature = "ico")]
            ImageOutputFormat::Ico => Ok(WasmImageOutputFormat::Ico),
            // #[cfg(feature = "hdr")]
            // ImageOutputFormat::Hdr => Ok(WasmImageOutputFormat::Hdr),
            // #[cfg(feature = "farbfeld")]
            // ImageOutputFormat::Farbfeld => Ok(WasmImageOutputFormat::Farbfeld),
            #[cfg(feature = "avif")]
            ImageOutputFormat::Avif => Ok(WasmImageOutputFormat::Avif),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported image format"),
        }
    }
}