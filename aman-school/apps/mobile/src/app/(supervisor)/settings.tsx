import { useState } from "react";
import { Text, TextInput, View, StyleSheet, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { useLogout } from "../../features/shared/RoleGuardLayout";
import { HttpError } from "@aman-school/api-client";

/** S-14: personal app settings — sound/vibration/NFC prefs, PIN change, manual sync, logout. */
export default function SupervisorSettingsScreen() {
  const router = useRouter();
  const logout = useLogout();
  const user = useSessionStore((s) => s.user)!;
  const queryClient = useQueryClient();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [nfcAutoConfirm, setNfcAutoConfirm] = useState(true);

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  const saveSettingsMutation = useMutation({
    mutationFn: () => api.supervisor.updateSettings(user.id, { soundEnabled, vibrationEnabled, nfcAutoConfirm }),
    onSuccess: () => Alert.alert("تم الحفظ", "تم حفظ إعداداتك بنجاح"),
  });

  const changePinMutation = useMutation({
    mutationFn: () => api.supervisor.changePin(user.id, currentPin, newPin),
    onSuccess: () => {
      setCurrentPin("");
      setNewPin("");
      setPinError(null);
      Alert.alert("تم التغيير", "تم تغيير رمز PIN بنجاح");
    },
    onError: (e) => setPinError(e instanceof HttpError ? "رمز PIN الحالي غير صحيح" : "تعذر الاتصال بالخادم"),
  });

  function syncNow() {
    queryClient.invalidateQueries();
    Alert.alert("تمت المزامنة", "تم تحديث جميع البيانات من الخادم");
  }

  return (
    <ScreenContainer>
      <SectionHeader title="معلومات المشرف" accentColor={colors.blueMid} />
      <Text style={styles.info}>{user.name}</Text>
      <Text style={styles.infoSub}>رمز الموظف: {user.employeeCode}</Text>
      <Button title="عرض الملف الشخصي الكامل" variant="outline" onPress={() => router.push("/(supervisor)/profile")} />

      <SectionHeader title="الصوت والاهتزاز" accentColor={colors.blueMid} />
      <View style={styles.row}>
        <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
        <Text style={styles.rowLabel}>صوت تأكيد المسح</Text>
      </View>
      <View style={styles.row}>
        <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} />
        <Text style={styles.rowLabel}>الاهتزاز عند المسح</Text>
      </View>

      <SectionHeader title="إعدادات NFC" accentColor={colors.blueMid} />
      <View style={styles.row}>
        <Switch value={nfcAutoConfirm} onValueChange={setNfcAutoConfirm} />
        <Text style={styles.rowLabel}>تأكيد تلقائي فور المسح الناجح</Text>
      </View>
      <Button title="حفظ الإعدادات" variant="outline" onPress={() => saveSettingsMutation.mutate()} loading={saveSettingsMutation.isPending} />

      <SectionHeader title="تغيير رمز PIN" accentColor={colors.blueMid} />
      <TextInput style={styles.input} value={currentPin} onChangeText={setCurrentPin} placeholder="PIN الحالي" secureTextEntry keyboardType="number-pad" maxLength={6} />
      <TextInput style={styles.input} value={newPin} onChangeText={setNewPin} placeholder="PIN الجديد" secureTextEntry keyboardType="number-pad" maxLength={6} />
      {pinError ? <Text style={styles.error}>{pinError}</Text> : null}
      <Button
        title="تغيير الرمز"
        variant="outline"
        onPress={() => changePinMutation.mutate()}
        loading={changePinMutation.isPending}
        disabled={currentPin.length < 4 || newPin.length < 4}
      />

      <SectionHeader title="البيانات" accentColor={colors.blueMid} />
      <Button title="مزامنة البيانات الآن" variant="outline" onPress={syncNow} />
      <Button title="سجل الرحلات" variant="outline" onPress={() => router.push("/(supervisor)/history")} />
      <Button title="💬 الدعم الفني" variant="outline" onPress={() => router.push("/(supervisor)/contact")} />
      <Button title="عن النظام" variant="outline" onPress={() => router.push("/(supervisor)/about")} />

      <View style={{ height: 16 }} />
      <Button
        title="تسجيل الخروج"
        color={colors.red}
        onPress={async () => {
          await logout();
          router.replace("/(auth)/role-select");
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  info: { fontSize: 15, fontWeight: "700", color: colors.navy },
  infoSub: { fontSize: 12, color: colors.gray600, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  rowLabel: { fontSize: 13, color: colors.gray700 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8, textAlign: "center",
  },
  error: { color: colors.red, fontSize: 12, marginBottom: 8, textAlign: "center" },
});
