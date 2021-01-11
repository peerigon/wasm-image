use image::ColorType;
use std::convert::TryFrom;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Copy, PartialEq, Eq, Debug, Clone, Hash)]
pub enum WasmColorType {
    /// Pixel is 8-bit luminance
    L8,
    /// Pixel is 8-bit luminance with an alpha channel
    La8,
    /// Pixel contains 8-bit R, G and B channels
    Rgb8,
    /// Pixel is 8-bit RGB with an alpha channel
    Rgba8,

    /// Pixel is 16-bit luminance
    L16,
    /// Pixel is 16-bit luminance with an alpha channel
    La16,
    /// Pixel is 16-bit RGB
    Rgb16,
    /// Pixel is 16-bit RGBA
    Rgba16,

    /// Pixel contains 8-bit B, G and R channels
    Bgr8,
    /// Pixel is 8-bit BGR with an alpha channel
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
