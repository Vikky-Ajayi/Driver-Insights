import React from 'react';
import {
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
      <View style={styles.quickTileIcon}>{icon}</View>
      <Text style={[styles.quickTileTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.quickTileSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
    </Pressable>
  );
}

function SuggestedRow({
  title,
  subtitle,
  onPress,
  colors,
  icon,
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
      <View style={[styles.suggestedIcon, { backgroundColor: colors.secondary }]}>
        {icon}
      </View>
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
  const { user } = useAuth();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
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
        <View style={[styles.bannerPill, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
          <Text style={styles.bannerPillText}>In Progress</Text>
        </View>
        <Text style={styles.bannerHeading}>
          We're rebuilding your {'\n'}driver rating
        </Text>
        <Text style={styles.bannerBody}>
          To keep it accurate, we need more recent driving data. It'll return once we've recorded
          enough.
        </Text>
        {/* Decorative circles */}
        <View style={styles.bannerCircle1} />
        <View style={styles.bannerCircle2} />
      </View>

      {/* Quick tiles */}
      <View style={styles.tilesRow}>
        <QuickTile
          title="Trip Planner"
          subtitle="See future hotspots"
          icon={<MaterialCommunityIcons name="map-marker-path" size={32} color={colors.foreground} />}
          onPress={() => router.push('/trip-planner')}
          colors={colors}
        />
        <QuickTile
          title="Discover"
          subtitle="Popular gift cards"
          icon={<MaterialCommunityIcons name="gift-outline" size={32} color={colors.foreground} />}
          onPress={() => router.push('/redeem')}
          colors={colors}
        />
      </View>

      {/* Suggested */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Suggested</Text>

      <View style={[styles.suggestedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SuggestedRow
          title="RideSpot Taxi Drivers"
          subtitle="Find areas with high ride demand"
          icon={<MaterialCommunityIcons name="taxi" size={20} color={colors.foreground} />}
          onPress={() => router.push('/(tabs)/taxi')}
          colors={colors}
        />
        <SuggestedRow
          title="RideSpot Delivery"
          subtitle="Find areas with high delivery demand"
          icon={<MaterialCommunityIcons name="package-variant" size={20} color={colors.foreground} />}
          onPress={() => router.push('/(tabs)/delivery')}
          colors={colors}
        />
      </View>

      {/* Greeting */}
      {user && (
        <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
          Logged in as {user.name}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  banner: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    gap: 10,
    minHeight: 140,
  },
  bannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  bannerPillText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#FFFFFF' },
  bannerHeading: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 28,
  },
  bannerBody: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },
  bannerCircle1: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  bannerCircle2: {
    position: 'absolute',
    right: 30,
    bottom: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tilesRow: { flexDirection: 'row', gap: 12 },
  quickTile: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    minHeight: 130,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickTileIcon: {},
  quickTileTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', letterSpacing: -0.3 },
  quickTileSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', letterSpacing: -0.6 },
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
  greeting: { fontSize: 13, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
