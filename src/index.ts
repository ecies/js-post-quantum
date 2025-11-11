import { concatBytes } from "@noble/hashes/utils.js";

import { type Config, DEFAULT_CONFIG } from "./config.js";
import { symDecrypt, symEncrypt } from "./utils/index.js";

/**
 * Encrypts data with a receiver's public key.
 * @description Use post-quantum public-key to create a shared secret, then encrypt data symmetrically.
 *
 * @param receiverPK - Raw public key of the receiver
 * @param data - Data to encrypt
 * @param config - Configuration options, default to `DEFAULT_CONFIG`
 * @returns Encrypted payload, format: `encrypted public key || encrypted`
 */
export function encrypt(
  receiverPK: Uint8Array,
  data: Uint8Array,
  config: Config = DEFAULT_CONFIG
): Uint8Array {
  const module = config.asymmetricModule;
  const { cipherText: pke, sharedSecret: sharedKey } = module.encapsulate(receiverPK);
  const encrypted = symEncrypt(
    config.symmetricAlgorithm,
    config.symmetricNonceLength,
    sharedKey,
    data
  );
  return concatBytes(pke, encrypted);
}

/**
 * Decrypts data with a receiver's private key.
 * @description Use post-quantum private-key to create a shared secret, then decrypt data symmetrically.
 *
 * @param receiverSK - Raw private key of the receiver
 * @param data - Data to decrypt
 * @param config - Configuration options, default to `DEFAULT_CONFIG`
 * @returns Decrypted plain text
 */
export function decrypt(
  receiverSK: Uint8Array,
  data: Uint8Array,
  config: Config = DEFAULT_CONFIG
): Uint8Array {
  const module = config.asymmetricModule;
  const pkeSize = config.pkeSize;

  const pke = data.subarray(0, pkeSize);
  const encrypted = data.subarray(pkeSize);
  // NOTE: can be MITM attacked. The error will be covered by AEAD ciphers underneath.
  const sharedKey = module.decapsulate(pke, receiverSK);
  return symDecrypt(
    config.symmetricAlgorithm,
    config.symmetricNonceLength,
    sharedKey,
    encrypted
  );
}

export { Config, DEFAULT_CONFIG } from "./config.js";
