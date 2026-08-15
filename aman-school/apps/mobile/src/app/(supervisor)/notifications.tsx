import { Text, TouchableOpacity } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

export default function SupervisorNotificationsScreen() {
  const user = useSessionStore((s) => s.user)!;
  const queryClient = useQueryClient();
  const { data: notifications } = useQuery({
    queryKey: ["supervisor-notifications", user.id],
    queryFn: () => api.supervisor.notifications(user.id),
  });
  const markRead = useMutation({
    mutationFn: (id: string) => api.notifications.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["supervisor-notifications", user.id] }),
  });

  if (!notifications?.length) return <ScreenContainer><EmptyState icon="🔔" title="لا توجد إشعارات" /></ScreenContainer>;

  return (
    <ScreenContainer>
      {notifications.map((n) => (
        <TouchableOpacity key={n.id} onPress={() => !n.read && markRead.mutate(n.id)}>
          <Card accentColor={n.read ? colors.gray200 : colors.blueMid}>
            <Text style={{ fontWeight: "700", color: colors.navy }}>{n.title}</Text>
            <Text style={{ color: colors.gray600, fontSize: 12, marginTop: 2 }}>{n.body}</Text>
            <Text style={{ color: colors.gray400, fontSize: 10, marginTop: 4 }}>
              {new Date(n.createdAt).toLocaleString("ar-YE")}
            </Text>
            {!n.read ? <StatusPill label="جديد" tone="info" /> : null}
          </Card>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
}
