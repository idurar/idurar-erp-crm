import { prisma } from "../prisma";
import { hashSecret, compareSecret } from "./password";
import { randomDigits } from "./codes";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function issueOtp(phone: string): Promise<string> {
  const code = randomDigits(6);
  await prisma.otpCode.create({
    data: {
      phone,
      codeHash: hashSecret(code),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });
  return code;
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const candidates = await prisma.otpCode.findMany({
    where: { phone, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  for (const candidate of candidates) {
    if (compareSecret(code, candidate.codeHash)) {
      await prisma.otpCode.update({ where: { id: candidate.id }, data: { consumed: true } });
      return true;
    }
  }
  return false;
}
