use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmBounds(pub u32, pub u32, pub u32, pub u32);

impl From<(u32, u32, u32, u32)> for WasmBounds {
    fn from(tuple: (u32, u32, u32, u32)) -> WasmBounds {
        WasmBounds(tuple.0, tuple.1, tuple.2, tuple.3)
    }
}
