import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, Switch, Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

interface PlatformSettings {
  maintenanceMode?: boolean;
  smsProvider?: string;
  fcmServerKey?: string;
  featureFlags?: string[];
}

/** OWN-08: platform-wide technical settings. */
export default function OwnerSettingsScreen() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["platform-settings"], queryFn: () => api.owner.platformSettings() as Promise<PlatformSettings> });

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [smsProvider, setSmsProvider] = useState("");
  const [fcmServerKey, setFcmServerKey] = useState("");
  const [newFlag, setNewFlag] = useState("");
  const [featureFlags, setFeatureFlags] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setMaintenanceMode(!!data.maintenanceMode);
      setSmsProvider(data.smsProvider ?? "");
      setFcmServerKey(data.fcmServerKey ?? "");
      setFeatureFlags(data.featureFlags ?? []);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => api.owner.updatePlatformSettings({ maintenanceMode, smsProvider, fcmServerKey, featureFlags }),
    onSuccess: () => {
      Alert.alert("تم الحفظ", "تم حفظ إعدادات المنصة");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
  });

  return (
    <ScreenContainer>
      <SectionHeader title="وضع الصيانة" accentColor={colors.purpleMid} />
      <View style={styles.row}>
        <Switch value={maintenanceMode} onValueChange={setMaintenanceMode} />
        <Text style={styles.rowLabel}>تفعيل وضع الصيانة (يوقف الوصول لجميع المدارس مؤقتاً)</Text>
      </View>

      <SectionHeader title="مزودو الخدمة" accentColor={colors.purpleMid} />
      <TextInput style={styles.input} value={smsProvider} onChangeText={setSmsProvider} placeholder="مزود الرسائل النصية (SMS Provider)" />
      <TextInput style={styles.input} value={fcmServerKey} onChangeText={setFcmServerKey} placeholder="مفتاح FCM للإشعارات" secureTextEntry />

      <SectionHeader title="Feature Flags" accentColor={colors.purpleMid} />
      {featureFlags.map((flag) => (
        <View style={styles.flagRow} key={flag}>
          <Text style={styles.flagText}>{flag}</Text>
          <Text style={styles.removeLink} onPress={() => setFeatureFlags((prev) => prev.filter((f) => f !== flag))}>
            إزالة
          </Text>
        </View>
      ))}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput style={[styles.input, { flex: 1 }]} value={newFlag} onChangeText={setNewFlag} placeholder="اسم الميزة الجديدة" />
        <Button
          title="+"
          variant="outline"
          onPress={() => {
            if (newFlag.trim()) {
              setFeatureFlags((prev) => [...prev, newFlag.trim()]);
              setNewFlag("");
            }
          }}
        />
      </View>

      <Button title="حفظ إعدادات المنصة" onPress={() => saveMutation.mutate()} loading={saveMutation.isPending} color={colors.purpleMid} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  rowLabel: { fontSize: 13, color: colors.gray700, flex: 1 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8,
  },
  flagRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  flagText: { color: colors.navy, fontSize: 13, fontWeight: "600" },
  removeLink: { color: colors.red, fontSize: 12 },
});
