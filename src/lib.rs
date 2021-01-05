use image::{
    imageops::FilterType, io::Reader, DynamicImage, ImageError, ImageFormat, ImageOutputFormat,
};
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

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]

pub enum WasmImageFilterType {
    /// Nearest Neighbor
    Nearest,

    /// Linear Filter
    Triangle,

    /// Cubic Filter
    CatmullRom,

    /// Gaussian Filter
    Gaussian,

    /// Lanczos with window 3
    Lanczos3,
}

impl TryFrom<WasmImageFilterType> for FilterType {
    type Error = &'static str;

    fn try_from(wasm_image_filter_type: WasmImageFilterType) -> Result<Self, Self::Error> {
        match wasm_image_filter_type {
            WasmImageFilterType::Nearest => Ok(FilterType::Nearest),
            WasmImageFilterType::Triangle => Ok(FilterType::Triangle),
            WasmImageFilterType::CatmullRom => Ok(FilterType::CatmullRom),
            WasmImageFilterType::Gaussian => Ok(FilterType::Gaussian),
            WasmImageFilterType::Lanczos3 => Ok(FilterType::Lanczos3),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported filter type"),
        }
    }
}

impl TryFrom<FilterType> for WasmImageFilterType {
    type Error = &'static str;

    fn try_from(filter_type: FilterType) -> Result<Self, Self::Error> {
        match filter_type {
            FilterType::Nearest => Ok(WasmImageFilterType::Nearest),
            FilterType::Triangle => Ok(WasmImageFilterType::Triangle),
            FilterType::CatmullRom => Ok(WasmImageFilterType::CatmullRom),
            FilterType::Gaussian => Ok(WasmImageFilterType::Gaussian),
            FilterType::Lanczos3 => Ok(WasmImageFilterType::Lanczos3),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported filter type"),
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
pub fn guess_format(bytes: &[u8]) -> Result<WasmImageFormat, JsValue> {
    set_panic_hook();

    let format = image::guess_format(bytes).map_err(image_error_to_js_error)?;

    Ok(format.try_into().map_err(message_to_js_error)?)
}

#[wasm_bindgen(js_name = "imageDimensions")]
pub fn image_dimensions(bytes: &[u8]) -> Result<Box<[u32]>, JsValue> {
    set_panic_hook();

    let reader = Reader::new(Cursor::new(bytes));
    let dimensions = reader
        .with_guessed_format()
        .map_err(io_error_to_js_error)?
        .into_dimensions()
        .map_err(image_error_to_js_error)?;

    Ok(Box::new([dimensions.0, dimensions.1]))
}

#[wasm_bindgen(js_name = "loadFromMemory")]
pub fn load_from_memory(bytes: &[u8]) -> Result<WasmDynamicImage, JsValue> {
    set_panic_hook();

    let dynamic_image = image::load_from_memory(bytes).map_err(image_error_to_js_error)?;

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

    let image_format: ImageFormat = format.try_into().map_err(message_to_js_error)?;
    let dynamic_image = image::load_from_memory_with_format(bytes, image_format)
        .map_err(image_error_to_js_error)?;

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
    pub fn to_bytes(self) -> Vec<u8> {
        self.instance.into_bytes()
    }

    #[wasm_bindgen(js_name = "toFormat")]
    pub fn to_format(self, format: WasmImageOutputFormat) -> Result<Vec<u8>, JsValue> {
        let mut buffer = vec![];
        let format: ImageOutputFormat =
            format.try_into().map_err(message_to_js_error)?;

        self.instance
            .write_to(&mut buffer, format)
            .map_err(image_error_to_js_error)?;

        Ok(buffer)
    }

    /// wasm_bindgen currently does not support enums with values.
    /// See https://github.com/rustwasm/wasm-bindgen/issues/2407
    /// This is why we need extra methods for enums that carry values, such as ImageOutputFormat::Jpeg
    #[wasm_bindgen(js_name = "toFormatJpeg")]
    pub fn to_format_jpeg(self, quality: u8) -> Result<Vec<u8>, JsValue> {
        let mut buffer = vec![];

        self.instance
            .write_to(&mut buffer, ImageOutputFormat::Jpeg(quality))
            .map_err(image_error_to_js_error)?;

        Ok(buffer)
    }

    pub fn crop(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.instance = self.instance.crop_imm(x, y, width, height);
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
        let filter: FilterType = filter.try_into().map_err(message_to_js_error)?;

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
        let filter: FilterType = filter.try_into().map_err(message_to_js_error)?;

        self.instance = self.instance.resize_exact(nwidth, nheight, filter);

        Ok(())
    }

    pub fn grayscale(&mut self) {
        self.instance = self.instance.grayscale();
    }

    pub fn dispose(self) {
        // TODO: Check if this is necessary
        drop(self);
    }
}
