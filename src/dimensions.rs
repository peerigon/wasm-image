use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmDimensions(pub u32, pub u32);

impl From<(u32, u32)> for WasmDimensions {
    fn from(tuple: (u32, u32)) -> WasmDimensions {
        WasmDimensions(tuple.0, tuple.1)
    }
}
