import crypto from 'crypto';
import { Buffer } from 'buffer';

export enum HashingStrategy {
  PBKDF2_SHA512 = 'sha512',
}

export type CryptoContextOptions = {
  digest?: HashingStrategy;
  encoding?: BufferEncoding;
};

export class CryptoContext {
  protected _digest: HashingStrategy;
  protected _encoding: BufferEncoding;
  public constructor({ digest, encoding }: CryptoContextOptions) {
    this._digest = digest || HashingStrategy.PBKDF2_SHA512;
    this._encoding = encoding || 'base64';
  }
  protected b64trimmed(buf: any) {
    const b64 = buf
      .toString(this._encoding)
      .replace(/=*$/, '')
      .replace(/\++/gm, '.');
    return b64;
  }
  protected b64decode(str: any) {
    // . in Base64?
    str = str.replace(/\.+/gm, '+');
    if (str.length % 4) {
      str += '='.repeat(4 - (str.length % 4));
    }
    return Buffer.from(str, this._encoding);
  }
  public hash(
    password: crypto.BinaryLike,
    salt: crypto.BinaryLike,
    rounds: number,
    klen: number = 64,
  ) {
    const hashed = crypto.pbkdf2Sync(
      password,
      salt,
      rounds,
      klen,
      this._digest,
    );
    var h = this.b64trimmed(hashed);
    var joinedHash = [
      '',
      'pbkdf2-' + this._digest,
      rounds,
      this.b64trimmed(salt),
      h,
    ].join('$');

    return joinedHash;
  }
  public verify(password: string, stored_hash: string) {
    const [skip, scheme, rounds, salt] = stored_hash.split('$');

    if (scheme !== 'pbkdf2-sha512') {
      throw {
        message: 'Unsupported Algorithm, Found: ' + scheme,
      };
    }
    var h = this.hash(password, this.b64decode(salt), Number(rounds));

    return h === stored_hash;
  }
  public generateSalt(bytes: number = 16) {
    var salt = crypto.randomBytes(bytes);
    return salt;
  }
}

export class CryptoContextOld extends CryptoContext {
  protected b64trimmed(buf: any) {
    return buf.toString(this._encoding).replace(/=*$/, '').replace('+', '.');
  }
  protected b64decode(str: any) {
    // . in Base64?
    str = str.replace('.', '+');
    if (str.length % 4) {
      str += '='.repeat(4 - (str.length % 4));
    }
    return Buffer.from(str, this._encoding);
  }
}
