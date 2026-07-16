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

const TABS = ['Discover', 'Rewards'];

const GIFT_CARDS = [
  { id: '1', name: 'Just Eat', category: 'Food', points: 500, color: '#FF6700' },
  { id: '2', name: 'Nike', category: 'Fashion', points: 800, color: '#000000' },
  { id: '3', name: 'Amazon', category: 'Shopping', points: 600, color: '#FF9900' },
  { id: '4', name: 'Uber Eats', category: 'Food', points: 450, color: '#06C167' },
  { id: '5', name: 'Spotify', category: 'Music', points: 350, color: '#1DB954' },
  { id: '6', name: 'Netflix', category: 'Entertainment', points: 700, color: '#E50914' },
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

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.secondary }]}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: colors.background },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.foreground : colors.mutedForeground },
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
            <Pressable style={[styles.giftCard, { borderColor: colors.border }]}>
              <View style={[styles.giftCardImage, { backgroundColor: item.color }]}>
                <Feather name="gift" size={28} color="#FFFFFF" />
              </View>
              <Text style={[styles.giftCardName, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.giftCardCategory, { color: colors.mutedForeground }]}>{item.category}</Text>
              <Text style={[styles.giftCardPoints, { color: colors.foreground }]}>
                From <Text style={styles.fireEmoji}>🔥</Text> {item.points}
              </Text>
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.emptyRewards}>
          <Feather name="award" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No rewards yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
            Complete trips to earn points and redeem gift cards
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 100, padding: 3, marginBottom: 20 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 100 },
  tabText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  grid: { paddingHorizontal: 20, gap: 14 },
  row: { gap: 14 },
  giftCard: { flex: 1, borderRadius: 14, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  giftCardImage: { height: 120, alignItems: 'center', justifyContent: 'center' },
  giftCardName: { fontSize: 15, fontFamily: 'Inter_700Bold', padding: 12, paddingBottom: 2, letterSpacing: -0.3 },
  giftCardCategory: { fontSize: 12, fontFamily: 'Inter_400Regular', paddingHorizontal: 12, paddingBottom: 4 },
  giftCardPoints: { fontSize: 13, fontFamily: 'Inter_500Medium', paddingHorizontal: 12, paddingBottom: 12 },
  fireEmoji: { fontSize: 13 },
  emptyRewards: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
});
