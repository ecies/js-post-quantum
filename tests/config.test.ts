import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIG } from "../src";

describe("test config", () => {
  it("tests default", async () => {
    expect(DEFAULT_CONFIG.asymmetricAlgorithm).toBe("ml-kem-768");
    expect(DEFAULT_CONFIG.symmetricAlgorithm).toBe("aes-256-gcm");
    expect(DEFAULT_CONFIG.symmetricNonceLength).toBe(16);
  });

  it("tests error", () => {
    // @ts-expect-error
    DEFAULT_CONFIG.asymmetricAlgorithm = "invalid-algo";
    expect(() => {
      DEFAULT_CONFIG.pkeSize;
    }).toThrowError("Unsupported asymmetric algorithm: invalid-algo");

    expect(() => {
      DEFAULT_CONFIG.asymmetricModule;
    }).toThrowError("Unsupported asymmetric algorithm: invalid-algo");
  });
});
