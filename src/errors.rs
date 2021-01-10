use image::ImageError;
use js_sys::Error as JsError;
use std::io::Error as IoError;

pub(crate) fn image_error_to_js_error(image_error: ImageError) -> JsError {
    JsError::new(&image_error.to_string())
}

pub(crate) fn io_error_to_js_error(io_error: IoError) -> JsError {
    JsError::new(&io_error.to_string())
}

pub(crate) fn message_to_js_error(message: &str) -> JsError {
    JsError::new(&message.to_string())
}
