import { Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

export default function LiveTripsScreen() {
  const { data: trips, isLoading } = useQuery({
    queryKey: ["active-trips"],
    queryFn: () => api.operations.activeTrips(),
    refetchInterval: 8000,
  });

  if (!isLoading && !trips?.length) return <ScreenContainer><EmptyState icon="🗺️" title="لا توجد رحلات جارية الآن" /></ScreenContainer>;

  return (
    <ScreenContainer>
      {trips?.map((t: any) => (
        <Card key={t.id} accentColor={colors.redMid}>
          <Text style={{ fontWeight: "700", color: colors.navy }}>باص {t.bus?.busNumber}</Text>
          <Text style={{ color: colors.gray600, fontSize: 12 }}>{t.direction === "to_school" ? "ذهاب" : "عودة"} · جارية الآن</Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}
