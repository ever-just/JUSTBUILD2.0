/**
 * Edge Runtime compatible encryption using Web Crypto API
 * This replaces the Node.js crypto functionality for Edge Runtime compatibility
 */

const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12; // 96 bits
const TAG_LENGTH = 16; // 128 bits

/**
 * Derives a 256-bit key from the provided encryption key string using Web Crypto API
 */
async function deriveKey(encryptionKey: string): Promise<CryptoKey> {
  // First hash the key using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(encryptionKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  // Import as a CryptoKey for AES-GCM
  return await crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: ALGORITHM },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a secret using AES-256-GCM with Web Crypto API
 */
export async function encryptSecretEdge(secret: string, encryptionKey: string): Promise<string> {
  if (!secret || typeof secret !== "string") {
    throw new Error("Secret must be a non-empty string");
  }

  if (!encryptionKey || typeof encryptionKey !== "string") {
    throw new Error("Encryption key must be a non-empty string");
  }

  try {
    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Derive the encryption key
    const key = await deriveKey(encryptionKey);
    
    // Encrypt the secret
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      data
    );

    // CRITICAL: Web Crypto API's AES-GCM returns EncryptedData + AuthTag concatenated
    // Railway expects: IV + EncryptedData + AuthTag
    // We need to extract the auth tag separately to match Railway's format
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const encryptedData = encryptedArray.slice(0, encryptedArray.length - TAG_LENGTH);
    const authTag = encryptedArray.slice(encryptedArray.length - TAG_LENGTH);

    // Combine in Railway expected format: IV + EncryptedData + AuthTag
    const combined = new Uint8Array(IV_LENGTH + encryptedData.length + TAG_LENGTH);
    combined.set(iv, 0);
    combined.set(encryptedData, IV_LENGTH);
    combined.set(authTag, IV_LENGTH + encryptedData.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    throw new Error(
      `Failed to encrypt secret: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Decrypts a secret using AES-256-GCM with Web Crypto API
 */
export async function decryptSecretEdge(encryptedSecret: string, encryptionKey: string): Promise<string> {
  if (!encryptedSecret || typeof encryptedSecret !== "string") {
    throw new Error("Encrypted secret must be a non-empty string");
  }

  if (!encryptionKey || typeof encryptionKey !== "string") {
    throw new Error("Encryption key must be a non-empty string");
  }

  try {
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedSecret)
        .split("")
        .map(char => char.charCodeAt(0))
    );

    // Minimum length check
    if (combined.length < IV_LENGTH + 1) {
      throw new Error("Invalid encrypted secret format: too short");
    }

    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const encrypted = combined.slice(IV_LENGTH);

    // Derive the encryption key
    const key = await deriveKey(encryptionKey);

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encrypted
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error(
      `Failed to decrypt secret: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
