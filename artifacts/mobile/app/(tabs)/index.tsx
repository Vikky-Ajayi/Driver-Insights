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

// ─── Quick Tile ───────────────────────────────────────────────────────────────
function QuickTile({
  title,
  subtitle,
  children,
  onPress,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quickTile} onPress={onPress}>
      <Text style={styles.quickTileTitle}>{title}</Text>
      <View style={styles.quickTileImageWrap}>{children}</View>
      <Text style={styles.quickTileSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

// ─── Suggested Row ────────────────────────────────────────────────────────────
function SuggestedRow({
  title,
  subtitle,
  icon,
  onPress,
  noBorder,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  noBorder?: boolean;
}) {
  return (
    <Pressable
      style={[styles.suggestedRow, noBorder && { borderBottomWidth: 0 }]}
      onPress={onPress}
    >
      <View style={styles.suggestedIconWrap}>{icon}</View>
      <View style={styles.suggestedText}>
        <Text style={styles.suggestedTitle}>{title}</Text>
        <Text style={styles.suggestedSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color="#9CA3AF" />
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: 100 + insets.bottom },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <Pressable style={styles.bellWrap}>
          <Feather name="bell" size={22} color="#060808" />
        </Pressable>
      </View>

      {/* ── Driver Rating Banner ── */}
      <View style={styles.banner}>
        {/* Decorative: large faint circle ring top-right */}
        <View style={styles.bannerRingOuter} />
        <View style={styles.bannerRingInner} />

        {/* Decorative: location pin vector — right side, partially cropped */}
        <Image
          source={require('@/assets/images/banner-pin.png')}
          style={styles.bannerPin}
          resizeMode="contain"
        />

        {/* "In Progress" pill — white bg, brand-navy dot + text */}
        <View style={styles.bannerPill}>
          <View style={styles.pillDot} />
          <Text style={styles.bannerPillText}>In Progress</Text>
        </View>

        <Text style={styles.bannerHeading}>
          {"We're rebuilding your\ndriver rating"}
        </Text>
        <Text style={styles.bannerBody}>
          {"To keep it accurate, we need more recent driving\ndata. It'll return once we've recorded enough."}
        </Text>
      </View>

      {/* ── Quick Tiles ── */}
      <View style={styles.tilesRow}>
        {/* Trip Planner */}
        <QuickTile
          title="Trip Planner"
          subtitle="See future hotspots"
          onPress={() => router.push('/trip-planner')}
        >
          <Image
            source={require('@/assets/images/trip-planner.png')}
            style={styles.tripPlannerImg}
            resizeMode="contain"
          />
        </QuickTile>

        {/* Discover */}
        <QuickTile
          title="Discover"
          subtitle="Popular gift cards"
          onPress={() => router.push('/redeem')}
        >
          <Image
            source={require('@/assets/images/discover-cards.png')}
            style={styles.discoverImg}
            resizeMode="contain"
          />
        </QuickTile>
      </View>

      {/* ── Suggested ── */}
      <Text style={styles.sectionTitle}>Sugessted</Text>

      <View style={styles.suggestedCard}>
        <SuggestedRow
          title="RideSpot Taxi Drivers"
          subtitle="Find areas with high ride demand"
          icon={<MaterialCommunityIcons name="car-side" size={20} color="#060808" />}
          onPress={() => router.push('/(tabs)/taxi')}
        />
        <SuggestedRow
          title="RideSpot Delivery"
          subtitle="Find areas with high ride demand"
          icon={<MaterialCommunityIcons name="package-variant-closed" size={20} color="#060808" />}
          onPress={() => router.push('/(tabs)/delivery')}
          noBorder
        />
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const NAVY = '#0B0132';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#060808',
    letterSpacing: -0.8,
  },
  bellWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Banner
  banner: {
    backgroundColor: NAVY,
    borderRadius: 18,
    padding: 22,
    paddingBottom: 26,
    overflow: 'hidden',
    gap: 10,
    // ~28% of a 844px screen ≈ 186pt — matches the design proportion
    minHeight: 186,
  },

  // Decorative ring — large faint circle top-right
  bannerRingOuter: {
    position: 'absolute',
    right: -60,
    top: -60,
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 28,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  bannerRingInner: {
    position: 'absolute',
    right: -18,
    top: -18,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 22,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  // Decorative location pin — right edge, partially cropped
  bannerPin: {
    position: 'absolute',
    right: -28,
    bottom: -10,
    width: 140,
    height: 155,
    opacity: 0.18,
  },

  // "In Progress" pill — white background, navy dot + text
  bannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 7,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: NAVY,
  },
  bannerPillText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: NAVY,
  },

  bannerHeading: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  bannerBody: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.60)',
    lineHeight: 19,
  },

  // ── Quick Tiles
  tilesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    // ~18% of 844px ≈ 150pt
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  quickTileTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#060808',
    letterSpacing: -0.3,
  },
  quickTileImageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  quickTileSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
  tripPlannerImg: {
    width: 90,
    height: 72,
  },
  discoverImg: {
    width: 100,
    height: 66,
  },

  // ── Suggested
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#060808',
    letterSpacing: -0.6,
  },
  suggestedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  suggestedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  suggestedIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestedText: {
    flex: 1,
    gap: 3,
  },
  suggestedTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#060808',
    letterSpacing: -0.2,
  },
  suggestedSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#666666',
  },
});
