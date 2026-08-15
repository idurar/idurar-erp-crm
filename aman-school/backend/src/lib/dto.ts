import type { User } from "@prisma/client";

/** Strips sensitive fields (passwordHash/pinHash) before a User row ever leaves the process. */
export function toUserDto(user: User) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    phone: user.phone,
    email: user.email,
    schoolId: user.schoolId,
    partnerId: user.partnerId,
    employeeCode: user.employeeCode,
    licenseNumber: user.licenseNumber,
    licenseExpiresAt: user.licenseExpiresAt,
    yearsExperience: user.yearsExperience,
  };
}
