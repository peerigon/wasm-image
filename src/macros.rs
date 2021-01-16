// Copied from image/src/dynimage.rs

#[macro_export]
macro_rules! dynamic_map(
    ($dynimage: expr, ref $image: ident => $action: expr) => (
            match $dynimage {
                    DynamicImage::ImageLuma8(ref $image) => DynamicImage::ImageLuma8($action),
                    DynamicImage::ImageLumaA8(ref $image) => DynamicImage::ImageLumaA8($action),
                    DynamicImage::ImageRgb8(ref $image) => DynamicImage::ImageRgb8($action),
                    DynamicImage::ImageRgba8(ref $image) => DynamicImage::ImageRgba8($action),
                    DynamicImage::ImageBgr8(ref $image) => DynamicImage::ImageBgr8($action),
                    DynamicImage::ImageBgra8(ref $image) => DynamicImage::ImageBgra8($action),
                    DynamicImage::ImageLuma16(ref $image) => DynamicImage::ImageLuma16($action),
                    DynamicImage::ImageLumaA16(ref $image) => DynamicImage::ImageLumaA16($action),
                    DynamicImage::ImageRgb16(ref $image) => DynamicImage::ImageRgb16($action),
                    DynamicImage::ImageRgba16(ref $image) => DynamicImage::ImageRgba16($action),
            }
    );

    ($dynimage: expr, ref mut $image: ident => $action: expr) => (
            match $dynimage {
                    DynamicImage::ImageLuma8(ref mut $image) => DynamicImage::ImageLuma8($action),
                    DynamicImage::ImageLumaA8(ref mut $image) => DynamicImage::ImageLumaA8($action),
                    DynamicImage::ImageRgb8(ref mut $image) => DynamicImage::ImageRgb8($action),
                    DynamicImage::ImageRgba8(ref mut $image) => DynamicImage::ImageRgba8($action),
                    DynamicImage::ImageBgr8(ref mut $image) => DynamicImage::ImageBgr8($action),
                    DynamicImage::ImageBgra8(ref mut $image) => DynamicImage::ImageBgra8($action),
                    DynamicImage::ImageLuma16(ref mut $image) => DynamicImage::ImageLuma16($action),
                    DynamicImage::ImageLumaA16(ref mut $image) => DynamicImage::ImageLumaA16($action),
                    DynamicImage::ImageRgb16(ref mut $image) => DynamicImage::ImageRgb16($action),
                    DynamicImage::ImageRgba16(ref mut $image) => DynamicImage::ImageRgba16($action),
            }
    );

    ($dynimage: expr, ref $image: ident -> $action: expr) => (
            match $dynimage {
                    DynamicImage::ImageLuma8(ref $image) => $action,
                    DynamicImage::ImageLumaA8(ref $image) => $action,
                    DynamicImage::ImageRgb8(ref $image) => $action,
                    DynamicImage::ImageRgba8(ref $image) => $action,
                    DynamicImage::ImageBgr8(ref $image) => $action,
                    DynamicImage::ImageBgra8(ref $image) => $action,
                    DynamicImage::ImageLuma16(ref $image) => $action,
                    DynamicImage::ImageLumaA16(ref $image) => $action,
                    DynamicImage::ImageRgb16(ref $image) => $action,
                    DynamicImage::ImageRgba16(ref $image) => $action,
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
                    DynamicImage::ImageLuma16(ref mut $image) => $action,
                    DynamicImage::ImageLumaA16(ref mut $image) => $action,
                    DynamicImage::ImageRgb16(ref mut $image) => $action,
                    DynamicImage::ImageRgba16(ref mut $image) => $action,
            }
    );
);