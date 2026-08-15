import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export function hashSecret(plain: string): string {
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}

export function compareSecret(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}
