use js_sys::Error as JsError;

pub(crate) fn to_js_error<Message: ToString>(message: Message) -> JsError {
    JsError::new(&message.to_string())
}
