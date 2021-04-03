#[macro_export]
macro_rules! dynamic_map_8(
    ($dynimage: expr, ref $image: ident -> $action: expr) => (
        match $dynimage {
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

    ($dynimage: expr, ref mut $image: ident -> $action: expr) => (
        match $dynimage {
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

#[macro_export]
macro_rules! dynamic_map_16(
    ($dynimage: expr, ref $image: ident -> $action: expr) => (
        match $dynimage {
            DynamicImage::ImageLuma16(ref $image) => $action,
            DynamicImage::ImageLumaA16(ref $image) => $action,
            DynamicImage::ImageRgb16(ref $image) => $action,
            DynamicImage::ImageRgba16(ref $image) => $action,
            _ => {
                panic!("Please use the 8bit version of this method");
            }
        }
    );

    ($dynimage: expr, ref mut $image: ident -> $action: expr) => (
        match $dynimage {
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
