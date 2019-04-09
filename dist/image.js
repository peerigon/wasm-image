var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as wasm from "wasm-rust-image";
export class WasmImage {
    constructor() { }
    setImage(image) {
        this.currentImage = image;
    }
    getImage() {
        return this.currentImage;
    }
    checkImage() {
        if (!this.currentImage) {
            throw new Error("no image set!");
        }
    }
    rotate(deg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            if ([90, 180, 270].includes(deg)) {
                this.currentImage = yield wasm.rotate(this.currentImage, deg);
                return;
            }
            throw new Error("invalid rotation degree (must be 90, 180 or 270)");
        });
    }
    grayscale() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            this.currentImage = yield wasm.grayscale(this.currentImage);
        });
    }
    invert() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            this.currentImage = yield wasm.invert(this.currentImage);
        });
    }
    blur(sigma) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            this.currentImage = yield wasm.blur(this.currentImage, sigma);
        });
    }
    unsharpen(sigma, threshold) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            this.currentImage = yield wasm.unsharpen(this.currentImage, sigma, threshold);
        });
    }
    adjustContrast(contrast) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            this.currentImage = yield wasm.adjust_contrast(this.currentImage, contrast);
        });
    }
    brighten(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            this.currentImage = yield wasm.brighten(this.currentImage, value);
        });
    }
    hueRotate(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            this.currentImage = yield wasm.hue_rotate(this.currentImage, value);
        });
    }
    flip(axis) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            const flipMap = {
                horizontally: 0,
                vertically: 1,
            };
            this.currentImage = yield wasm.flip(this.currentImage, flipMap[axis]);
        });
    }
    crop(rectStartPoint, rectEndPoint) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            this.currentImage = yield wasm.crop(this.currentImage, rectStartPoint.x, rectStartPoint.y, rectEndPoint.x, rectEndPoint.y);
        });
    }
    resize(width, height, filter, aspectRatio = "preserve") {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            const filterMap = {
                Nearest: 0,
                Lanczos3: 1,
                Gaussian: 2,
                CatmullRom: 3,
                Triangle: 4,
            };
            this.currentImage = yield wasm.resize(this.currentImage, width, height, filterMap[filter], aspectRatio === "preserve" || aspectRatio === "fill", aspectRatio === "fill", false);
        });
    }
    thumbnail(width, height, aspectRatio = "preserve") {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkImage();
            this.currentImage = yield wasm.resize(this.currentImage, width, height, 0, aspectRatio === "preserve", false, true);
        });
    }
}
//# sourceMappingURL=image.js.map