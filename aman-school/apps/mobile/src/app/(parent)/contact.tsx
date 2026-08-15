import { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Button, ScreenContainer, colors } from "@aman-school/shared-ui";
import { YEMEN_EMERGENCY_NUMBERS } from "@aman-school/types";
import { api } from "../../lib/api";

export default function ContactScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: () => api.parent.contactSupport({ message, channel: "app" }),
    onSuccess: () => {
      Alert.alert("تم الإرسال", "سيتواصل معك فريق الدعم قريباً");
      router.back();
    },
  });

  return (
    <ScreenContainer>
      <Text style={{ fontSize: 13, color: colors.gray600, marginBottom: 12, textAlign: "center" }}>
        للطوارئ الفورية استخدم زر SOS في صفحة تفاصيل الابن
      </Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.redLight, borderRadius: 12, alignItems: "center", paddingVertical: 12 }}
          onPress={() => Linking.openURL(`tel:${YEMEN_EMERGENCY_NUMBERS.ambulance}`)}
        >
          <Text style={{ fontSize: 20 }}>🚑</Text>
          <Text style={{ fontSize: 11, color: colors.gray700, marginTop: 4 }}>الإسعاف</Text>
          <Text style={{ fontSize: 16, fontWeight: "800", color: colors.red }}>{YEMEN_EMERGENCY_NUMBERS.ambulance}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.redLight, borderRadius: 12, alignItems: "center", paddingVertical: 12 }}
          onPress={() => Linking.openURL(`tel:${YEMEN_EMERGENCY_NUMBERS.police}`)}
        >
          <Text style={{ fontSize: 20 }}>🚓</Text>
          <Text style={{ fontSize: 11, color: colors.gray700, marginTop: 4 }}>الشرطة</Text>
          <Text style={{ fontSize: 16, fontWeight: "800", color: colors.red }}>{YEMEN_EMERGENCY_NUMBERS.police}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={{
          borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, padding: 12, minHeight: 100,
          textAlignVertical: "top", backgroundColor: colors.white, marginBottom: 14,
        }}
        value={message}
        onChangeText={setMessage}
        placeholder="اكتب رسالتك إلى المدرسة / الدعم"
        multiline
      />
      <Button title="إرسال" onPress={() => mutation.mutate()} loading={mutation.isPending} disabled={!message} />
    </ScreenContainer>
  );
}
