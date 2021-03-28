use image::ColorType;
use std::convert::TryFrom;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub enum WasmColorType {
    L8,
    La8,
    Rgb8,
    Rgba8,

    L16,
    La16,
    Rgb16,
    Rgba16,

    Bgr8,
    Bgra8,
}

impl TryFrom<WasmColorType> for ColorType {
    type Error = &'static str;

    fn try_from(wasm_color_type: WasmColorType) -> Result<Self, Self::Error> {
        match wasm_color_type {
            WasmColorType::L8 => Ok(ColorType::L8),
            WasmColorType::La8 => Ok(ColorType::La8),
            WasmColorType::Rgb8 => Ok(ColorType::Rgb8),
            WasmColorType::Rgba8 => Ok(ColorType::Rgba8),
            WasmColorType::L16 => Ok(ColorType::L16),
            WasmColorType::La16 => Ok(ColorType::La16),
            WasmColorType::Rgb16 => Ok(ColorType::Rgb16),
            WasmColorType::Rgba16 => Ok(ColorType::Rgba16),
            WasmColorType::Bgr8 => Ok(ColorType::Bgr8),
            WasmColorType::Bgra8 => Ok(ColorType::Bgra8),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported color type"),
        }
    }
}

impl TryFrom<ColorType> for WasmColorType {
    type Error = &'static str;

    fn try_from(color_type: ColorType) -> Result<Self, Self::Error> {
        match color_type {
            ColorType::L8 => Ok(WasmColorType::L8),
            ColorType::La8 => Ok(WasmColorType::La8),
            ColorType::Rgb8 => Ok(WasmColorType::Rgb8),
            ColorType::Rgba8 => Ok(WasmColorType::Rgba8),
            ColorType::L16 => Ok(WasmColorType::L16),
            ColorType::La16 => Ok(WasmColorType::La16),
            ColorType::Rgb16 => Ok(WasmColorType::Rgb16),
            ColorType::Rgba16 => Ok(WasmColorType::Rgba16),
            ColorType::Bgr8 => Ok(WasmColorType::Bgr8),
            ColorType::Bgra8 => Ok(WasmColorType::Bgra8),
            #[allow(unreachable_patterns)]
            _ => Err("Unsupported color type"),
        }
    }
}
