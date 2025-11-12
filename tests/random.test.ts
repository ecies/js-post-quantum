import { describe, expect, it } from "vitest";

import { type Config, DEFAULT_CONFIG, decrypt, encrypt } from "../src";

const TEXT = "hello world🌍";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

describe("test encrypt and decrypt", () => {
  const msg = encoder.encode(TEXT);

  const run = (config: Config) => {
    const { secretKey, publicKey } = config.asymmetricModule.keygen();
    const encrypted = encrypt(publicKey, msg);
    const decrypted = decrypt(secretKey, encrypted);
    expect(decoder.decode(decrypted)).toBe(TEXT);
  };

  it("tests default", async () => {
    run(DEFAULT_CONFIG);
    DEFAULT_CONFIG.symmetricAlgorithm = "xchacha20";
    run(DEFAULT_CONFIG);
  });

  it("tests ml-kem-512", async () => {
    DEFAULT_CONFIG.asymmetricAlgorithm = "ml-kem-512";
    run(DEFAULT_CONFIG);
    DEFAULT_CONFIG.symmetricAlgorithm = "xchacha20";
    run(DEFAULT_CONFIG);
  });

  it("tests ml-kem-1024", async () => {
    DEFAULT_CONFIG.asymmetricAlgorithm = "ml-kem-1024";
    run(DEFAULT_CONFIG);
    DEFAULT_CONFIG.symmetricAlgorithm = "xchacha20";
    run(DEFAULT_CONFIG);
  });

  it("tests error", async () => {
    const { secretKey: sk1 } = DEFAULT_CONFIG.asymmetricModule.keygen();
    const { publicKey: pk2 } = DEFAULT_CONFIG.asymmetricModule.keygen();
    const encrypted = encrypt(pk2, msg);

    const nodeCryptoError = "Unsupported state or unable to authenticate data";
    const nobleCipherError = "invalid tag";
    const errorRegex = new RegExp(nodeCryptoError + "|" + nobleCipherError);
    expect(() => decrypt(sk1, encrypted)).toThrowError(errorRegex);
  });
});
