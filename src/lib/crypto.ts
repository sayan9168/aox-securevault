// SAYANOX V1.1 - Web Crypto AES-GCM Implementation
// Zero-knowledge client-side encryption

const ITERATIONS = 600_000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

export async function deriveKey(password: string, salt?: Uint8Array) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const finalSalt: Uint8Array = salt ?? crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: finalSalt as unknown as BufferSource,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return { key, salt: finalSalt };
}

export async function encrypt(data: string, password: string): Promise<string> {
  const { key, salt } = await deriveKey(password);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(data);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    encoded
  );

  const cipherArray = new Uint8Array(ciphertext);
  const packed = new Uint8Array(salt.length + iv.length + cipherArray.length);
  packed.set(salt, 0);
  packed.set(iv, salt.length);
  packed.set(cipherArray, salt.length + iv.length);

  return btoa(String.fromCharCode(...packed));
}

export async function decrypt(packedB64: string, password: string): Promise<string | null> {
  try {
    const packed = Uint8Array.from(atob(packedB64), (c) => c.charCodeAt(0));
    const salt = packed.slice(0, SALT_LENGTH);
    const iv = packed.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const ciphertext = packed.slice(SALT_LENGTH + IV_LENGTH);

    const { key } = await deriveKey(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      key,
      ciphertext as unknown as BufferSource
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
                            }
