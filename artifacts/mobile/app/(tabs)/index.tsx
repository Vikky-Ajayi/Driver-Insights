import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';

// Trip Planner tile icon — calendar + clock + pin
function TripPlannerIcon({ color }: { color: string }) {
  return <MaterialCommunityIcons name="calendar-clock" size={34} color={color} />;
}

// Discover tile: stacked brand-logo cards (approximated with colored squares)
function DiscoverIcon() {
  return (
    <View style={discoverStyles.stack}>
      <View style={[discoverStyles.card, { backgroundColor: '#FF6600', zIndex: 3, transform: [{ rotate: '-6deg' }] }]}>
        <MaterialCommunityIcons name="food-fork-drink" size={18} color="#FFFFFF" />
      </View>
      <View style={[discoverStyles.card, { backgroundColor: '#000000', zIndex: 2, transform: [{ rotate: '0deg' }, { translateX: 14 }, { translateY: -6 }] }]}>
        <MaterialCommunityIcons name="alpha-a-box" size={18} color="#FFFFFF" />
      </View>
    </View>
  );
}

const discoverStyles = StyleSheet.create({
  stack: { width: 56, height: 36, position: 'relative' },
  card: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function QuickTile({
  title,
  subtitle,
  icon,
  onPress,
  colors,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      style={[styles.quickTile, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.quickTileIconWrap}>{icon}</View>
      <Text style={[styles.quickTileTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.quickTileSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
    </Pressable>
  );
}

function SuggestedRow({
  title,
  subtitle,
  onPress,
  icon,
  colors,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  icon: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      style={[styles.suggestedRow, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View style={[styles.suggestedIcon, { backgroundColor: colors.secondary }]}>{icon}</View>
      <View style={styles.suggestedText}>
        <Text style={[styles.suggestedTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.suggestedSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Home</Text>
        <Pressable>
          <Feather name="bell" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Driver rating banner */}
      <View style={[styles.banner, { backgroundColor: colors.navy }]}>
        {/* Decorative circles */}
        <View style={styles.bannerCircle1} />
        <View style={styles.bannerCircle2} />

        <View style={[styles.bannerPill, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
          <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
          <Text style={styles.bannerPillText}>In Progress</Text>
        </View>
        <Text style={styles.bannerHeading}>
          {"We're rebuilding your\ndriver rating"}
        </Text>
        <Text style={styles.bannerBody}>
          {"To keep it accurate, we need more recent driving\ndata. It'll return once we've recorded enough."}
        </Text>
      </View>

      {/* Quick tiles */}
      <View style={styles.tilesRow}>
        <QuickTile
          title="Trip Planner"
          subtitle="See future hotspots"
          icon={<TripPlannerIcon color={colors.foreground} />}
          onPress={() => router.push('/trip-planner')}
          colors={colors}
        />
        <QuickTile
          title="Discover"
          subtitle="Popular gift cards"
          icon={<DiscoverIcon />}
          onPress={() => router.push('/redeem')}
          colors={colors}
        />
      </View>

      {/* Suggested */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Sugessted</Text>

      <View style={[styles.suggestedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SuggestedRow
          title="RideSpot Taxi Drivers"
          subtitle="Find areas with high ride demand"
          icon={<MaterialCommunityIcons name="car-side" size={20} color={colors.foreground} />}
          onPress={() => router.push('/(tabs)/taxi')}
          colors={colors}
        />
        <SuggestedRow
          title="RideSpot Delivery"
          subtitle="Find areas with high ride demand"
          icon={<MaterialCommunityIcons name="package-variant-closed" size={20} color={colors.foreground} />}
          onPress={() => router.push('/(tabs)/delivery')}
          colors={colors}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1.0,
  },
  banner: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    gap: 10,
    minHeight: 160,
  },
  bannerCircle1: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  bannerCircle2: {
    position: 'absolute',
    right: 60,
    bottom: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  bannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  bannerPillText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#FFFFFF' },
  bannerHeading: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 29,
  },
  bannerBody: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 19,
  },
  tilesRow: { flexDirection: 'row', gap: 12 },
  quickTile: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    minHeight: 140,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickTileIconWrap: { marginBottom: 4 },
  quickTileTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', letterSpacing: -0.3 },
  quickTileSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  sectionTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', letterSpacing: -0.7 },
  suggestedCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  suggestedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
  },
  suggestedIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestedText: { flex: 1, gap: 2 },
  suggestedTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  suggestedSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
