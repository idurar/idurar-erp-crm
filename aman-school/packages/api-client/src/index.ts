import {
  Alert,
  AuthResponse,
  Bus,
  Notification,
  School,
  Student,
  Trip,
  TripEvent,
  User,
} from "@aman-school/types";
import { ApiClientConfig, createHttp } from "./http";
export { createSocket } from "./socket";
export * from "./http";

/** Bus + backend-only runtime telemetry fields (see backend/prisma/schema.prisma
 * comment on the Bus model) — additive, never sent by the client, only read. */
export type BusWithTelemetry = Bus & {
  gpsActive: boolean;
  currentLat: number | null;
  currentLng: number | null;
  currentSpeedKmh: number | null;
  lastGpsAt: string | null;
  route?: { id: string; stops: Array<{ id: string; order: number; name: string; lat: number; lng: number }> } | null;
};

export function createApiClient(config: ApiClientConfig) {
  const http = createHttp(config);

  return {
    auth: {
      supervisorLogin: (employeeCode: string) =>
        http.post<{ ok: true }>("/auth/supervisor/login", { employeeCode }),
      supervisorPinVerify: (employeeCode: string, pin: string) =>
        http.post<AuthResponse>("/auth/supervisor/pin-verify", { employeeCode, pin }),
      parentRequestOtp: (phone: string) =>
        http.post<{ ok: true }>("/auth/parent/request-otp", { phone }),
      parentVerifyOtp: (phone: string, code: string) =>
        http.post<AuthResponse>("/auth/parent/verify-otp", { phone, code }),
      schoolAdminLogin: (email: string, password: string, otp?: string) =>
        http.post<AuthResponse>("/auth/school-admin/login", { email, password, otp }),
      opsRoomLogin: (email: string, password: string) =>
        http.post<AuthResponse>("/auth/ops-room/login", { email, password }),
      ownerLogin: (email: string, password: string) =>
        http.post<AuthResponse>("/auth/owner/login", { email, password }),
      // sa-login: sysadmin has a mandatory 2FA step — login only starts it.
      sysadminLogin: (email: string, password: string) =>
        http.post<{ requires2fa: true; email: string; devOtp?: string }>("/auth/sysadmin/login", { email, password }),
      sysadminVerify2fa: (email: string, code: string) =>
        http.post<AuthResponse>("/auth/sysadmin/verify-2fa", { email, code }),
      partnerLogin: (email: string, password: string) =>
        http.post<AuthResponse>("/auth/partner/login", { email, password }),
      regulatorLogin: (email: string, password: string) =>
        http.post<AuthResponse>("/auth/regulator/login", { email, password }),
      driverLogin: (employeeCode: string) =>
        http.post<{ ok: true }>("/auth/driver/login", { employeeCode }),
      driverPinVerify: (employeeCode: string, pin: string) =>
        http.post<AuthResponse>("/auth/driver/pin-verify", { employeeCode, pin }),
      refresh: (refreshToken: string) => http.post<AuthResponse>("/auth/refresh", { refreshToken }),
      logout: (refreshToken: string) => http.post<void>("/auth/logout", { refreshToken }),
    },

    consent: {
      status: () => http.get<{ required: boolean; currentVersion: string; latest: unknown }>("/consent/status"),
      record: (body: { trackingConsent: boolean; medicalConsent: boolean; policyConsent: boolean; appVersion?: string }) =>
        http.post("/consent/record", body),
      withdraw: () => http.post<{ ok: true }>("/consent/withdraw"),
    },

    supervisor: {
      todayTrips: () => http.get<Trip[]>("/supervisor/trips/today"),
      tripHistory: () => http.get<Trip[]>("/supervisor/trips/history"),
      assignSupervisor: (tripId: string) => http.post(`/trips/${tripId}/assign-supervisor`),
      tripStudents: (tripId: string) => http.get<Student[]>(`/trips/${tripId}/students`),
      startTrip: (tripId: string) => http.post<Trip>(`/trips/${tripId}/start`),
      setBusGpsActive: (busId: string, active: boolean) =>
        http.put(`/buses/${busId}/gps-active`, { active }),
      board: (tripId: string, studentId: string, method: "nfc" | "manual" = "nfc") =>
        http.post<TripEvent>(`/trips/${tripId}/board`, { studentId, method }),
      alight: (tripId: string, studentId: string) =>
        http.post<TripEvent>(`/trips/${tripId}/alight`, { studentId }),
      searchStudents: (query: string) =>
        http.get<Student[]>(`/students/search?q=${encodeURIComponent(query)}`),
      manualBoard: (tripId: string, studentId: string, reason: string) =>
        http.post<TripEvent>(`/trips/${tripId}/manual-board`, { studentId, reason }),
      liveStatus: (tripId: string) => http.get<Trip & { events: TripEvent[] }>(`/trips/${tripId}/live-status`),
      recordException: (tripId: string, body: { type: string; description: string; photoUrl?: string }) =>
        http.post(`/trips/${tripId}/exception`, body),
      endTrip: (tripId: string) => http.put<Trip>(`/trips/${tripId}/end`),
      tripReport: (tripId: string) => http.get(`/trips/${tripId}/report`),
      sos: (body: { tripId: string | null; lat: number; lng: number; description?: string }) =>
        http.post("/emergency/sos", body),
      notifications: (supervisorId: string) =>
        http.get<Notification[]>(`/supervisor/${supervisorId}/notifications`),
      updateSettings: (supervisorId: string, body: Record<string, unknown>) =>
        http.put(`/supervisor/${supervisorId}/settings`, body),
      changePin: (supervisorId: string, currentPin: string, newPin: string) =>
        http.put<{ ok: true }>(`/supervisor/${supervisorId}/pin`, { currentPin, newPin }),
      profile: (supervisorId: string) => http.get(`/supervisor/${supervisorId}/profile`),
      pickupInfo: (tripId: string, studentId: string) =>
        http.get(`/trips/${tripId}/students/${studentId}/pickup-info`),
      verifiedAlight: (tripId: string, studentId: string, verifiedBy: "parent" | "delegate", delegateId?: string) =>
        http.post<TripEvent>(`/trips/${tripId}/alight`, { studentId, verifiedBy, delegateId }),
      reportNotCollected: (tripId: string, studentId: string) =>
        http.post(`/trips/${tripId}/students/${studentId}/not-collected`),
      markCollected: (tripId: string, studentId: string, note?: string) =>
        http.put(`/trips/${tripId}/students/${studentId}/collected`, { note }),
      medicalEmergencyAccess: (studentId: string, tripId?: string) =>
        http.post(`/students/${studentId}/medical/emergency-access`, { tripId }),
      reportMaintenanceIssue: (busId: string, notes: string) =>
        http.post(`/buses/${busId}/maintenance`, { type: "emergency", notes }),
    },

    driver: {
      myBus: () => http.get<BusWithTelemetry | null>("/drivers/me/bus"),
      reportBreakdown: (busId: string, notes: string) =>
        http.post(`/buses/${busId}/maintenance`, { type: "emergency", notes }),
      maintenanceHistory: (busId: string) => http.get(`/buses/${busId}/maintenance`),
      sos: (body: { tripId: string | null; lat: number; lng: number; description?: string }) =>
        http.post("/emergency/sos", body),
    },

    notifications: {
      markRead: (id: string) => http.put(`/notifications/${id}/read`),
      mine: () => http.get<Notification[]>("/notifications/mine"),
      updatePrefs: (body: Record<string, unknown>) =>
        http.put<{ ok: true; notificationPrefs: unknown }>("/users/me/notification-prefs", body),
    },

    support: {
      contact: (body: { message: string; channel?: string }) => http.post("/support/contact", body),
    },

    parent: {
      linkStudent: (studentCode: string) =>
        http.post<Student>("/parents/students/link", { studentCode }),
      childrenStatus: (parentId: string) =>
        http.get<Array<Student & { status: string; lastUpdate: string }>>(
          `/parents/${parentId}/children/status`
        ),
      studentTodayStatus: (studentId: string) => http.get(`/students/${studentId}/today-status`),
      studentDetails: (studentId: string) => http.get<Student>(`/students/${studentId}/details`),
      busEta: (busId: string) => http.get<{ etaMinutes: number; distanceKm: number; stopsBefore: number }>(
        `/buses/${busId}/eta`
      ),
      studentTrips: (studentId: string, from: string, to: string) =>
        http.get<Trip[]>(`/students/${studentId}/trips?from=${from}&to=${to}`),
      notifications: (parentId: string) => http.get<Notification[]>(`/parents/${parentId}/notifications`),
      markNotificationRead: (id: string) => http.put(`/notifications/${id}/read`),
      updateNotificationPrefs: (parentId: string, body: Record<string, unknown>) =>
        http.put(`/parents/${parentId}/notification-prefs`, body),
      contactSupport: (body: { message: string; channel: string }) =>
        http.post("/support/contact", body),
      // SF-2: medical profile
      medicalProfile: (studentId: string) => http.get(`/students/${studentId}/medical`),
      updateMedicalProfile: (studentId: string, body: {
        bloodType?: string; allergies?: string[]; medications?: string[]; chronicConditions?: string;
        emergencyContactName: string; emergencyContactPhone: string; doctorName?: string;
      }) => http.put(`/students/${studentId}/medical`, body),
      medicalAccessLogs: (studentId: string) => http.get(`/students/${studentId}/medical/access-logs`),
      // SF-3: pickup delegation
      delegates: (studentId: string) => http.get(`/students/${studentId}/delegates`),
      createDelegate: (studentId: string, body: {
        type: "single_day" | "period" | "permanent"; fromDate?: string; toDate?: string;
        name: string; nationalId: string; relation: string; phone: string; photoUrl?: string;
      }) => http.post(`/students/${studentId}/delegates`, body),
      cancelDelegate: (studentId: string, delegateId: string) =>
        http.put(`/students/${studentId}/delegates/${delegateId}/cancel`),
      // SF-4: lost NFC bracelet
      reportLostNfc: (studentId: string, reason?: string) =>
        http.post(`/students/${studentId}/nfc/report-lost`, { reason }),
      // OP-4: pre-announced absence
      absences: (studentId: string) => http.get(`/students/${studentId}/absences`),
      createAbsence: (studentId: string, body: { fromDate: string; toDate: string; reason?: string }) =>
        http.post(`/students/${studentId}/absences`, body),
      cancelAbsence: (studentId: string, absenceId: string) =>
        http.put(`/students/${studentId}/absences/${absenceId}/cancel`),
      // OP-7: trip rating
      rateTrip: (tripId: string, stars: number, note?: string) =>
        http.post(`/trips/${tripId}/rate`, { stars, note }),
      // BC-5/BC-6: refunds + invoices
      requestRefund: (body: { subjectType: "parent"; subjectId: string; reason: string; amountPaid: number; amountOwed: number }) =>
        http.post("/refunds/request", body),
      invoices: (parentId: string) => http.get(`/parents/${parentId}/invoices`),
    },

    school: {
      get: (schoolId: string) => http.get<School>(`/schools/${schoolId}`),
      dashboardSummary: (schoolId: string) => http.get(`/schools/${schoolId}/dashboard-summary`),
      students: (schoolId: string, query = "") => http.get<Student[]>(`/schools/${schoolId}/students${query}`),
      createStudent: (schoolId: string, body: Partial<Student>) =>
        http.post<Student>(`/schools/${schoolId}/students`, body),
      updateStudent: (studentId: string, body: Partial<Student>) =>
        http.put<Student>(`/students/${studentId}`, body),
      studentQrCode: (studentId: string) => http.get<{ qrDataUrl: string }>(`/students/${studentId}/qr-code`),
      student: (studentId: string) => http.get<Student>(`/students/${studentId}`),
      buses: (schoolId: string) => http.get<BusWithTelemetry[]>(`/schools/${schoolId}/buses`),
      createBus: (schoolId: string, body: Partial<Bus>) => http.post<BusWithTelemetry>(`/schools/${schoolId}/buses`, body),
      setBusGpsDevice: (busId: string, gpsDeviceId: string) =>
        http.put(`/buses/${busId}/gps-device`, { gpsDeviceId }),
      supervisors: (schoolId: string) => http.get<User[]>(`/schools/${schoolId}/supervisors`),
      createSupervisor: (schoolId: string, body: { name: string; phone: string }) =>
        http.post<User>(`/schools/${schoolId}/supervisors`, body),
      createRoute: (busId: string, body: { stops: Array<{ name: string; lat: number; lng: number }> }) =>
        http.post(`/buses/${busId}/route`, body),
      setStudentStop: (studentId: string, stopId: string) =>
        http.put(`/students/${studentId}/stop`, { stopId }),
      reports: (schoolId: string, query = "") => http.get(`/schools/${schoolId}/reports${query}`),
      broadcastNotification: (schoolId: string, body: { title: string; body: string }) =>
        http.post(`/schools/${schoolId}/notifications/broadcast`, body),
      updateSettings: (schoolId: string, body: Partial<School>) =>
        http.put(`/schools/${schoolId}/settings`, body),
      parents: (schoolId: string) => http.get(`/schools/${schoolId}/parents`),
      payments: (schoolId: string) => http.get(`/schools/${schoolId}/payments`),
      invoices: (schoolId: string) => http.get(`/schools/${schoolId}/invoices`),
      requestRefund: (body: { subjectType: "school"; subjectId: string; reason: string; amountPaid: number; amountOwed: number }) =>
        http.post("/refunds/request", body),

      // OP-1: edit/archive students, supervisors, buses
      archiveStudent: (studentId: string) => http.put(`/students/${studentId}`, { status: "archived" }),
      updateSupervisor: (schoolId: string, supervisorId: string, body: { name?: string; phone?: string; busId?: string | null }) =>
        http.put(`/schools/${schoolId}/supervisors/${supervisorId}`, body),
      resetSupervisorPin: (schoolId: string, supervisorId: string) =>
        http.put<{ ok: true; devPin: string }>(`/schools/${schoolId}/supervisors/${supervisorId}/reset-pin`),
      endSupervisorService: (schoolId: string, supervisorId: string) =>
        http.put(`/schools/${schoolId}/supervisors/${supervisorId}/end-service`),
      updateBus: (busId: string, body: { busNumber?: string; plateNumber?: string; capacity?: number; supervisorId?: string | null; driverId?: string | null }) =>
        http.put(`/buses/${busId}`, body),
      setBusServiceStatus: (busId: string, outOfService: boolean, reason?: string) =>
        http.put(`/buses/${busId}/service-status`, { outOfService, reason }),
      setRouteSettings: (busId: string, body: { polyline?: Array<{ lat: number; lng: number }>; deviationSensitivity?: string }) =>
        http.put(`/buses/${busId}/route-settings`, body),

      // OP-2: driver roster
      drivers: (schoolId: string) => http.get<User[]>(`/schools/${schoolId}/drivers`),
      createDriver: (schoolId: string, body: { name: string; phone: string; licenseNumber: string; licenseExpiresAt?: string; yearsExperience?: number; busId?: string }) =>
        http.post(`/schools/${schoolId}/drivers`, body),
      updateDriver: (schoolId: string, driverId: string, body: Record<string, unknown>) =>
        http.put(`/schools/${schoolId}/drivers/${driverId}`, body),

      // OP-3: calendar/holidays
      holidays: (schoolId: string) => http.get(`/schools/${schoolId}/holidays`),
      createHoliday: (schoolId: string, body: { date: string; reason: string; scope?: "all" | "morning" | "evening" }) =>
        http.post(`/schools/${schoolId}/holidays`, body),
      deleteHoliday: (schoolId: string, holidayId: string) =>
        http.delete(`/schools/${schoolId}/holidays/${holidayId}`),
      todayStatus: (schoolId: string) => http.get<{ disabled: boolean; holiday: unknown }>(`/schools/${schoolId}/today-status`),

      // OP-6: fleet maintenance
      maintenanceRecords: (busId: string) => http.get(`/buses/${busId}/maintenance`),
      addMaintenanceRecord: (busId: string, body: { type: "routine" | "emergency"; cost?: number; workshop?: string; notes?: string; date?: string }) =>
        http.post(`/buses/${busId}/maintenance`, body),
      setMaintenanceDates: (busId: string, body: { inspectionExpiresAt?: string; insuranceExpiresAt?: string }) =>
        http.put(`/buses/${busId}/maintenance-dates`, body),

      // BC-2: Excel student import
      importTemplateUrl: (schoolId: string) => `/schools/${schoolId}/students/import-template`,
      previewImport: (schoolId: string, file: { uri: string; name: string; type: string }) => {
        const form = new FormData();
        // React Native's FormData accepts a {uri,name,type} file descriptor
        // directly — not a real Blob — hence the loose cast here.
        form.append("file", file as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        return http.upload(`/schools/${schoolId}/students/import/preview`, form);
      },
      confirmImport: (schoolId: string, rows: unknown[]) =>
        http.post<{ ok: true; imported: number }>(`/schools/${schoolId}/students/import/confirm`, { rows }),
    },

    operations: {
      activeTrips: () => http.get<Trip[]>("/operations/active-trips"),
      alerts: (status: string = "active") => http.get<Alert[]>(`/alerts?status=${status}`),
      acknowledgeAlert: (id: string, assignedToUserId?: string) =>
        http.put<Alert>(`/alerts/${id}/acknowledge`, { assignedToUserId }),
      resolveAlert: (id: string, reason: string) => http.put<Alert>(`/alerts/${id}/resolve`, { reason }),
      incidents: () => http.get(`/incidents`),
      incident: (id: string) => http.get(`/incidents/${id}`),
      incidentAction: (id: string, body: { note: string }) => http.post(`/incidents/${id}/actions`, body),
      notifyParents: (id: string, body: { message: string }) =>
        http.post(`/incidents/${id}/notify-parents`, body),
      sendMessage: (body: { toUserId: string; message: string; channel: "app" | "sms" }) =>
        http.post("/operations/messages", body),
      dailyReport: () => http.get("/operations/daily-report"),
      notCollected: () => http.get("/operations/not-collected"),
      instructSupervisor: (alertId: string, instruction: string) =>
        http.post(`/operations/not-collected/${alertId}/instruct`, { instruction }),
    },

    owner: {
      platformSummary: () => http.get("/owner/platform-summary"),
      schools: (query = "") => http.get<School[]>(`/owner/schools${query}`),
      registerSchool: (body: {
        name: string; slug: string; address?: string; adminName: string; adminEmail: string;
        packageId: string; partnerId?: string;
      }) => http.post<School>("/owner/schools/register", body),
      setSchoolStatus: (schoolId: string, status: string) =>
        http.put(`/schools/${schoolId}/status`, { status }),
      schoolDetail: (schoolId: string) => http.get(`/owner/schools/${schoolId}/detail`),
      partners: () => http.get(`/owner/partners`),
      registerPartner: (body: { name: string; region: string; commissionPercent: number }) =>
        http.post("/owner/partners/register", body),
      updatePartner: (id: string, body: Record<string, unknown>) => http.put(`/owner/partners/${id}`, body),
      packages: () => http.get(`/owner/packages`),
      updatePackage: (id: string, body: Record<string, unknown>) => http.put(`/owner/packages/${id}`, body),
      subscriptions: () => http.get(`/owner/subscriptions`),
      revenueSummary: () => http.get(`/owner/revenue/summary`),
      invoices: () => http.get(`/owner/invoices`),
      analytics: () => http.get(`/owner/analytics`),
      platformSettings: () => http.get(`/owner/platform-settings`),
      updatePlatformSettings: (body: Record<string, unknown>) => http.put(`/owner/platform-settings`, body),
      users: (query = "") => http.get(`/owner/users${query}`),
      notifications: () => http.get(`/owner/notifications`),
      onboardSchool: (body: {
        name: string; slug: string; address?: string; region?: string; licenseNumber?: string; phone?: string; email?: string;
        adminName: string; adminEmail: string; packageId: string; partnerId?: string; contractCycle?: "monthly" | "yearly";
      }) => http.post<{ school: School; admin: { id: string; email: string }; devTempPassword: string }>("/owner/schools/onboard", body),
      partnerTiers: () => http.get("/owner/partner-tiers"),
      updatePartnerTier: (id: string, body: { commissionPercent?: number; minActiveSchools?: number }) =>
        http.put(`/owner/partner-tiers/${id}`, body),
      refunds: () => http.get("/owner/refunds"),
      resolveRefund: (id: string, status: "approved" | "rejected", refundAmount?: number) =>
        http.put(`/owner/refunds/${id}`, { status, refundAmount }),
      lifecyclePolicy: () => http.get("/subscriptions/lifecycle-policy"),
      updateLifecyclePolicy: (body: Record<string, unknown>) => http.put("/subscriptions/lifecycle-policy", body),
      paymentGatewayStatus: () => http.get("/payments/gateway-status"),
      // owner-features (§12)
      featureFlags: () => http.get("/owner/feature-flags"),
      createFeatureFlag: (body: { key: string; labelAr: string; description?: string }) =>
        http.post("/owner/feature-flags", body),
      updateFeatureFlag: (id: string, body: { enabledGlobally?: boolean; enabledForSchoolIds?: string[] }) =>
        http.put(`/owner/feature-flags/${id}`, body),
      setFeatureFlagForSchool: (id: string, schoolId: string, enabled: boolean) =>
        http.put(`/owner/feature-flags/${id}/schools/${schoolId}`, { enabled }),
      // owner-impersonate (§13)
      startImpersonation: (schoolId: string, reason: string) =>
        http.post<{ accessToken: string; expiresAt: string; logId: string; targetUser: User }>("/owner/impersonate", { schoolId, reason }),
      endImpersonation: (logId: string) => http.put(`/owner/impersonate/${logId}/end`),
      impersonationLogs: () => http.get("/owner/impersonation-logs"),
    },

    partner: {
      dashboard: (partnerId: string) => http.get(`/partners/${partnerId}/dashboard`),
      // partner-leads (§11)
      leads: (partnerId: string) => http.get(`/partners/${partnerId}/leads`),
      createLead: (partnerId: string, body: { schoolName: string; contactName: string; phone: string; notes?: string }) =>
        http.post(`/partners/${partnerId}/leads`, body),
      updateLead: (partnerId: string, leadId: string, body: { stage?: string; notes?: string }) =>
        http.put(`/partners/${partnerId}/leads/${leadId}`, body),
    },

    sysadmin: {
      dashboard: () => http.get(`/sysadmin/dashboard`),
      users: (query = "") => http.get(`/sysadmin/users${query}`),
      suspendUser: (id: string) => http.put(`/sysadmin/users/${id}/suspend`),
      roles: () => http.get(`/sysadmin/roles`),
      servers: () => http.get(`/sysadmin/servers`),
      logs: (level?: string) => http.get(`/sysadmin/logs${level ? `?level=${level}` : ""}`),
      backup: () => http.get(`/sysadmin/backup`),
      security: () => http.get(`/sysadmin/security`),
      config: () => http.get(`/sysadmin/config`),
    },

    regulator: {
      overview: () => http.get(`/regulator/overview`),
      schools: () => http.get(`/regulator/schools`),
      incidents: (status?: string) => http.get(`/regulator/incidents${status ? `?status=${status}` : ""}`),
    },

    subscriptions: {
      catalog: (audience: "parent" | "school" = "parent") =>
        http.get(`/packages/catalog?audience=${audience}`),
      parentSubscription: (parentId: string) =>
        http.get<{ tier: string | null; endsAt: string | null }>(`/parents/${parentId}/subscription`),
      subscribeParent: (parentId: string, tier: string, cycle: string) =>
        http.post(`/parents/${parentId}/subscription`, { tier, cycle }),
      submitPayment: (body: {
        subjectType: "parent" | "school";
        subjectId: string;
        packageName: string;
        cycle: string;
        amount: number;
        method: string;
        receiptUrl?: string;
      }) => http.post(`/payments`, body),
      parentPayments: (parentId: string) => http.get(`/parents/${parentId}/payments`),
      gatewayStatus: () => http.get("/payments/gateway-status"),
      lifecyclePolicy: () => http.get("/subscriptions/lifecycle-policy"),
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
