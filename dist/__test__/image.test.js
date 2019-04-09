import { WasmImage } from "../image";
describe("image.ts", () => {
    describe("instance", () => {
        it("can be created", () => {
            const WImage = new WasmImage();
            expect(WImage).toBeInstanceOf(WasmImage);
        });
    });
});
//# sourceMappingURL=image.test.js.map