import { ml_kem512, ml_kem768, ml_kem1024 } from "@noble/post-quantum/ml-kem.js";

import {
  ML_KEM_512_PKE_SIZE,
  ML_KEM_768_PKE_SIZE,
  ML_KEM_1024_PKE_SIZE,
} from "./consts.js";

export type AsymmetricAlgorithm = "ml-kem-512" | "ml-kem-768" | "ml-kem-1024";
export type SymmetricAlgorithm = "aes-256-gcm" | "xchacha20";
export type NonceLength = 12 | 16; // aes-256-gcm only

export class Config {
  asymmetricAlgorithm: AsymmetricAlgorithm = "ml-kem-768";
  symmetricAlgorithm: SymmetricAlgorithm = "aes-256-gcm";
  symmetricNonceLength: NonceLength = 16; // aes-256-gcm only

  get asymmetricModule() {
    switch (this.asymmetricAlgorithm) {
      case "ml-kem-512":
        return ml_kem512;
      case "ml-kem-768": // Recommended default by NIST FIPS 203.
        return ml_kem768;
      case "ml-kem-1024":
        return ml_kem1024;
      default:
        throw new Error(`Unsupported asymmetric algorithm: ${this.asymmetricAlgorithm}`);
    }
  }

  get pkeSize(): number {
    switch (this.asymmetricAlgorithm) {
      case "ml-kem-512":
        return ML_KEM_512_PKE_SIZE;
      case "ml-kem-768":
        return ML_KEM_768_PKE_SIZE;
      case "ml-kem-1024":
        return ML_KEM_1024_PKE_SIZE;
      default:
        throw new Error(`Unsupported asymmetric algorithm: ${this.asymmetricAlgorithm}`);
    }
  }
}

export const DEFAULT_CONFIG = new Config();
