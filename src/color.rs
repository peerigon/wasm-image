use crate::WasmDynamicImage;
use image::ColorType;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug)]
pub enum WasmColorType {
    L8,
    La8,
    Rgb8,
    Rgba8,
    Bgr8,
    Bgra8,

    L16,
    La16,
    Rgb16,
    Rgba16,
}

impl From<WasmColorType> for ColorType {
    fn from(wasm_color_type: WasmColorType) -> Self {
        match wasm_color_type {
            WasmColorType::L8 => ColorType::L8,
            WasmColorType::La8 => ColorType::La8,
            WasmColorType::Rgb8 => ColorType::Rgb8,
            WasmColorType::Rgba8 => ColorType::Rgba8,
            WasmColorType::Bgr8 => ColorType::Bgr8,
            WasmColorType::Bgra8 => ColorType::Bgra8,

            WasmColorType::L16 => ColorType::L16,
            WasmColorType::La16 => ColorType::La16,
            WasmColorType::Rgb16 => ColorType::Rgb16,
            WasmColorType::Rgba16 => ColorType::Rgba16,
            _ => panic!("Color type {:?} not supported", wasm_color_type)
        }
    }
}

impl From<ColorType> for WasmColorType {
    fn from(color_type: ColorType) -> Self {
        match color_type {
            ColorType::L8 => WasmColorType::L8,
            ColorType::La8 => WasmColorType::La8,
            ColorType::Rgb8 => WasmColorType::Rgb8,
            ColorType::Rgba8 => WasmColorType::Rgba8,
            ColorType::Bgr8 => WasmColorType::Bgr8,
            ColorType::Bgra8 => WasmColorType::Bgra8,

            ColorType::L16 => WasmColorType::L16,
            ColorType::La16 => WasmColorType::La16,
            ColorType::Rgb16 => WasmColorType::Rgb16,
            ColorType::Rgba16 => WasmColorType::Rgba16,
            _ => panic!("Color type {:?} not supported", color_type)
        }
    }
}

#[wasm_bindgen]
impl WasmDynamicImage {
    #[wasm_bindgen(js_name = "colorType")]
    pub fn color_type(&self) -> WasmColorType {
        self.instance.color().into()
    }

    #[wasm_bindgen(js_name = "colorBytesPerPixel")]
    pub fn color_bytes_per_pixel(&self) -> u8 {
        self.instance.color().bytes_per_pixel()
    }

    #[wasm_bindgen(js_name = "colorHasAlpha")]
    pub fn color_has_alpha(&self) -> bool {
        self.instance.color().has_alpha()
    }

    #[wasm_bindgen(js_name = "colorHasColor")]
    pub fn color_has_color(&self) -> bool {
        self.instance.color().has_color()
    }

    #[wasm_bindgen(js_name = "colorBitsPerPixel")]
    pub fn color_bits_per_pixel(&self) -> u16 {
        self.instance.color().bits_per_pixel()
    }

    #[wasm_bindgen(js_name = "colorChannelCount")]
    pub fn color_channel_count(&self) -> u8 {
        self.instance.color().channel_count()
    }
}