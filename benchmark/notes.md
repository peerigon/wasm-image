## Config 1

```sh
wasm-pack build --release --target nodejs
```

```toml
[profile.release]
# Tell `rustc` to optimize for small code size.
opt-level = "s"
lto = true
```

`wasm_image_bg.wasm`:
    - Parsed size: 

file | parsed size | transfer size
wasm_image_bg.wasm | 1455711 | 509475