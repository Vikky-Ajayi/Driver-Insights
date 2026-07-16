import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Hotspot } from '@/services/api';
import OpportunityCard from '@/components/OpportunityCard';

const TABS = ['All', 'Morning', 'Afternoon', 'Night'];

const MOCK: Hotspot[] = [
  {
    id: '1', name: 'Wembley', cluster_center: { lat: 51.5560, lng: -1.2799 },
    radius: 800, intensity_score: 87, active_events: [], expiry_timestamp: '',
    drive_time_minutes: 8, distance_km: 5.2, driver_saturation: 'LOW',
    demand_requests: 'HIGH', demand_label: 'Demand expected to Increase',
    time_start: '7:00 AM', time_end: '10:00 AM', category: 'taxi',
  },
  {
    id: '2', name: 'Teslim Balogun Stadium', cluster_center: { lat: 51.5230, lng: -1.2450 },
    radius: 600, intensity_score: 72, active_events: [], expiry_timestamp: '',
    drive_time_minutes: 12, distance_km: 7.8, driver_saturation: 'LOW',
    demand_requests: 'MEDIUM', demand_label: 'Demand increase likely',
    time_start: '1:00 PM', time_end: '4:00 PM', category: 'taxi',
  },
  {
    id: '3', name: 'Victoria Island', cluster_center: { lat: 51.4900, lng: -1.2100 },
    radius: 700, intensity_score: 65, active_events: [], expiry_timestamp: '',
    drive_time_minutes: 15, distance_km: 9.1, driver_saturation: 'MEDIUM',
    demand_requests: 'HIGH', demand_label: 'Demand expected to Increase',
    time_start: '9:00 PM', time_end: '12:00 AM', category: 'taxi',
  },
];

function filterByTime(hotspots: Hotspot[], tab: string): Hotspot[] {
  if (tab === 'All') return hotspots;
  const hourMap: Record<string, [number, number]> = {
    Morning: [5, 12],
    Afternoon: [12, 17],
    Night: [17, 24],
  };
  const [from, to] = hourMap[tab] ?? [0, 24];
  return hotspots.filter((h) => {
    const hour = parseInt(h.time_start.split(':')[0] ?? '0', 10);
    return hour >= from && hour < to;
  });
}

export default function TripPlannerScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState('All');

  const filtered = filterByTime(MOCK, activeTab);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Trip Planner</Text>
        <Pressable
          style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
          onPress={() => router.back()}
        >
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
      </View>
      <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
        Know where demand is expected before you drive.
      </Text>

      {/* Filter tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              activeTab === tab
                ? { backgroundColor: colors.foreground }
                : { backgroundColor: colors.secondary },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.primaryForeground : colors.mutedForeground },
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="calendar" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No hotspots scheduled for this time</Text>
          </View>
        }
        renderItem={({ item }) => (
          <OpportunityCard
            hotspot={item}
            type="taxi"
            onViewDetails={() =>
              router.push({ pathname: '/details', params: { id: item.id, data: JSON.stringify(item), type: 'taxi' } })
            }
            onDriveThere={() => router.back()}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 6 },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  headerSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', paddingHorizontal: 20, marginBottom: 14 },
  tabsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100 },
  tabText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  list: { paddingHorizontal: 20, gap: 14 },
  emptyState: { alignItems: 'center', gap: 12, marginTop: 60 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
