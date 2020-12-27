import fs from "fs/promises";
import {resolve} from "path";
import {WasmImage} from "../pkg";

const pathToImages = resolve(__dirname, "..", "tests", "images");

describe("WasmImage", () => {
    test("constructor", () => {

    });

    test("grayscale", async () => {
        // const buffer = await fs.readFile(resolve(pathToImages, "jpg", "progressive", "cat.jpg"));
        // const image = WasmImage.fromBuffer(buffer);

        // image.grayscale();
    });
});