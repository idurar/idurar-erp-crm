import { useState } from "react";
import { Text, View, StyleSheet, FlatList, Linking } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { HttpError } from "@aman-school/api-client";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { API_BASE_URL } from "../../lib/config";

type ImportRow = { row: number; name: string; grade: string; busNumber: string };
type PreviewResult = { validCount: number; errorCount: number; validRows: any[]; errorRows: (ImportRow & { error: string })[] };

/* ---- BC-2 / a-import: Excel bulk student import (preview → confirm) ---- */
export default function ImportStudentsScreen() {
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const previewMutation = useMutation({
    mutationFn: (file: { uri: string; name: string; type: string }) => api.school.previewImport(schoolId, file) as Promise<PreviewResult>,
    onSuccess: (res) => setPreview(res),
    onError: (e) => setError(e instanceof HttpError ? String((e.body as any)?.error ?? "تعذر تحليل الملف") : "تعذر الاتصال بالخادم"),
  });

  const confirmMutation = useMutation({
    mutationFn: () => api.school.confirmImport(schoolId, preview!.validRows),
    onSuccess: () => {
      setPreview(null);
      setFileName(null);
      queryClient.invalidateQueries({ queryKey: ["school-students", schoolId] });
    },
    onError: (e) => setError(e instanceof HttpError ? String((e.body as any)?.error ?? "تعذر استيراد الطلاب") : "تعذر الاتصال بالخادم"),
  });

  async function pickFile() {
    setError(null);
    setPreview(null);
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setFileName(asset.name);
    previewMutation.mutate({ uri: asset.uri, name: asset.name, type: asset.mimeType ?? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  return (
    <ScreenContainer>
      <Card accentColor={colors.amber}>
        <Text style={styles.note}>📥 استورد قائمة الطلاب دفعة واحدة عبر ملف Excel — حمّل النموذج أولاً، عبّئه، ثم ارفعه هنا للمراجعة قبل التأكيد.</Text>
        <Button
          title="⬇️ تحميل نموذج Excel الفارغ"
          variant="outline"
          onPress={() => Linking.openURL(`${API_BASE_URL}${api.school.importTemplateUrl(schoolId)}`)}
        />
      </Card>

      <View style={{ height: 12 }} />
      <Button title={fileName ? `📄 ${fileName}` : "📎 اختيار ملف Excel"} onPress={pickFile} loading={previewMutation.isPending} color={colors.amber} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {preview ? (
        <View style={{ marginTop: 16 }}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.greenMid }]}>{preview.validCount}</Text>
              <Text style={styles.statLabel}>صف صالح</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.red }]}>{preview.errorCount}</Text>
              <Text style={styles.statLabel}>صف به خطأ</Text>
            </View>
          </View>

          {preview.errorRows.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>الأخطاء (لن تُستورد)</Text>
              <FlatList
                data={preview.errorRows}
                keyExtractor={(r) => String(r.row)}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <Card accentColor={colors.red}>
                    <Text style={styles.rowText}>سطر {item.row}: {item.name || "—"} ({item.grade || "—"})</Text>
                    <StatusPill label={item.error} tone="danger" />
                  </Card>
                )}
              />
            </>
          ) : null}

          {preview.validRows.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>جاهز للاستيراد</Text>
              <FlatList
                data={preview.validRows}
                keyExtractor={(r: any) => String(r.row)}
                scrollEnabled={false}
                renderItem={({ item }: any) => (
                  <Card accentColor={colors.greenMid}>
                    <Text style={styles.rowText}>{item.name} — {item.grade}{item.section ? ` ${item.section}` : ""} — باص {item.busNumber}</Text>
                  </Card>
                )}
              />
              <Button
                title={`✅ تأكيد استيراد ${preview.validRows.length} طالب`}
                onPress={() => confirmMutation.mutate()}
                loading={confirmMutation.isPending}
                color={colors.greenMid}
              />
            </>
          ) : null}
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  note: { fontSize: 12, color: colors.gray700, marginBottom: 10 },
  error: { color: colors.red, fontSize: 12, marginTop: 10, textAlign: "center" },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  stat: { flex: 1, backgroundColor: colors.white, borderRadius: 12, padding: 14, alignItems: "center", borderWidth: 1, borderColor: colors.gray200 },
  statValue: { fontSize: 24, fontWeight: "800" },
  statLabel: { fontSize: 11, color: colors.gray600, marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: colors.navy, marginTop: 8, marginBottom: 8 },
  rowText: { fontSize: 12, color: colors.navy, fontWeight: "600", marginBottom: 4 },
});
