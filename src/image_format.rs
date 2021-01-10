use std::convert::TryFrom;
use image::ImageFormat;
use wasm_bindgen::prelude::*;

// Enums are not properly translated into TypeScript :(
// https://github.com/rustwasm/wasm-bindgen/issues/2154
#[wasm_bindgen]
#[derive(Clone, PartialEq, Eq, Debug)]
pub enum WasmImageFormat {
    // #[cfg(feature = "png")]
    /// An Image in PNG Format
    Png,

    // #[cfg(feature = "jpeg")]
    /// An Image in JPEG Format
    Jpeg,

    // #[cfg(feature = "gif")]
    /// An Image in GIF Format
    Gif,

    // #[cfg(feature = "webp")]
    /// An Image in WEBP Format
    WebP,

    // #[cfg(feature = "pnm")]
    // /// An Image in general PNM Format
    // Pnm,

    // #[cfg(feature = "tiff")]
    /// An Image in TIFF Format
    Tiff,

    // #[cfg(feature = "tga")]
    // /// An Image in TGA Format
    // Tga,

    // #[cfg(feature = "dds")]
    // /// An Image in DDS Format
    // Dds,

    // #[cfg(feature = "bmp")]
    /// An Image in BMP Format
    Bmp,

    // #[cfg(feature = "ico")]
    /// An Image in ICO Format
    Ico,

    // #[cfg(feature = "hdr")]
    // /// An Image in Radiance HDR Format
    // Hdr,

    // #[cfg(feature = "farbfeld")]
    // /// An Image in farbfeld Format
    // Farbfeld,

    // #[cfg(feature = "avif")]
    /// An Image in AVIF format.
    Avif,
}

impl TryFrom<WasmImageFormat> for ImageFormat {
    type Error = &'static str;

    fn try_from(wasm_image_format: WasmImageFormat) -> Result<Self, Self::Error> {
        match wasm_image_format {
            // #[cfg(feature = "png")]
            WasmImageFormat::Png => Ok(ImageFormat::Png),
            // #[cfg(feature = "jpeg")]
            WasmImageFormat::Jpeg => Ok(ImageFormat::Jpeg),
            // #[cfg(feature = "gif")]
            WasmImageFormat::Gif => Ok(ImageFormat::Gif),
            // #[cfg(feature = "webp")]
            WasmImageFormat::WebP => Ok(ImageFormat::WebP),
            // #[cfg(feature = "pnm")]
            // WasmImageFormat::Pnm => Ok(ImageFormat::Pnm),
            // #[cfg(feature = "tiff")]
            WasmImageFormat::Tiff => Ok(ImageFormat::Tiff),
            // #[cfg(feature = "tga")]
            // WasmImageFormat::Tga => Ok(ImageFormat::Tga),
            // #[cfg(feature = "dds")]
            // WasmImageFormat::Dds => Ok(ImageFormat::Dds),
            // #[cfg(feature = "bmp")]
            WasmImageFormat::Bmp => Ok(ImageFormat::Bmp),
            // #[cfg(feature = "ico")]
            WasmImageFormat::Ico => Ok(ImageFormat::Ico),
            // #[cfg(feature = "hdr")]
            // WasmImageFormat::Hdr => Ok(ImageFormat::Hdr),
            // #[cfg(feature = "farbfeld")]
            // WasmImageFormat::Farbfeld => Ok(ImageFormat::Farbfeld),
            // #[cfg(feature = "avif")]
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
            // #[cfg(feature = "png")]
            ImageFormat::Png => Ok(WasmImageFormat::Png),
            // #[cfg(feature = "jpeg")]
            ImageFormat::Jpeg => Ok(WasmImageFormat::Jpeg),
            // #[cfg(feature = "gif")]
            ImageFormat::Gif => Ok(WasmImageFormat::Gif),
            // #[cfg(feature = "webp")]
            ImageFormat::WebP => Ok(WasmImageFormat::WebP),
            // #[cfg(feature = "pnm")]
            // ImageFormat::Pnm => Ok(WasmImageFormat::Pnm),
            // #[cfg(feature = "tiff")]
            ImageFormat::Tiff => Ok(WasmImageFormat::Tiff),
            // #[cfg(feature = "tga")]
            // ImageFormat::Tga => Ok(WasmImageFormat::Tga),
            // #[cfg(feature = "dds")]
            // ImageFormat::Dds => Ok(WasmImageFormat::Dds),
            // #[cfg(feature = "bmp")]
            ImageFormat::Bmp => Ok(WasmImageFormat::Bmp),
            // #[cfg(feature = "ico")]
            ImageFormat::Ico => Ok(WasmImageFormat::Ico),
            // #[cfg(feature = "hdr")]
            // ImageFormat::Hdr => Ok(WasmImageFormat::Hdr),
            // #[cfg(feature = "farbfeld")]
            // ImageFormat::Farbfeld => Ok(WasmImageFormat::Farbfeld),
            // #[cfg(feature = "avif")]
            ImageFormat::Avif => Ok(WasmImageFormat::Avif),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported image format"),
        }
    }
}