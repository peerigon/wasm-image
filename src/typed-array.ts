const U16_BYTES_PER_ELEMENT = Uint16Array.BYTES_PER_ELEMENT;

/**
 * Turns a Uint8Array into a Uint16Array by each joining two ints.
 * This function just assumes that the input array is divisible by 2
 * and that the bytes are in little endian order.
 */
export const u8ToU16Array_old = (u8Array: Uint8Array | Uint8ClampedArray) => {
    const dataView = new DataView(
      u8Array.buffer,
      u8Array.byteOffset,
      u8Array.byteLength
    );
    const length = u8Array.byteLength / U16_BYTES_PER_ELEMENT;
    const u16Array = new Uint16Array(length);
  
    for (let i = 0; i < length; i++) {
      u16Array[i] = dataView.getUint16(i * U16_BYTES_PER_ELEMENT, true);
    }
  
    return u16Array;
};
  
export const toU16Array = (u8Array: Array<number> | Uint8Array | Uint8ClampedArray) => {
  const u16Array = new Uint16Array(u8Array.length);
  const dataView = new DataView(
    u8Array.buffer,
    u8Array.byteOffset,
    u8Array.byteLength
  );
  const length = u8Array.byteLength / U16_BYTES_PER_ELEMENT;
  const u16Array = new Uint16Array(length);

  for (let i = 0; i < length; i++) {
    u16Array[i] = dataView.getUint16(i * U16_BYTES_PER_ELEMENT, true);
  }

  return u16Array;
};