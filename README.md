# wasm-image

blazing fast image processing in WebAssembly

:warning: Please check the limitations. This is still a work in progress!

## Install

```bash
npm i wasm-image
# or
yarn install wasm-image
```

If you want to use it in a frontend web project, please make sure you use a module bundler that supports WebAssembly, like [webpack](https://webpack.js.org/).

WebAssembly is supported in [all modern browsers](https://caniuse.com/#feat=wasm).

## Usage

The small JavaScript wrapper on top of the WASM module is `src/image.ts`. As WASM with shared memory is not well supported yet, you need to load the image into the wrapper first:

```ts
import { WasmImage } from "wasm-image";

const WasmImg = new WasmImage();
WasmImg.setImage(new Uint8Array(buffer));
```

Note: you can convert a file into a conforming buffer like this:

<details>

```ts
getImageAsArrayBuffer = async (file: File): Promise<ArrayBuffer> => {
  const result = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result instanceof ArrayBuffer) {
        return resolve(reader.result);
      } else {
        return reject(new Error("Could not create arraybuffer"));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  return result;
};
```

</details>

Afterwards, you can execute as many operations as you want on the image:

```ts
await WasmImg.rotate(90);
await WasmImg.brighten(1);
...
```

Afterwards you can retrieve your image from WebAssembly:

```ts
const modifiedImage: Uint8Array = await WasmImg.getImage();
```

## Supported image operations
Please check our [docs](https://peerigon.github.io/wasm-image/) for all available image processing functions.

## Limitations

The Rust library used for this project is [image](https://github.com/PistonDevelopers/image). All limitations that are mentioned for this library are obviously also valid for this WASM wrapper.

Please make sure you read the [list of supported image formts](https://github.com/PistonDevelopers/image#2-supported-image-formats).

### WARNING
The package currently only supports PNG, the rest is a work in progress.

## License

MIT

## Sponsors

[<img src="https://assets.peerigon.com/peerigon/logo/peerigon-logo-flat-spinat.png" width="150" />](https://peerigon.com)
