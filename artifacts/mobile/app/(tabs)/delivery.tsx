import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MapView, Circle, Marker } from '@/components/MapView';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useColors } from '@/hooks/useColors';
import { hotspotApi, Hotspot } from '@/services/api';
import OpportunityCard from '@/components/OpportunityCard';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAP_HEIGHT = SCREEN_HEIGHT * 0.42;

const MOCK_DELIVERY: Hotspot[] = [
  {
    id: 'd1', name: 'Wembley', cluster_center: { lat: 51.5560, lng: -1.2799 },
    radius: 600, intensity_score: 78, active_events: [], expiry_timestamp: '',
    drive_time_minutes: 8, distance_km: 5.2, driver_saturation: 'LOW',
    demand_requests: 'HIGH', demand_label: 'Demand expected to Increase',
    time_start: '10:45 PM', time_end: '11:30 PM', category: 'delivery',
  },
  {
    id: 'd2', name: 'Teslim Balogun Stadium', cluster_center: { lat: 51.5230, lng: -1.2450 },
    radius: 500, intensity_score: 60, active_events: [], expiry_timestamp: '',
    drive_time_minutes: 12, distance_km: 7.8, driver_saturation: 'LOW',
    demand_requests: 'MEDIUM', demand_label: 'Demand increase likely',
    time_start: '10:45 PM', time_end: '11:30 PM', category: 'delivery',
  },
];

export default function DeliveryScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const mapRef = useRef<MapView>(null);
  const [isOnline, setIsOnline] = useState(false);

  const { data: hotspots, isLoading } = useQuery({
    queryKey: ['hotspots', 'delivery'],
    queryFn: () => hotspotApi.getAll(),
    retry: 1,
  });

  const displayHotspots = (hotspots ?? MOCK_DELIVERY).filter(
    (h) => !h.category || h.category === 'delivery'
  ).map(h => ({ ...h, category: 'delivery' as const }));

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Location.requestForegroundPermissionsAsync().catch(() => null);
  }, []);

  const handleViewDetails = (hotspot: Hotspot) => {
    router.push({ pathname: '/details', params: { id: hotspot.id, data: JSON.stringify(hotspot), type: 'delivery' } });
  };

  const handleDriveThere = (hotspot: Hotspot) => {
    mapRef.current?.animateToRegion({
      latitude: hotspot.cluster_center.lat,
      longitude: hotspot.cluster_center.lng,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    }, 600);
  };

  const initialRegion = displayHotspots.length > 0
    ? {
        latitude: displayHotspots[0].cluster_center.lat,
        longitude: displayHotspots[0].cluster_center.lng,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      }
    : { latitude: 51.505, longitude: -0.09, latitudeDelta: 0.15, longitudeDelta: 0.15 };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>For Delivery</Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>More deliveries, less waiting</Text>
        </View>
        <Pressable
          style={[styles.statusPill, { backgroundColor: colors.secondary }]}
          onPress={() => setIsOnline((v) => !v)}
        >
          <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.onlineDot : colors.offlineDot }]} />
          <Text style={[styles.statusText, { color: colors.foreground }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </Pressable>
      </View>

      {/* Map */}
      <View style={[styles.mapContainer, { height: MAP_HEIGHT }]}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {displayHotspots.map((h) => (
            <React.Fragment key={h.id}>
              <Circle
                center={{ latitude: h.cluster_center.lat, longitude: h.cluster_center.lng }}
                radius={h.radius}
                fillColor="rgba(6,8,8,0.12)"
                strokeColor="rgba(6,8,8,0.5)"
                strokeWidth={2}
              />
              <Marker
                coordinate={{ latitude: h.cluster_center.lat, longitude: h.cluster_center.lng }}
                onPress={() => handleViewDetails(h)}
              >
                <View style={[styles.deliveryPin, { backgroundColor: colors.foreground }]}>
                  <MaterialCommunityIcons name="package-variant-closed" size={14} color="#FFFFFF" />
                </View>
              </Marker>
            </React.Fragment>
          ))}
        </MapView>

        <Pressable style={[styles.mapBtn, { top: 12, left: 12, backgroundColor: colors.background }]}>
          <Feather name="maximize-2" size={18} color={colors.foreground} />
        </Pressable>
        <Pressable
          style={[styles.mapBtn, { top: 12, right: 12, backgroundColor: colors.background }]}
          onPress={() => router.push('/search')}
        >
          <Feather name="search" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Opportunities */}
      <View style={styles.opportunitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Opportunities</Text>
          <Pressable
            onPress={() => router.push({ pathname: '/opportunities', params: { type: 'delivery', data: JSON.stringify(displayHotspots) } })}
          >
            <Feather name="chevron-right" size={20} color={colors.foreground} />
          </Pressable>
        </View>
        <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
          Discover areas where delivery demand is highest
        </Text>

        {isLoading ? (
          <ActivityIndicator color={colors.foreground} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={displayHotspots}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardList}
            renderItem={({ item }) => (
              <OpportunityCard
                hotspot={item}
                type="delivery"
                onViewDetails={() => handleViewDetails(item)}
                onDriveThere={() => handleDriveThere(item)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1.0 },
  headerSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  mapContainer: { width: '100%', overflow: 'hidden' },
  deliveryPin: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  mapBtn: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  opportunitiesSection: { flex: 1, paddingTop: 16, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', letterSpacing: -0.6 },
  sectionSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2, marginBottom: 12 },
  cardList: { gap: 12, paddingRight: 20 },
});
