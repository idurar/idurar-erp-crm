import { useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

type LogEntry = {
  id: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  level: "info" | "warn" | "error";
  createdAt: string;
};

const LEVEL_TONE: Record<string, "success" | "warning" | "danger"> = { info: "success", warn: "warning", error: "danger" };
const LEVEL_LABEL: Record<string, string> = { info: "معلومة", warn: "تحذير", error: "خطأ" };
const FILTERS = [
  { value: undefined, label: "الكل" },
  { value: "info", label: "معلومات" },
  { value: "warn", label: "تحذيرات" },
  { value: "error", label: "أخطاء" },
];

export default function SysadminLogsScreen() {
  const [level, setLevel] = useState<string | undefined>(undefined);
  const { data: logs } = useQuery({
    queryKey: ["sysadmin-logs", level],
    queryFn: () => api.sysadmin.logs(level) as Promise<LogEntry[]>,
    refetchInterval: 10000,
  });

  return (
    <ScreenContainer>
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.label}
            style={[styles.filterChip, level === f.value && styles.filterChipActive]}
            onPress={() => setLevel(f.value)}
          >
            <Text style={[styles.filterText, level === f.value && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={logs}
        keyExtractor={(l) => l.id}
        scrollEnabled={false}
        ListEmptyComponent={<EmptyState icon="📜" title="لا توجد سجلات" />}
        renderItem={({ item }) => (
          <Card accentColor={colors.navy}>
            <View style={styles.row}>
              <Text style={styles.path}>{item.method} {item.path}</Text>
              <StatusPill label={LEVEL_LABEL[item.level]} tone={LEVEL_TONE[item.level]} />
            </View>
            <Text style={styles.meta}>
              {item.statusCode} • {item.durationMs} مللي‌ثانية • {new Date(item.createdAt).toLocaleString("ar-YE")}
            </Text>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  filterChip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  filterChipActive: { backgroundColor: `${colors.navy}22`, borderColor: colors.navy },
  filterText: { fontSize: 12, color: colors.gray700 },
  filterTextActive: { color: colors.navy, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  path: { fontWeight: "700", color: colors.navy, fontSize: 13 },
  meta: { color: colors.gray600, fontSize: 11, marginTop: 4 },
});
