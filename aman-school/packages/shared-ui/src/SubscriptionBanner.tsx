import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

export interface SubscriptionBannerInfo {
  status?: string | null; // active | trial | grace_period | restricted | suspended | expired
  endsAt?: string | null;
  gracePeriodEndsAt?: string | null;
  onRenewPress?: () => void;
}

const DAYS_MS = 86400000;

/* ---- BC-4 / sub-expiring: subscription expiry/grace/restriction banner,
 * shown on both school and parent home screens using the same lazy status
 * fields the backend already computes on read. ---- */
export function SubscriptionBanner({ status, endsAt, gracePeriodEndsAt }: SubscriptionBannerInfo) {
  const now = Date.now();
  const endsAtMs = endsAt ? new Date(endsAt).getTime() : null;
  const daysLeft = endsAtMs != null ? Math.ceil((endsAtMs - now) / DAYS_MS) : null;

  if (status === "suspended") {
    return (
      <View style={[styles.banner, { backgroundColor: colors.redLight }]}>
        <Text style={[styles.title, { color: colors.red }]}>⛔ الاشتراك معلّق</Text>
        <Text style={styles.subtitle}>تم تعليق الحساب بسبب انتهاء الاشتراك دون تجديد. يرجى التجديد فوراً لاستعادة الخدمة.</Text>
      </View>
    );
  }

  if (status === "restricted") {
    return (
      <View style={[styles.banner, { backgroundColor: colors.redLight }]}>
        <Text style={[styles.title, { color: colors.red }]}>🚫 الوصول مقيّد</Text>
        <Text style={styles.subtitle}>انتهت فترة السماح. بعض الميزات معطّلة حتى يتم تجديد الاشتراك.</Text>
      </View>
    );
  }

  if (status === "grace_period") {
    const graceLeft = gracePeriodEndsAt ? Math.ceil((new Date(gracePeriodEndsAt).getTime() - now) / DAYS_MS) : null;
    return (
      <View style={[styles.banner, { backgroundColor: colors.amberLight }]}>
        <Text style={[styles.title, { color: colors.amber }]}>⚠️ انتهى الاشتراك — فترة سماح</Text>
        <Text style={styles.subtitle}>
          {graceLeft != null && graceLeft > 0 ? `متبقٍ ${graceLeft} يوم قبل تقييد الوصول. ` : ""}يرجى التجديد لتفادي انقطاع الخدمة.
        </Text>
      </View>
    );
  }

  if (daysLeft != null && daysLeft <= 7 && daysLeft >= 0) {
    return (
      <View style={[styles.banner, { backgroundColor: colors.amberLight }]}>
        <Text style={[styles.title, { color: colors.amber }]}>⏳ الاشتراك ينتهي قريباً</Text>
        <Text style={styles.subtitle}>{daysLeft === 0 ? "ينتهي اليوم" : `متبقٍ ${daysLeft} يوم`} — جدّد اشتراكك لتفادي انقطاع الخدمة.</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: { borderRadius: 12, padding: 14, marginBottom: 14 },
  title: { fontSize: 13, fontWeight: "800", marginBottom: 4 },
  subtitle: { fontSize: 12, color: colors.gray700 },
});
