import crypto from "node:crypto";
import { VaultModel } from "@/lib/server/models";

function encryptionKey() {
  const raw = process.env.WALLET_ENCRYPTION_KEY;
  if (!raw) throw new Error("WALLET_ENCRYPTION_KEY is not configured");
  return crypto.createHash("sha256").update(raw).digest();
}

export async function storePrivateKey(userId: unknown, privateKey: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(privateKey, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  await VaultModel.findOneAndUpdate(
    { userId },
    { encryptedPrivateKey: encrypted.toString("base64"), iv: iv.toString("base64"), authTag: authTag.toString("base64") },
    { upsert: true, new: true },
  );
}

export async function readPrivateKey(userId: unknown) {
  const vault = await VaultModel.findOne({ userId }).lean();
  if (!vault?.encryptedPrivateKey || !vault.iv || !vault.authTag) return null;
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(vault.iv, "base64"));
  decipher.setAuthTag(Buffer.from(vault.authTag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(vault.encryptedPrivateKey, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
