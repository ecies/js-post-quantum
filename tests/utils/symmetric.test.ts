import { randomBytes } from "@noble/hashes/utils.js";
import { describe, expect, it } from "vitest";

import type { NonceLength, SymmetricAlgorithm } from "../../src/config";
import { symDecrypt, symEncrypt } from "../../src/utils";

describe("test symmetric", () => {
  const run = (algo: SymmetricAlgorithm, nonceLength: NonceLength = 16) => {
    const key = randomBytes(32);
    const plainText = randomBytes(100);
    const encrypted = symEncrypt(algo, nonceLength, key, plainText);
    const decrypted = symDecrypt(algo, nonceLength, key, encrypted);
    expect(decrypted).toStrictEqual(plainText);
  };

  it("tests encrypt/decrypt", async () => {
    run("aes-256-gcm", 16);
    run("aes-256-gcm", 12);
    run("xchacha20");
  });

  it("tests error", async () => {
    expect(() => {
      //@ts-expect-error
      symEncrypt("invalid-algo", 16, new Uint8Array(), new Uint8Array());
    }).toThrowError("Unsupported symmetric cipher: invalid-algo");
  });
});
