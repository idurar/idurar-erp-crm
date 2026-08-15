import { Text, TouchableOpacity } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

export default function ParentNotificationsScreen() {
  const user = useSessionStore((s) => s.user)!;
  const queryClient = useQueryClient();
  const { data: notifications } = useQuery({
    queryKey: ["parent-notifications", user.id],
    queryFn: () => api.parent.notifications(user.id),
  });
  const markRead = useMutation({
    mutationFn: (id: string) => api.parent.markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parent-notifications", user.id] }),
  });

  return (
    <ScreenContainer>
      {!notifications?.length ? (
        <EmptyState icon="🔔" title="لا توجد إشعارات" />
      ) : (
        notifications.map((n) => (
          <TouchableOpacity key={n.id} onPress={() => !n.read && markRead.mutate(n.id)}>
            <Card accentColor={n.read ? colors.gray200 : colors.greenMid}>
              <Text style={{ fontWeight: "700", color: colors.navy }}>{n.title}</Text>
              <Text style={{ color: colors.gray600, fontSize: 12, marginTop: 2 }}>{n.body}</Text>
              <Text style={{ color: colors.gray400, fontSize: 10, marginTop: 4 }}>
                {new Date(n.createdAt).toLocaleString("ar-SA")}
              </Text>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScreenContainer>
  );
}
