use crate::WasmDynamicImage;
use image::{math::Rect, GenericImage};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmDynamicImage {
    #[wasm_bindgen(js_name = "genericImageCopyWithin")]
    pub fn generic_image_copy_within(
        &mut self,
        source_x: u32,
        source_y: u32,
        source_width: u32,
        source_height: u32,
        dest_x: u32,
        dest_y: u32,
    ) -> bool {
        self.instance.copy_within(
            Rect {
                x: source_x,
                y: source_y,
                width: source_width,
                height: source_height,
            },
            dest_x,
            dest_y,
        )
    }
}
