const ByteEncoder = new TextEncoder();
const ByteDecoder = new TextDecoder();

export function encode(string) {
  const bytes = ByteEncoder.encode(string);
  const binString = String.fromCharCode(...bytes);
  return btoa(binString);
}

export function decode(base64) {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  return ByteDecoder.decode(bytes);
}
