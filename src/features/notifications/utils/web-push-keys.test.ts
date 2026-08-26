import { describe, expect, it } from 'vitest';

function toUint8Array(source: BufferSource): Uint8Array {
  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source);
  }
  if (ArrayBuffer.isView(source)) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }
  return new Uint8Array(source);
}

function applicationServerKeysEqual(left: BufferSource, right: Uint8Array): boolean {
  const leftBytes = toUint8Array(left);
  if (leftBytes.byteLength !== right.byteLength) {
    return false;
  }
  return leftBytes.every((value, index) => value === right[index]);
}

describe('applicationServerKeysEqual', () => {
  it('matches identical VAPID public key bytes', () => {
    const key = new Uint8Array([4, 1, 2, 3, 4]);
    expect(applicationServerKeysEqual(key, key)).toBe(true);
  });

  it('detects mismatched VAPID public key bytes', () => {
    const left = new Uint8Array([4, 1, 2, 3, 4]);
    const right = new Uint8Array([4, 9, 2, 3, 4]);
    expect(applicationServerKeysEqual(left, right)).toBe(false);
  });
});
