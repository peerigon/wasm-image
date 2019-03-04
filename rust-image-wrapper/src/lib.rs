extern crate cfg_if;
extern crate wasm_bindgen;
extern crate thread_local;
extern crate image;

mod utils;

use std::str;
use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;
use image::ImageFormat;

#[macro_use]
pub mod log;

cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn rotate(_buffer: &[u8], _deg: u16) -> Vec<u8> {
    /*let buf_str = match str::from_utf8(_buffer) {
        Ok(v) => v,
        Err(e) => {
            log!("Invalid UTF-8 sequence: {}", e);
            panic!("Invalid UTF-8 sequence: {}", e);
        },
    };*/
    log!("doing the image thing11");

    let mut img = match image::load_from_memory_with_format(_buffer, ImageFormat::PNG) {
        Ok(img) => img,
        Err(error) => {
            log!("There was a problem opening the file: {:?}", error);
            panic!("There was a problem opening the file: {:?}", error)
        },
    };

    img = match _deg {
        90 => img.rotate90(),
        180 => img.rotate180(),
        270 => img.rotate270(),
        _ => img,
    };

    return img.to_rgb().into_raw();
}

#[wasm_bindgen]
pub fn resize(_buffer: &[u8], _width: u32, _height: u32, _filter: u8, _aspect_ratio_preserve: bool) -> Vec<u8> {
    /*let buf_str = match str::from_utf8(_buffer) {
        Ok(v) => v,
        Err(e) => {
            log!("Invalid UTF-8 sequence: {}", e);
            panic!("Invalid UTF-8 sequence: {}", e);
        },
    };*/
    let _checked_filter: image::FilterType = match _filter {
        0 => image::FilterType::Nearest,
        1 => image::FilterType::Lanczos3,
        2 => image::FilterType::Gaussian,
        3 => image::FilterType::CatmullRom,
        4 => image::FilterType::Triangle,
        _ => image::FilterType::Nearest,
    };
    log!("doing the image thing11");

    let mut img = match image::load_from_memory_with_format(_buffer, ImageFormat::PNG) {
        Ok(img) => img,
        Err(error) => {
            log!("There was a problem opening the file: {:?}", error);
            panic!("There was a problem opening the file: {:?}", error)
        },
    };

    if _aspect_ratio_preserve {
        img = img.resize(_width, _height, _checked_filter);
    } else {
        img = img.resize_exact(_width, _height, _checked_filter);
    }

    return img.to_rgb().into_raw();
}
