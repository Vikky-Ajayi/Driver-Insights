import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Hotspot } from '@/services/api';
import OpportunityCard from '@/components/OpportunityCard';

export default function OpportunitiesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { type, data } = useLocalSearchParams<{ type: string; data: string }>();

  const hotspots: Hotspot[] = useMemo(() => {
    try {
      return JSON.parse(data ?? '[]');
    } catch {
      return [];
    }
  }, [data]);

  const isDelivery = type === 'delivery';

  const subtitle = isDelivery
    ? 'Discover areas where delivery demand is highest'
    : 'Recommended ride areas with high demand';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Opportunities</Text>
        <Pressable
          style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
          onPress={() => router.back()}
        >
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
      </View>
      <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>

      <FlatList
        data={hotspots}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <OpportunityCard
            hotspot={item}
            type={isDelivery ? 'delivery' : 'taxi'}
            onViewDetails={() =>
              router.push({ pathname: '/details', params: { id: item.id, data: JSON.stringify(item), type: type ?? 'taxi' } })
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  headerSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', paddingHorizontal: 20, marginBottom: 16 },
  list: { paddingHorizontal: 20, gap: 14 },
});
