use std::cmp;
use js_sys::{Uint8Array, Uint16Array};
use crate::WasmDynamicImage;
use image::{
    DynamicImage, GenericImage, GenericImageView, Pixel,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmDynamicImage {
    #[wasm_bindgen(js_name = "pixelGetChannels8")]
    pub fn pixel_get_channels_8(&self, x: u32, y: u32) -> Uint8Array {
        match &self.instance {
            DynamicImage::ImageLuma8(image) => image.get_pixel(x, y).channels().into(),
            DynamicImage::ImageLumaA8(image) => image.get_pixel(x, y).channels().into(),
            DynamicImage::ImageRgb8(image) => image.get_pixel(x, y).channels().into(),
            DynamicImage::ImageRgba8(image) => image.get_pixel(x, y).channels().into(),
            DynamicImage::ImageBgr8(image) => image.get_pixel(x, y).channels().into(),
            DynamicImage::ImageBgra8(image) => image.get_pixel(x, y).channels().into(),
            _ => {
                panic!("Please use pixelGetChannels16");
            }
        }
    }

    #[wasm_bindgen(js_name = "pixelGetChannels16")]
    pub fn pixel_get_channels_16(&self, x: u32, y: u32) -> Uint16Array {
        match &self.instance {
            DynamicImage::ImageLuma16(image) => image.get_pixel(x, y).channels().into(),
            DynamicImage::ImageLumaA16(image) => image.get_pixel(x, y).channels().into(),
            DynamicImage::ImageRgb16(image) => image.get_pixel(x, y).channels().into(),
            DynamicImage::ImageRgba16(image) => image.get_pixel(x, y).channels().into(),
            _ => {
                panic!("Please use pixelGetChannels8");
            }
        }
    }

    #[wasm_bindgen(js_name = "pixelSetChannels8")]
    pub fn pixel_set_channels_8(&mut self, x: u32, y: u32, new_channels: &[u8]) {
        let current_channels = match &mut self.instance {
            DynamicImage::ImageLuma8(image) => image.get_pixel_mut(x, y).channels_mut(),
            DynamicImage::ImageLumaA8(image) => image.get_pixel_mut(x, y).channels_mut(),
            DynamicImage::ImageRgb8(image) => image.get_pixel_mut(x, y).channels_mut(),
            DynamicImage::ImageRgba8(image) => image.get_pixel_mut(x, y).channels_mut(),
            DynamicImage::ImageBgr8(image) => image.get_pixel_mut(x, y).channels_mut(),
            DynamicImage::ImageBgra8(image) => image.get_pixel_mut(x, y).channels_mut(),
            _ => {
                panic!("Please use pixelSetChannels16");
            }
        };
        let length = cmp::min(current_channels.len(), new_channels.len());
        for i in 0..length {
            current_channels[i] = new_channels[i];
        }
    }

    #[wasm_bindgen(js_name = "pixelSetChannels16")]
    pub fn pixel_set_channels_16(&mut self, x: u32, y: u32, new_channels: &[u16]) {
        let current_channels = match &mut self.instance {
            DynamicImage::ImageLuma16(image) => image.get_pixel_mut(x, y).channels_mut(),
            DynamicImage::ImageLumaA16(image) => image.get_pixel_mut(x, y).channels_mut(),
            DynamicImage::ImageRgb16(image) => image.get_pixel_mut(x, y).channels_mut(),
            DynamicImage::ImageRgba16(image) => image.get_pixel_mut(x, y).channels_mut(),
            _ => {
                panic!("Please use pixelSetChannels8");
            }
        };
        let length = cmp::min(current_channels.len(), new_channels.len());
        for i in 0..length {
            current_channels[i] = new_channels[i];
        }
    }
    
    #[wasm_bindgen(js_name = "pixelInvert")]
    pub fn pixel_invert(&mut self, x: u32, y: u32) {
        let mut pixel = self.instance.get_pixel(x, y);

        pixel.invert();
        self.instance.put_pixel(x, y, pixel);
    }

    #[wasm_bindgen(js_name = "pixelBlendSelf")]
    pub fn pixel_blend_self(&mut self, x: u32, y: u32, other_x: u32, other_y: u32) {
        self.pixel_blend(x, y, other_x, other_y, None);
    }

    #[wasm_bindgen(js_name = "pixelBlendOther")]
    pub fn pixel_blend_other(
        &mut self,
        x: u32,
        y: u32,
        other_x: u32,
        other_y: u32,
        other_image: &WasmDynamicImage,
    ) {
        self.pixel_blend(x, y, other_x, other_y, Some(&other_image));
    }

    // Would be nice to expose this function directly to JS land
    // but Option<> is not supported yet.
    // See https://github.com/rustwasm/wasm-bindgen/issues/2370
    fn pixel_blend(
        &mut self,
        x: u32,
        y: u32,
        other_x: u32,
        other_y: u32,
        other_image: Option<&WasmDynamicImage>,
    ) {
        let other_instance = &other_image.unwrap_or(&self).instance;
        let other_pixel = other_instance.get_pixel(other_x, other_y);
        let mut pixel = self.instance.get_pixel(x, y);

        pixel.blend(&other_pixel);
        self.instance.put_pixel(x, y, pixel);
    }
}
