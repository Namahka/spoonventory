import * as Crypto from "expo-crypto";

export async function hashValue(value: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);
}
