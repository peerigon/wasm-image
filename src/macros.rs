macro_rules! map_dynamic_image_8(
    ($dynamic_image: expr, ref $image: ident -> $action: expr) => (
        match $dynamic_image {
            DynamicImage::ImageLuma8(ref $image) => $action,
            DynamicImage::ImageLumaA8(ref $image) => $action,
            DynamicImage::ImageRgb8(ref $image) => $action,
            DynamicImage::ImageRgba8(ref $image) => $action,
            DynamicImage::ImageBgr8(ref $image) => $action,
            DynamicImage::ImageBgra8(ref $image) => $action,
            _ => {
                panic!("Please use the 16bit version of this method");
            }
        }
    );

    ($dynamic_image: expr, ref mut $image: ident -> $action: expr) => (
        match $dynamic_image {
            DynamicImage::ImageLuma8(ref mut $image) => $action,
            DynamicImage::ImageLumaA8(ref mut $image) => $action,
            DynamicImage::ImageRgb8(ref mut $image) => $action,
            DynamicImage::ImageRgba8(ref mut $image) => $action,
            DynamicImage::ImageBgr8(ref mut $image) => $action,
            DynamicImage::ImageBgra8(ref mut $image) => $action,
            _ => {
                panic!("Please use the 16bit version of this method");
            }
        }
    );
);

macro_rules! map_dynamic_image_16(
    ($dynamic_image: expr, ref $image: ident -> $action: expr) => (
        match $dynamic_image {
            DynamicImage::ImageLuma16(ref $image) => $action,
            DynamicImage::ImageLumaA16(ref $image) => $action,
            DynamicImage::ImageRgb16(ref $image) => $action,
            DynamicImage::ImageRgba16(ref $image) => $action,
            _ => {
                panic!("Please use the 8bit version of this method");
            }
        }
    );

    ($dynamic_image: expr, ref mut $image: ident -> $action: expr) => (
        match $dynamic_image {
            DynamicImage::ImageLuma16(ref mut $image) => $action,
            DynamicImage::ImageLumaA16(ref mut $image) => $action,
            DynamicImage::ImageRgb16(ref mut $image) => $action,
            DynamicImage::ImageRgba16(ref mut $image) => $action,
            _ => {
                panic!("Please use the 8bit version of this method");
            }
        }
    );
);