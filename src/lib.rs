use std::{convert::TryInto, io::Cursor};
use image::{io::Reader, ImageFormat};
use js_sys::{Uint32Array};
use wasm_bindgen::prelude::*;
mod color;
mod errors;
mod filter_type;
mod dynamic_image;
use dynamic_image::WasmDynamicImage;
mod image_format;
use image_format::WasmImageFormat;
mod image_output_format;
#[macro_use]
mod macros;
mod pixel;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

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

    let format = image::guess_format(bytes).map_err(errors::to_js_error)?;

    Ok(format.try_into().map_err(errors::to_js_error)?)
}

#[wasm_bindgen(js_name = "imageDimensions")]
pub fn image_dimensions(bytes: &[u8]) -> Result<Uint32Array, JsValue> {
    set_panic_hook();

    let reader = Reader::new(Cursor::new(bytes));
    let dimensions = reader
        .with_guessed_format()
        .map_err(errors::to_js_error)?
        .into_dimensions()
        .map_err(errors::to_js_error)?;

    Ok((&[dimensions.0, dimensions.1][..]).into())
}

#[wasm_bindgen(js_name = "loadFromMemory")]
pub fn load_from_memory(bytes: &[u8]) -> Result<WasmDynamicImage, JsValue> {
    set_panic_hook();

    let instance = image::load_from_memory(bytes).map_err(errors::to_js_error)?;

    Ok(dynamic_image::new(instance))
}

#[wasm_bindgen(js_name = "loadFromMemoryWithFormat")]
pub fn load_from_memory_with_format(
    bytes: &[u8],
    format: WasmImageFormat,
) -> Result<WasmDynamicImage, JsValue> {
    set_panic_hook();

    let image_format: ImageFormat = format.try_into().map_err(errors::to_js_error)?;
    let instance =
        image::load_from_memory_with_format(bytes, image_format).map_err(errors::to_js_error)?;

    Ok(dynamic_image::new(instance))
}
