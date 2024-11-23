import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncrDecrService {

  constructor() { }

  EncryptPassword(Value) {
    return CryptoJS.AES.encrypt(Value, 'Pr!dcr0n@990').toString()
  }

  decryptPassword(Value) {
    var bytes = CryptoJS.AES.decrypt(Value, 'Pr!dcr0n@990');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
  }

  get(value) {
    var key = CryptoJS.enc.Utf8.parse('Pr@dac0n!@6468ED');
    var iv = CryptoJS.enc.Utf8.parse('Pr@dac0n!@6468ED');
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  set(value) {
    var key = CryptoJS.enc.Utf8.parse('Pr@dac0n!@6468ED');
    var iv = CryptoJS.enc.Utf8.parse('Pr@dac0n!@6468ED');
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }


}
