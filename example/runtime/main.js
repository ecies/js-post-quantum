import { DEFAULT_CONFIG, decrypt, encrypt } from "@ecies/post-quantum";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const msg = encoder.encode("hello world🌍");

const { secretKey, publicKey } = DEFAULT_CONFIG.asymmetricModule.keygen();
const encrypted = encrypt(publicKey, msg);
const decrypted = decrypt(secretKey, encrypted);

console.log(decoder.decode(decrypted));
