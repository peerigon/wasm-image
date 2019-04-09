/* tslint:disable */
import * as wasm from './wasm_rust_image_bg';

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm(arg) {
    const ptr = wasm.__wbindgen_malloc(arg.length * 1);
    getUint8Memory().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm(ptr, len) {
    return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null) {
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    }
    return cachedGlobalArgumentPtr;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}
/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @returns {Uint8Array}
*/
export function rotate(arg0, arg1) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.rotate(retptr, ptr0, len0, arg1);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @returns {Uint8Array}
*/
export function grayscale(arg0) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.grayscale(retptr, ptr0, len0);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @returns {Uint8Array}
*/
export function invert(arg0) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.invert(retptr, ptr0, len0);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @returns {Uint8Array}
*/
export function blur(arg0, arg1) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.blur(retptr, ptr0, len0, arg1);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @param {number} arg2
* @returns {Uint8Array}
*/
export function unsharpen(arg0, arg1, arg2) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.unsharpen(retptr, ptr0, len0, arg1, arg2);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @returns {Uint8Array}
*/
export function adjust_contrast(arg0, arg1) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.adjust_contrast(retptr, ptr0, len0, arg1);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @returns {Uint8Array}
*/
export function brighten(arg0, arg1) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.brighten(retptr, ptr0, len0, arg1);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @returns {Uint8Array}
*/
export function hue_rotate(arg0, arg1) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.hue_rotate(retptr, ptr0, len0, arg1);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @returns {Uint8Array}
*/
export function flip(arg0, arg1) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.flip(retptr, ptr0, len0, arg1);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @param {number} arg2
* @param {number} arg3
* @param {number} arg4
* @returns {Uint8Array}
*/
export function crop(arg0, arg1, arg2, arg3, arg4) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.crop(retptr, ptr0, len0, arg1, arg2, arg3, arg4);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @param {number} arg2
* @param {number} arg3
* @param {boolean} arg4
* @param {boolean} arg5
* @param {boolean} arg6
* @returns {Uint8Array}
*/
export function resize(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const ptr0 = passArray8ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        wasm.resize(retptr, ptr0, len0, arg1, arg2, arg3, arg4, arg5, arg6);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getArrayU8FromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;


    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

export function __widl_f_log_1_(arg0) {
    console.log(getObject(arg0));
}

let cachedTextDecoder = new TextDecoder('utf-8');

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

export function __wbg_error_f7214ae7db04600c(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);

    varg0 = varg0.slice();
    wasm.__wbindgen_free(arg0, arg1 * 1);

    console.error(varg0);
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

export function __wbg_new_a99726b0abef495b() {
    return addHeapObject(new Error());
}

let cachedTextEncoder = new TextEncoder('utf-8');

function passStringToWasm(arg) {

    const buf = cachedTextEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
}

export function __wbg_stack_4931b18709aff089(ret, arg0) {

    const retptr = passStringToWasm(getObject(arg0).stack);
    const retlen = WASM_VECTOR_LEN;
    const mem = getUint32Memory();
    mem[ret / 4] = retptr;
    mem[ret / 4 + 1] = retlen;

}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

export function __wbindgen_object_drop_ref(i) { dropObject(i); }

export function __wbindgen_string_new(p, l) {
    return addHeapObject(getStringFromWasm(p, l));
}

export function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

