extern crate cfg_if;
extern crate image;
extern crate thread_local;
extern crate wasm_bindgen;

use std::io::{Cursor, Read, Seek, SeekFrom};

mod utils;

use cfg_if::cfg_if;
use image::DynamicImage;
use image::GenericImageView;
use image::ImageFormat;
use std::str;
use wasm_bindgen::prelude::*;

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
extern "C" {
    fn alert(s: &str);
}

fn load_image_from_array(_array: &[u8]) -> DynamicImage {
    let img = match image::load_from_memory_with_format(_array, ImageFormat::PNG) {
        Ok(img) => img,
        Err(error) => {
            log!("There was a problem opening the file: {:?}", error);
            panic!("There was a problem opening the file: {:?}", error)
        }
    };
    return img;
}

fn get_image_as_array(_img: DynamicImage) -> Vec<u8> {
    // Create fake "file"
    let mut c = Cursor::new(Vec::new());

    match _img.write_to(&mut c, ImageFormat::PNG) {
        Ok(c) => c,
        Err(error) => {
            log!(
                "There was a problem writing the resulting buffer: {:?}",
                error
            );
            panic!(
                "There was a problem writing the resulting buffer: {:?}",
                error
            )
        }
    };
    c.seek(SeekFrom::Start(0)).unwrap();

    // Read the "file's" contents into a vector
    let mut out = Vec::new();
    c.read_to_end(&mut out).unwrap();

    log!("Sends array back");
    return out;
}

#[wasm_bindgen]
pub fn rotate(_array: &[u8], _deg: u16) -> Vec<u8> {
    let mut img = load_image_from_array(_array);

    img = match _deg {
        90 => img.rotate90(),
        180 => img.rotate180(),
        270 => img.rotate270(),
        _ => img,
    };

    return get_image_as_array(img);
}

#[wasm_bindgen]
pub fn resize(
    _array: &[u8],
    _width: u32,
    _height: u32,
    _filter: u8,
    _aspect_ratio_preserve: bool,
) -> Vec<u8> {
    log!("Received buffer");

    let _checked_filter: image::FilterType = match _filter {
        0 => image::FilterType::Nearest,
        1 => image::FilterType::Lanczos3,
        2 => image::FilterType::Gaussian,
        3 => image::FilterType::CatmullRom,
        4 => image::FilterType::Triangle,
        _ => image::FilterType::Nearest,
    };

    let mut img = load_image_from_array(_array);

    if _aspect_ratio_preserve {
        img = img.resize(_width, _height, _checked_filter);
    } else {
        img = img.resize_exact(_width, _height, _checked_filter);
    };

    return get_image_as_array(img);
;}
