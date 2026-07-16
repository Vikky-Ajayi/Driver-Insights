import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface SearchResult {
  id: string;
  name: string;
  address: string;
  distance: string;
}

const MOCK_RESULTS: SearchResult[] = [
  { id: '1', name: 'Wembley Stadium', address: 'South Way, Wembley, London HA9 0WS', distance: '0.8 km' },
  { id: '2', name: 'Victoria Island', address: 'VI, Lagos, Nigeria', distance: '2.3 km' },
  { id: '3', name: 'Teslim Balogun Stadium', address: 'Surulere, Lagos, Nigeria', distance: '3.1 km' },
  { id: '4', name: 'Lekki Phase 1', address: 'Lekki, Lagos, Nigeria', distance: '4.5 km' },
  { id: '5', name: 'Ikeja City Mall', address: 'Ikeja, Lagos, Nigeria', distance: '6.2 km' },
  { id: '6', name: 'Eko Hotel & Suites', address: 'Victoria Island, Lagos', distance: '7.0 km' },
  { id: '7', name: 'Murtala Muhammed Airport', address: 'Ikeja, Lagos, Nigeria', distance: '9.4 km' },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [query, setQuery] = useState('');

  const results = query
    ? MOCK_RESULTS.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.address.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_RESULTS;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Search</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.input }]}>
        <Feather name="search" size={18} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search areas, streets, landmarks"
          placeholderTextColor={colors.mutedForeground}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={[styles.resultRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.pinIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="map-pin" size={16} color={colors.foreground} />
            </View>
            <View style={styles.resultText}>
              <Text style={[styles.resultDistance, { color: colors.mutedForeground }]}>{item.distance}</Text>
              <Text style={[styles.resultName, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.resultAddress, { color: colors.mutedForeground }]} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, gap: 10, marginBottom: 8 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  list: { paddingHorizontal: 20 },
  resultRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
  pinIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  resultText: { flex: 1 },
  resultDistance: { fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 2 },
  resultName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  resultAddress: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 1 },
});
