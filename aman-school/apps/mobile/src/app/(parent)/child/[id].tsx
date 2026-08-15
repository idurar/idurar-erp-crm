import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: student } = useQuery({ queryKey: ["student-details", id], queryFn: () => api.parent.studentDetails(id) });

  return (
    <ScreenContainer>
      <Card accentColor={colors.greenMid}>
        <Text style={styles.name}>{student?.name}</Text>
        <Text style={styles.meta}>{student?.grade} · {(student as any)?.school?.name}</Text>
        <Text style={styles.meta}>الباص: {(student as any)?.bus?.busNumber ?? "-"}</Text>
        <Text style={styles.meta}>المشرف: {(student as any)?.bus?.supervisor?.name ?? "-"}</Text>
      </Card>

      <View style={{ gap: 8 }}>
        {(student as any)?.busId ? (
          <Button title="تتبع الباص مباشرة" onPress={() => router.push(`/(parent)/tracking/${(student as any).busId}`)} color={colors.blueMid} />
        ) : null}
        <Button title="سجل رحلاته الكاملة" variant="outline" onPress={() => router.push(`/(parent)/trip-history/${id}`)} />
        <Button title="🩺 الملف الطبي" variant="outline" onPress={() => router.push(`/(parent)/medical/${id}`)} />
        <Button title="👤 تفويض استلام" variant="outline" onPress={() => router.push(`/(parent)/delegate/${id}`)} />
        <Button title="📅 إبلاغ غياب" variant="outline" onPress={() => router.push(`/(parent)/absence/${id}`)} />
        <Button title="⚠️ الإبلاغ عن فقدان السوار" variant="outline" color={colors.red} onPress={() => router.push(`/(parent)/lost-nfc/${id}`)} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 17, fontWeight: "800", color: colors.navy },
  meta: { color: colors.gray600, fontSize: 13, marginTop: 4 },
});
