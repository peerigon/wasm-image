use std::convert::TryFrom;
use image::imageops::FilterType;
use wasm_bindgen::prelude::*;

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