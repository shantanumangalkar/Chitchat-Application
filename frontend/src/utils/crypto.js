/**
 * Helper to derive an AES-GCM key from a roomCode string by computing its SHA-256 hash.
 */
async function getCryptoKey(roomCode) {
  if (!roomCode) throw new Error('Room code is required for cryptographic key derivation');
  
  const enc = new TextEncoder();
  const rawKey = enc.encode(roomCode);
  const hash = await crypto.subtle.digest('SHA-256', rawKey);
  
  return await crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a message string using AES-GCM with a derived key from roomCode.
 * Returns a base64 encoded string containing the IV + Ciphertext.
 * 
 * @param {string} plainText 
 * @param {string} roomCode 
 * @returns {Promise<string>} Base64 encoded encrypted message
 */
export async function encryptMessage(plainText, roomCode) {
  if (!plainText) return '';
  const key = await getCryptoKey(roomCode);
  
  // Generate a random 12-byte Initialization Vector (IV)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const encoded = enc.encode(plainText);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoded
  );
  
  // Combine IV and Ciphertext for easy storage and transmission
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  // Convert binary combined array to base64
  let binary = '';
  const len = combined.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}

/**
 * Decrypts a base64 encoded message string (containing IV + Ciphertext) using AES-GCM.
 * 
 * @param {string} encryptedBase64 
 * @param {string} roomCode 
 * @returns {Promise<string>} Decrypted plain text message
 */
export async function decryptMessage(encryptedBase64, roomCode) {
  if (!encryptedBase64) return '';
  try {
    const key = await getCryptoKey(roomCode);
    
    // Decode base64 string to binary array
    const binary = atob(encryptedBase64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // Extract IV (first 12 bytes) and Ciphertext (the rest)
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      ciphertext
    );
    
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    // If it cannot be decrypted, it might be an unencrypted system/historical message,
    // or key mismatch. Fallback gracefully to the raw content.
    return encryptedBase64;
  }
}
