use crate::color::WasmColorType;
use crate::errors;
use crate::filter_type::WasmImageFilterType;
use crate::image_output_format::WasmImageOutputFormat;
use image::{imageops::FilterType, DynamicImage, GenericImageView, ImageOutputFormat};
use js_sys::{Uint32Array, Uint8Array};
use std::convert::TryInto;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmDynamicImage {
    pub(crate) instance: DynamicImage,
}

// Cannot be part of impl WasmDynamicImage because we don't
// want to expose it to JS land.
pub(crate) fn new(instance: DynamicImage) -> WasmDynamicImage {
    WasmDynamicImage { instance }
}

#[wasm_bindgen]
impl WasmDynamicImage {
    #[wasm_bindgen(constructor)]
    pub fn new(color: WasmColorType, width: u32, height: u32) -> WasmDynamicImage {
        let instance = match color {
            WasmColorType::L8 => DynamicImage::new_luma8(width, height),
            WasmColorType::La8 => DynamicImage::new_luma_a8(width, height),
            WasmColorType::Rgb8 => DynamicImage::new_rgb8(width, height),
            WasmColorType::Rgba8 => DynamicImage::new_rgba8(width, height),
            WasmColorType::L16 => DynamicImage::new_luma16(width, height),
            WasmColorType::La16 => DynamicImage::new_luma_a16(width, height),
            WasmColorType::Rgb16 => DynamicImage::new_rgb16(width, height),
            WasmColorType::Rgba16 => DynamicImage::new_rgba16(width, height),
            WasmColorType::Bgr8 => DynamicImage::new_bgr8(width, height),
            WasmColorType::Bgra8 => DynamicImage::new_bgra8(width, height),
        };

        WasmDynamicImage { instance }
    }

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

    #[wasm_bindgen(js_name = "toRgb8")]
    pub fn to_rgb8(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageRgb8(self.instance.to_rgb8()),
        }
    }

    #[wasm_bindgen(js_name = "toRgb16")]
    pub fn to_rgb16(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageRgb16(self.instance.to_rgb16()),
        }
    }

    #[wasm_bindgen(js_name = "toRgba8")]
    pub fn to_rgba8(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageRgba8(self.instance.to_rgba8()),
        }
    }

    #[wasm_bindgen(js_name = "toRgba16")]
    pub fn to_rgba16(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageRgba16(self.instance.to_rgba16()),
        }
    }

    #[wasm_bindgen(js_name = "toBgr8")]
    pub fn to_bgr8(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageBgr8(self.instance.to_bgr8()),
        }
    }

    #[wasm_bindgen(js_name = "toBgra8")]
    pub fn to_bgra8(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageBgra8(self.instance.to_bgra8()),
        }
    }

    #[wasm_bindgen(js_name = "toLuma8")]
    pub fn to_luma8(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageLuma8(self.instance.to_luma8()),
        }
    }

    #[wasm_bindgen(js_name = "toLuma16")]
    pub fn to_luma16(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageLuma16(self.instance.to_luma16()),
        }
    }

    #[wasm_bindgen(js_name = "toLumaAlpha8")]
    pub fn to_luma_alpha8(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageLumaA8(self.instance.to_luma_alpha8()),
        }
    }

    #[wasm_bindgen(js_name = "toLumaAlpha16")]
    pub fn to_luma_alpha16(&self) -> WasmDynamicImage {
        WasmDynamicImage {
            instance: DynamicImage::ImageLumaA16(self.instance.to_luma_alpha16()),
        }
    }

    #[wasm_bindgen(js_name = "copyAs")]
    pub fn copy_as(&self, wasm_color_type: WasmColorType) -> WasmDynamicImage {
        let instance = match wasm_color_type {
            WasmColorType::L8 => DynamicImage::ImageLuma8(self.instance.to_luma8()),
            WasmColorType::La8 => DynamicImage::ImageLumaA8(self.instance.to_luma_alpha8()),
            WasmColorType::Rgb8 => DynamicImage::ImageRgb8(self.instance.to_rgb8()),
            WasmColorType::Rgba8 => DynamicImage::ImageRgba8(self.instance.to_rgba8()),
            WasmColorType::Bgr8 => DynamicImage::ImageBgr8(self.instance.to_bgr8()),
            WasmColorType::Bgra8 => DynamicImage::ImageBgra8(self.instance.to_bgra8()),
            WasmColorType::L16 => DynamicImage::ImageLuma16(self.instance.to_luma16()),
            WasmColorType::La16 => DynamicImage::ImageLumaA16(self.instance.to_luma_alpha16()),
            WasmColorType::Rgb16 => DynamicImage::ImageRgb16(self.instance.to_rgb16()),
            WasmColorType::Rgba16 => DynamicImage::ImageRgba16(self.instance.to_rgba16()),
        };

        WasmDynamicImage { instance }
    }

    #[wasm_bindgen(js_name = "convertInto")]
    pub fn convert_into(mut self, wasm_color_type: WasmColorType) -> WasmDynamicImage {
        self.instance = match wasm_color_type {
            WasmColorType::L8 => DynamicImage::ImageLuma8(self.instance.into_luma8()),
            WasmColorType::La8 => DynamicImage::ImageLumaA8(self.instance.into_luma_alpha8()),
            WasmColorType::Rgb8 => DynamicImage::ImageRgb8(self.instance.into_rgb8()),
            WasmColorType::Rgba8 => DynamicImage::ImageRgba8(self.instance.into_rgba8()),
            WasmColorType::Bgr8 => DynamicImage::ImageBgr8(self.instance.into_bgr8()),
            WasmColorType::Bgra8 => DynamicImage::ImageBgra8(self.instance.into_bgra8()),
            WasmColorType::L16 => DynamicImage::ImageLuma16(self.instance.into_luma16()),
            WasmColorType::La16 => DynamicImage::ImageLumaA16(self.instance.into_luma_alpha16()),
            WasmColorType::Rgb16 => DynamicImage::ImageRgb16(self.instance.into_rgb16()),
            WasmColorType::Rgba16 => DynamicImage::ImageRgba16(self.instance.into_rgba16()),
        };

        self
    }

    pub fn crop(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.instance = self.instance.crop_imm(x, y, width, height);
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

    pub fn dimensions(&self) -> Uint32Array {
        let dimensions = self.instance.dimensions();

        (&[dimensions.0, dimensions.1][..]).into()
    }

    pub fn width(&self) -> u32 {
        self.instance.width()
    }

    pub fn height(&self) -> u32 {
        self.instance.height()
    }

    pub fn bounds(&self) -> Uint32Array {
        let bounds = self.instance.bounds();

        (&[bounds.0, bounds.1, bounds.2, bounds.3][..]).into()
    }

    #[wasm_bindgen(js_name = "inBounds")]
    pub fn in_bounds(&self, x: u32, y: u32) -> bool {
        self.instance.in_bounds(x, y)
    }
}
