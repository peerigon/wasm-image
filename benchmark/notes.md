## Config 1

```sh
wasm-pack build --release --target nodejs
```

```toml
[profile.release]
# Tell `rustc` to optimize for small code size.
opt-level = "s"
lto = true

[package.metadata.wasm-pack.profile.release]
wasm-opt = ["-Oz"]
```

`wasm_image_bg.wasm`:
    - Parsed size: 1455711
    - Transfer size: 509475

```json
  "results": [
    {
      "name": "Load image",
      "ops": 128,
      "margin": 0.45,
      "percentSlower": 0
    },
    {
      "name": "Transform image",
      "ops": 36,
      "margin": 0.44,
      "percentSlower": 71.88
    },
    {
      "name": "Save and dispose image",
      "ops": 113,
      "margin": 0.34,
      "percentSlower": 11.72
    }
  ],
```

## Config 2

```sh
wasm-pack build --release --target nodejs
```

```toml
[profile.release]
# Tell `rustc` to optimize for small code size.
opt-level = "z"
lto = true

[package.metadata.wasm-pack.profile.release]
wasm-opt = ["-Oz"]
```

`wasm_image_bg.wasm`:
    - Parsed size: 1456377
    - Transfer size: 503875

```json
  "results": [
    {
      "name": "Load image",
      "ops": 97,
      "margin": 0.42,
      "percentSlower": 0
    },
    {
      "name": "Transform image",
      "ops": 19,
      "margin": 0.99,
      "percentSlower": 80.41
    },
    {
      "name": "Save and dispose image",
      "ops": 65,
      "margin": 0.64,
      "percentSlower": 32.99
    }
  ],
```

## Config 3

```sh
wasm-pack build --release --target nodejs
```

```toml
[profile.release]
# Tell `rustc` to optimize for small code size.
opt-level = "s"
lto = true

[package.metadata.wasm-pack.profile.release]
wasm-opt = ["-Os"]
```

`wasm_image_bg.wasm`:
    - Parsed size: 1455851
    - Transfer size: 509629

```json
  "results": [
    {
      "name": "Load image",
      "ops": 128,
      "margin": 0.46,
      "percentSlower": 0
    },
    {
      "name": "Transform image",
      "ops": 36,
      "margin": 0.57,
      "percentSlower": 71.88
    },
    {
      "name": "Save and dispose image",
      "ops": 111,
      "margin": 0.52,
      "percentSlower": 13.28
    }
  ],
```