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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

const TABS = ['Discover', 'Rewards'];

const GIFT_CARDS = [
  { id: '1', name: 'JUST EAT', subtitle: 'Online', points: 500, bgColor: '#FF6700', iconName: 'food-fork-drink' as const },
  { id: '2', name: 'JUST EAT', subtitle: 'Online', points: 500, bgColor: '#FF6700', iconName: 'food-fork-drink' as const },
  { id: '3', name: 'JUST EAT', subtitle: 'Online', points: 500, bgColor: '#FF6700', iconName: 'food-fork-drink' as const },
  { id: '4', name: 'JUST EAT', subtitle: 'Online', points: 500, bgColor: '#FF6700', iconName: 'food-fork-drink' as const },
  { id: '5', name: 'JUST EAT', subtitle: 'Online', points: 500, bgColor: '#FF6700', iconName: 'food-fork-drink' as const },
  { id: '6', name: 'JUST EAT', subtitle: 'Online', points: 500, bgColor: '#FF6700', iconName: 'food-fork-drink' as const },
];

export default function RedeemScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState('Discover');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Redeem</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tab switcher */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.secondary }]}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && [styles.tabActive, { backgroundColor: colors.background }]]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.foreground : colors.mutedForeground },
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'Discover' ? (
        <FlatList
          data={GIFT_CARDS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 20 }]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable style={[styles.giftCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {/* Card image area */}
              <View style={[styles.giftCardImage, { backgroundColor: item.bgColor }]}>
                <View style={styles.giftCardLogoBox}>
                  <MaterialCommunityIcons name={item.iconName} size={28} color="#FFFFFF" />
                  <Text style={styles.giftCardLogoText}>{item.name}</Text>
                </View>
              </View>
              {/* Card info */}
              <View style={styles.giftCardInfo}>
                <Text style={[styles.giftCardName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.giftCardSubtitle, { color: colors.mutedForeground }]}>{item.subtitle}</Text>
                <Text style={[styles.giftCardPoints, { color: colors.foreground }]}>
                  {'From 🔥 '}{item.points}
                </Text>
              </View>
            </Pressable>
          )}
        />
      ) : (
        /* Rewards empty state */
        <View style={styles.emptyRewards}>
          <View style={[styles.emptyIconBox, { backgroundColor: colors.secondary }]}>
            <MaterialCommunityIcons name="gift-outline" size={36} color={colors.foreground} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Rewards</Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
            Once you redeem points, your Rewards will{'\n'}show up here.
          </Text>
        </View>
      )}
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
    paddingBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', letterSpacing: -0.6 },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 100,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 100,
  },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  tabTextActive: { fontFamily: 'Inter_600SemiBold' },
  grid: { paddingHorizontal: 16, gap: 14 },
  row: { gap: 14 },
  giftCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  giftCardImage: {
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftCardLogoBox: {
    alignItems: 'center',
    gap: 4,
  },
  giftCardLogoText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  giftCardInfo: {
    padding: 10,
    gap: 2,
  },
  giftCardName: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  giftCardSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  giftCardPoints: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  emptyRewards: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    borderRadius: 16,
    maxHeight: 220,
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBEBEB',
    marginTop: 20,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    color: '#888888',
  },
});
