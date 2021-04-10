use crate::WasmDynamicImage;
use crate::errors;
use image::{math::Rect, GenericImage, GenericImageView};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmDynamicImage {
    #[wasm_bindgen(js_name = "genericImageCopyFrom")]
    pub fn generic_image_copy_from(
        &mut self,
        source: &WasmDynamicImage,
        dest_x: u32,
        dest_y: u32,
    ) -> Result<(), JsValue>  {
        let result = self.instance.copy_from(&source.instance, dest_x, dest_y).map_err(errors::to_js_error)?;

        Ok(result)
    }

    #[wasm_bindgen(js_name = "genericImageCopyFromView")]
    pub fn generic_image_copy_from_view(
        &mut self,
        source: &WasmDynamicImage,
        source_x: u32,
        source_y: u32,
        source_width: u32,
        source_height: u32,
        dest_x: u32,
        dest_y: u32,
    ) -> Result<(), JsValue>  {
        let source_view = source.instance.view(source_x, source_y, source_width, source_height);
        let result = self.instance.copy_from(&source_view, dest_x, dest_y).map_err(errors::to_js_error)?;

        Ok(result)
    }

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
