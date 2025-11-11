# @ecies/post-quantum

[![License](https://img.shields.io/github/license/ecies/js-post-quantum.svg)](https://github.com/ecies/js-post-quantum)
[![NPM Package](https://img.shields.io/npm/v/@ecies/post-quantum.svg)](https://www.npmjs.com/package/@ecies/post-quantum)
[![NPM Downloads](https://img.shields.io/npm/dm/@ecies/post-quantum)](https://npm-stat.link/@ecies/post-quantum)
[![Bundle size](https://badgen.net/bundlephobia/minzip/@ecies/post-quantum)](https://bundlephobia.com/package/@ecies/post-quantum@latest)
[![CI](https://img.shields.io/github/actions/workflow/status/ecies/js-post-quantum/ci.yml)](https://github.com/ecies/js-post-quantum/actions)
[![Codecov](https://img.shields.io/codecov/c/github/ecies/js-post-quantum.svg)](https://codecov.io/gh/ecies/js-post-quantum)

Post-quantum Cryptography Integrated Encryption Scheme in TypeScript, replacing "ec" in [`eciesjs`](https://github.com/ecies/js) with ML-KEM (Module-Lattice Key Encapsulation Mechanism).

## Install

```bash
npm install @ecies/post-quantum
```

## Quick start

```typescript
// example/runtime/main.js
import { DEFAULT_CONFIG, decrypt, encrypt } from "@ecies/post-quantum";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const msg = encoder.encode("hello world🌍");

const { secretKey, publicKey } = DEFAULT_CONFIG.asymmetricModule.keygen();
const encrypted = encrypt(publicKey, msg);
const decrypted = decrypt(secretKey, encrypted);

console.log(decoder.decode(decrypted));
```

Or run the example code:

```bash
$ pnpm install && pnpm build && cd example/runtime && pnpm install && node main.js
hello world🌍
```

## API

### `encrypt(receiverPK: Uint8Array, data: Uint8Array, config?: Config): Uint8Array`

Parameters:

- `receiverPK` - Raw public key of the receiver
- `data` - Data to encrypt
- `config` - Configuration options, default to `DEFAULT_CONFIG`

Returns: `Uint8Array`

### `decrypt(receiverSK: Uint8Array, data: Uint8Array, config?: Config): Uint8Array`

Parameters:

- `receiverSK` - Raw private key of the receiver
- `data` - Data to decrypt
- `config` - Configuration options, default to `DEFAULT_CONFIG`

Returns: `Uint8Array`

## Configuration

Following configurations are available.

- Asymmetric key encapsulation algorithm: ML-KEM-512, ML-KEM-768 or ML-KEM-1024
- Symmetric cipher algorithm: AES-256-GCM or XChaCha20-Poly1305
- Symmetric nonce length: 12 or 16 bytes (only for AES-256-GCM)

```typescript
export type AsymmetricAlgorithm = "ml-kem-512" | "ml-kem-768" | "ml-kem-1024";
export type SymmetricAlgorithm = "aes-256-gcm" | "xchacha20";
export type NonceLength = 12 | 16; // aes-256-gcm only

export class Config {
  asymmetricAlgorithm: AsymmetricAlgorithm = "ml-kem-768";
  symmetricAlgorithm: SymmetricAlgorithm = "aes-256-gcm";
  symmetricNonceLength: NonceLength = 16; // aes-256-gcm only
}

export const DEFAULT_CONFIG = new Config();
```

### Which configuration should I choose?

About KEM, because ML-KEM creates a bunch of extra data (respectively 768, 1088, 1568 bytes) in payload, you can just use the NIST recommended default ML-KEM-768 (see FIPS 203, p40). If you need extra security, use ML-KEM-1024.

About symmetric ciphers, if you are running on low-end devices or you are a security paranoid, XChaCha20-Poly1305 is a better choice than AES-256-GCM.

## Multi-platform Support

|              | Fully Supported |
| ------------ | --------------- |
| Node         | ✅               |
| Bun          | ✅               |
| Deno         | ✅ (see below)   |
| Browser      | ✅               |
| React Native | ✅               |

Via [`@ecies/ciphers`](https://github.com/ecies/js-ciphers), `node:crypto`'s native implementation of AES-256-GCM and XChaCha20-Poly1305 is chosen if available.

### Browser

This library is browser-friendly, check the [`example/browser`](./example/browser) directory for details. You can check [the online demo](https://post-quantum-demo.ecies.org/) as well.

### Bun/Deno

For bun/deno, see [`example/runtime`](./example/runtime).

For deno, you may need to run with `deno run --conditions deno` (>=2.4.0) or `deno run --unstable-node-conditions deno` (>=2.3.6,<2.4.0).

### React Native

You may need to polyfill [`crypto.getRandomValues`](https://github.com/LinusU/react-native-get-random-values) for React Native.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
