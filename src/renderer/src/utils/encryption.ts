// utils/hash.ts
import CryptoJS from "crypto-js"

export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString()
}
