use image::{
    Rgba,
    Pixel,
};
use js_sys::{Uint8Array};
use std::cmp;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmPixel {
    instance: Rgba<u8>,
}

#[wasm_bindgen]
impl WasmPixel {
    #[wasm_bindgen(constructor)]
    pub fn new() -> WasmPixel {
        WasmPixel { instance: Rgba::<u8>::from_channels(0, 0, 0, 0) }
    }

    #[wasm_bindgen(js_name = "getChannels")]
    pub fn get_channels(&self) -> Uint8Array {
        self.instance.channels().into()
    }

    #[wasm_bindgen(js_name = "setChannels")]
    pub fn set_channels(&mut self, new_channels: &[u8]) {
        let current_channels = self.instance.channels_mut();
        let length = cmp::min(current_channels.len(), new_channels.len());
        for i in 0..length {
            current_channels[i] = new_channels[i];
        }
    }

    #[wasm_bindgen(js_name = "invert")]
    pub fn invert(&mut self) {
        self.instance.invert()
    }
}
