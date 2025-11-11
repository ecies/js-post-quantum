import { bytesToHex } from "@noble/ciphers/utils";
import { DEFAULT_CONFIG, decrypt, encrypt } from "@ecies/post-quantum";

import "./style.css";

DEFAULT_CONFIG.symmetricAlgorithm = "xchacha20";

const keyPair = DEFAULT_CONFIG.asymmetricModule.keygen();
const sk = keyPair.secretKey;
const pk = keyPair.publicKey;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function setup(inputElement, textElement, encryptedElement, decryptedElement) {
  let encrypted;
  let text = inputElement.value;
  textElement.innerHTML = text;
  encryptedElement.innerHTML = "click me to encrypt";
  decryptedElement.innerHTML = "click me to decrypt";

  const _encrypt = () => {
    encrypted = encrypt(pk, encoder.encode(text));
    encryptedElement.innerHTML = "encrypted:";
    textElement.innerHTML = `<code>${bytesToHex(encrypted)}</code>`;
    decryptedElement.innerHTML = "click me to decrypt";
  };
  const _decrypt = () => {
    encryptedElement.innerHTML = "click me to encrypt";
    if (encrypted) {
      const decrypted = decoder.decode(decrypt(sk, encrypted));
      textElement.innerHTML = `${decrypted}`;
      decryptedElement.innerHTML = "decrypted:";
      encrypted = undefined;
    } else {
      textElement.innerHTML = "click encrypt button first";
    }
  };
  const _onTextInput = (e) => {
    const target = e.target;
    if (target) {
      encrypted = undefined;
      const value = target.value;
      text = value;
      textElement.innerHTML = value;
      encryptedElement.innerHTML = "click me to encrypt";
      decryptedElement.innerHTML = "click me to decrypt";
    }
  };
  encryptedElement.addEventListener("click", () => _encrypt());
  decryptedElement.addEventListener("click", () => _decrypt());
  inputElement.addEventListener("input", _onTextInput);
}

document.querySelector("#app").innerHTML = `
  <div>
    <h1>Hello post-quantum!</h1>
    <div class="card">
      <button id="encrypted" type="button"></button>
      <button id="decrypted" type="button"></button>
    </div>
    <input id="text-input" type="text" value="hello post-quantum🔒" />
    <p id="text"></p>
  </div>
`;

setup(
  document.querySelector("#text-input"),
  document.querySelector("#text"),
  document.querySelector("#encrypted"),
  document.querySelector("#decrypted")
);
