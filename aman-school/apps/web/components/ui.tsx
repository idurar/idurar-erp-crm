import type { PropsWithChildren, ReactNode } from "react";

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-5 ${className}`}>{children}</div>;
}

export function StatCard({ label, value, accent = "text-gray-900" }: { label: string; value: ReactNode; accent?: string }) {
  return (
    <Card className="text-center">
      <p className={`text-2xl font-extrabold ${accent}`}>{value}</p>
      <p className="text-xs text-gray-500 font-semibold mt-1">{label}</p>
    </Card>
  );
}

const TONE_CLASSES: Record<string, string> = {
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  info: "bg-blue-50 text-blue-700",
  danger: "bg-red-50 text-red-700",
  neutral: "bg-gray-100 text-gray-600",
};

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: keyof typeof TONE_CLASSES }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${TONE_CLASSES[tone]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "solid",
  color = "#0B2447",
  disabled,
  loading,
  type = "button",
}: PropsWithChildren<{
  onClick?: () => void;
  variant?: "solid" | "outline";
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
}>) {
  const isOutline = variant === "outline";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
      style={isOutline ? { border: `1.5px solid ${color}`, color } : { backgroundColor: color, color: "white" }}
    >
      {loading ? "..." : children}
    </button>
  );
}

export function EmptyState({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-gray-500 font-semibold text-sm">{title}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <p className="text-gray-500 font-semibold text-sm">تعذر تحميل البيانات</p>
      <Button onClick={onRetry} variant="outline">
        إعادة المحاولة
      </Button>
    </div>
  );
}

export function SectionHeader({ title, accent = "#0B2447" }: { title: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2 mt-8 mb-4 first:mt-0">
      <span className="w-1 h-4 rounded-full" style={{ backgroundColor: accent }} />
      <h2 className="font-extrabold text-gray-800 text-sm">{title}</h2>
    </div>
  );
}
