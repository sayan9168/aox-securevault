// SAYANOX V1.1 - Web Crypto AES-GCM Implementation
const ITERATIONS = 600_000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

export async function deriveKey(password: string, salt?: Uint8Array) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  const finalSalt = salt || crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: finalSalt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
  return { key, salt: finalSalt };
}

export async function encrypt(data: string, password: string) {
  const { key, salt } = await deriveKey(password);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(data);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  
  // Pack: salt(16) + iv(12) + ciphertext
  const packed = new Uint8Array(salt.length + iv.length + new Uint8Array(ciphertext).length);
  packed.set(salt, 0);
  packed.set(iv, salt.length);
  packed.set(new Uint8Array(ciphertext), salt.length + iv.length);
  
  return btoa(String.fromCharCode(...packed));
}

export async function decrypt(packedB64: string, password: string): Promise<string | null> {
  try {
    const packed = Uint8Array.from(atob(packedB64), c => c.charCodeAt(0));
    const salt = packed.slice(0, SALT_LENGTH);
    const iv = packed.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const ciphertext = packed.slice(SALT_LENGTH + IV_LENGTH);
    
    const { key } = await deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
  } catch {
    return null; // Wrong password or corrupted data
  }
      }
