"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bus, Shield, ShieldCheck, Activity, Handshake, Server, Scale, ChevronRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { WEB_ROLES, WEB_ROLE_LABELS, WEB_ROLE_DESCRIPTIONS, WEB_ROLE_HOME, type WebRole } from "@/lib/roles";
import { HttpError } from "@aman-school/api-client";

const ROLE_ICONS: Record<WebRole, typeof Shield> = {
  owner: Shield,
  school_admin: ShieldCheck,
  ops_room: Activity,
  partner: Handshake,
  sysadmin: Server,
  regulator: Scale,
};

const ROLE_GRADIENT: Record<WebRole, string> = {
  owner: "role-gradient-owner",
  school_admin: "role-gradient-school_admin",
  ops_room: "role-gradient-ops_room",
  partner: "role-gradient-partner",
  sysadmin: "role-gradient-sysadmin",
  regulator: "role-gradient-regulator",
};

type Step = "role" | "credentials" | "2fa";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<WebRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function pickRole(r: WebRole) {
    setRole(r);
    setStep("credentials");
    setError(null);
  }

  async function submitCredentials() {
    if (!role) return;
    setError(null);
    setLoading(true);
    try {
      if (role === "sysadmin") {
        const res = await api.auth.sysadminLogin(email.trim(), password);
        setDevOtp(res.devOtp ?? null);
        setCode(res.devOtp ?? "");
        setStep("2fa");
        return;
      }
      const login =
        role === "owner" ? api.auth.ownerLogin :
        role === "school_admin" ? api.auth.schoolAdminLogin :
        role === "ops_room" ? api.auth.opsRoomLogin :
        role === "regulator" ? api.auth.regulatorLogin :
        api.auth.partnerLogin;
      const res = await login(email.trim(), password);
      setSession(res);
      router.replace(WEB_ROLE_HOME[role]);
    } catch (e) {
      setError(e instanceof HttpError ? "بيانات خاطئة" : "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  async function submit2fa() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.sysadminVerify2fa(email.trim(), code);
      setSession(res);
      router.replace(WEB_ROLE_HOME.sysadmin);
    } catch (e) {
      setError(e instanceof HttpError ? "رمز خاطئ أو منتهي الصلاحية" : "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center bg-gray-950 p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Bus size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">أمان سكول</h1>
          <p className="text-sm text-gray-400 font-semibold">لوحة الإدارة</p>
        </div>

        {step === "role" ? (
          <div className="flex flex-col gap-3">
            {WEB_ROLES.map((r) => {
              const Icon = ROLE_ICONS[r];
              return (
                <button
                  key={r}
                  onClick={() => pickRole(r)}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4 text-right"
                >
                  <span className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${ROLE_GRADIENT[r]}`}>
                    <Icon size={22} className="text-white" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-white font-bold text-sm">{WEB_ROLE_LABELS[r]}</span>
                    <span className="block text-gray-400 text-xs font-medium">{WEB_ROLE_DESCRIPTIONS[r]}</span>
                  </span>
                  <ChevronRight size={18} className="text-white/30 rtl:rotate-180" />
                </button>
              );
            })}
          </div>
        ) : null}

        {step === "credentials" && role ? (
          <div className={`rounded-3xl p-8 shadow-2xl ${ROLE_GRADIENT[role]}`}>
            <button onClick={() => setStep("role")} className="text-white/70 text-xs font-bold mb-6 flex items-center gap-1">
              <ChevronRight size={16} className="rotate-180 rtl:rotate-0" /> رجوع
            </button>
            <h2 className="text-white font-extrabold text-xl text-center mb-1">دخول {WEB_ROLE_LABELS[role]}</h2>
            <p className="text-white/60 text-xs text-center font-semibold mb-8">أدخل بيانات حسابك</p>

            <label className="block text-white/70 text-[11px] font-extrabold uppercase mb-2">البريد الإلكتروني</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="admin@amanschool.ye"
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3.5 text-white placeholder-white/35 mb-4 outline-none focus:border-white/40"
            />
            <label className="block text-white/70 text-[11px] font-extrabold uppercase mb-2">كلمة المرور</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && submitCredentials()}
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3.5 text-white placeholder-white/35 mb-6 outline-none focus:border-white/40"
            />
            {error ? <p className="text-red-300 text-xs text-center font-bold mb-4">{error}</p> : null}
            <button
              onClick={submitCredentials}
              disabled={!email || !password || loading}
              className="w-full rounded-2xl bg-white text-gray-900 font-extrabold py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null} دخول
            </button>
          </div>
        ) : null}

        {step === "2fa" && role === "sysadmin" ? (
          <div className={`rounded-3xl p-8 shadow-2xl ${ROLE_GRADIENT[role]}`}>
            <h2 className="text-white font-extrabold text-xl text-center mb-1">التحقق بخطوتين</h2>
            <p className="text-white/60 text-xs text-center font-semibold mb-6">أرسلنا رمزاً إلى {email}</p>
            {devOtp ? <p className="text-amber-300 text-[11px] text-center font-bold mb-4">وضع التطوير: تم تعبئة الرمز تلقائياً ({devOtp})</p> : null}
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              placeholder="000000"
              onKeyDown={(e) => e.key === "Enter" && submit2fa()}
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3.5 text-white placeholder-white/30 text-center text-2xl tracking-[0.5em] mb-6 outline-none focus:border-white/40"
            />
            {error ? <p className="text-red-300 text-xs text-center font-bold mb-4">{error}</p> : null}
            <button
              onClick={submit2fa}
              disabled={code.length !== 6 || loading}
              className="w-full rounded-2xl bg-white text-gray-900 font-extrabold py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null} دخول
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
