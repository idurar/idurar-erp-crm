import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, Switch, Alert, TouchableOpacity } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

interface LifecyclePolicy {
  reminderDaysBefore?: number[];
  schoolGraceDays?: number;
  parentGraceDays?: number;
  postGraceAction?: "restricted" | "suspended";
  autoRenewDefault?: boolean;
}

/* ---- BC-3 / ow-sub-lifecycle: subscription expiry/grace/suspension policy ---- */
export default function SubscriptionLifecycleScreen() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["lifecycle-policy"], queryFn: () => api.owner.lifecyclePolicy() as Promise<LifecyclePolicy> });

  const [reminderDays, setReminderDays] = useState("30,7,0");
  const [schoolGraceDays, setSchoolGraceDays] = useState("7");
  const [parentGraceDays, setParentGraceDays] = useState("3");
  const [postGraceAction, setPostGraceAction] = useState<"restricted" | "suspended">("restricted");
  const [autoRenewDefault, setAutoRenewDefault] = useState(true);

  useEffect(() => {
    if (data) {
      setReminderDays((data.reminderDaysBefore ?? [30, 7, 0]).join(","));
      setSchoolGraceDays(String(data.schoolGraceDays ?? 7));
      setParentGraceDays(String(data.parentGraceDays ?? 3));
      setPostGraceAction(data.postGraceAction ?? "restricted");
      setAutoRenewDefault(data.autoRenewDefault ?? true);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      api.owner.updateLifecyclePolicy({
        reminderDaysBefore: reminderDays.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)),
        schoolGraceDays: parseInt(schoolGraceDays, 10) || 0,
        parentGraceDays: parseInt(parentGraceDays, 10) || 0,
        postGraceAction,
        autoRenewDefault,
      }),
    onSuccess: () => {
      Alert.alert("تم الحفظ", "تم تحديث سياسة دورة حياة الاشتراك");
      queryClient.invalidateQueries({ queryKey: ["lifecycle-policy"] });
    },
  });

  return (
    <ScreenContainer>
      <SectionHeader title="تذكيرات انتهاء الاشتراك" accentColor={colors.purpleMid} />
      <Text style={styles.hint}>عدد الأيام قبل الانتهاء لإرسال تذكير (مفصولة بفواصل)</Text>
      <TextInput style={styles.input} value={reminderDays} onChangeText={setReminderDays} placeholder="30,7,0" keyboardType="numbers-and-punctuation" />

      <SectionHeader title="فترة السماح (Grace Period)" accentColor={colors.purpleMid} />
      <Text style={styles.hint}>عدد أيام السماح للمدارس بعد انتهاء الاشتراك</Text>
      <TextInput style={styles.input} value={schoolGraceDays} onChangeText={setSchoolGraceDays} keyboardType="number-pad" />
      <Text style={styles.hint}>عدد أيام السماح لأولياء الأمور بعد انتهاء الاشتراك</Text>
      <TextInput style={styles.input} value={parentGraceDays} onChangeText={setParentGraceDays} keyboardType="number-pad" />

      <SectionHeader title="الإجراء بعد انتهاء فترة السماح" accentColor={colors.purpleMid} />
      <View style={styles.chipsRow}>
        <TouchableOpacity style={[styles.chip, postGraceAction === "restricted" && styles.chipActive]} onPress={() => setPostGraceAction("restricted")}>
          <Text style={[styles.chipText, postGraceAction === "restricted" && styles.chipTextActive]}>تقييد الوصول (Restricted)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.chip, postGraceAction === "suspended" && styles.chipActive]} onPress={() => setPostGraceAction("suspended")}>
          <Text style={[styles.chipText, postGraceAction === "suspended" && styles.chipTextActive]}>تعليق كامل (Suspended)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Switch value={autoRenewDefault} onValueChange={setAutoRenewDefault} />
        <Text style={styles.rowLabel}>تفعيل التجديد التلقائي افتراضياً للاشتراكات الجديدة</Text>
      </View>

      <Button title="حفظ السياسة" onPress={() => saveMutation.mutate()} loading={saveMutation.isPending} color={colors.purpleMid} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 11, color: colors.gray600, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.purpleMid}22`, borderColor: colors.purpleMid },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.purpleMid, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  rowLabel: { fontSize: 13, color: colors.gray700, flex: 1 },
});
