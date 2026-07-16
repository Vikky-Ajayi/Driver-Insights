import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { Hotspot } from '@/services/api';

interface Props {
  hotspot: Hotspot;
  type: 'taxi' | 'delivery';
  onViewDetails: () => void;
  onDriveThere: () => void;
  fullWidth?: boolean;
}

function StatItem({
  icon,
  value,
  label,
  colors,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.statItem}>
      {icon}
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function OpportunityCard({
  hotspot,
  type,
  onViewDetails,
  onDriveThere,
  fullWidth,
}: Props) {
  const colors = useColors();

  const handleDriveThere = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDriveThere();
  };

  const timeRange = `${hotspot.time_start} - ${hotspot.time_end}`;

  const iconEl =
    type === 'taxi' ? (
      <MaterialCommunityIcons name="car-side" size={20} color="#FFFFFF" />
    ) : (
      <MaterialCommunityIcons name="package-variant-closed" size={20} color="#FFFFFF" />
    );

  // Figma stat order:
  // Taxi:     Drive time | Distance | Driver Saturation
  // Delivery: Drive time | Demand Requests | Distance
  const stats =
    type === 'taxi'
      ? [
          {
            icon: <Feather name="clock" size={14} color={colors.mutedForeground} />,
            value: `${hotspot.drive_time_minutes} min`,
            label: 'Drive time',
          },
          {
            icon: <MaterialCommunityIcons name="map-marker-distance" size={14} color={colors.mutedForeground} />,
            value: `${hotspot.distance_km} KM`,
            label: 'Distance',
          },
          {
            icon: <Feather name="users" size={14} color={colors.mutedForeground} />,
            value: hotspot.driver_saturation,
            label: 'Driver Saturation',
          },
        ]
      : [
          {
            icon: <Feather name="clock" size={14} color={colors.mutedForeground} />,
            value: `${hotspot.drive_time_minutes} min`,
            label: 'Drive time',
          },
          {
            icon: <Feather name="activity" size={14} color={colors.mutedForeground} />,
            value: hotspot.demand_requests,
            label: 'Demand Requests',
          },
          {
            icon: <MaterialCommunityIcons name="map-marker-distance" size={14} color={colors.mutedForeground} />,
            value: `${hotspot.distance_km} KM`,
            label: 'Distance',
          },
        ];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        fullWidth && styles.cardFull,
      ]}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={[styles.iconBox, { backgroundColor: colors.foreground }]}>{iconEl}</View>
        <Text style={[styles.timeText, { color: colors.mutedForeground }]}>{timeRange}</Text>
      </View>

      {/* Venue name */}
      <Text style={[styles.venueName, { color: colors.foreground }]} numberOfLines={2}>
        {hotspot.name}
      </Text>

      {/* Demand label */}
      <View style={styles.demandRow}>
        <Text style={[styles.demandText, { color: colors.demand }]}>{hotspot.demand_label} </Text>
        <Feather name="trending-up" size={13} color={colors.demand} />
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            <StatItem icon={s.icon} value={s.value} label={s.label} colors={colors} />
            {i < stats.length - 1 && (
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Action buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.outlineBtn, { borderColor: colors.border }]}
          onPress={onViewDetails}
        >
          <Text style={[styles.outlineBtnText, { color: colors.foreground }]}>View Details</Text>
        </Pressable>
        <Pressable
          style={[styles.solidBtn, { backgroundColor: colors.foreground }]}
          onPress={handleDriveThere}
        >
          <Text style={[styles.solidBtnText, { color: colors.primaryForeground }]}>
            Drive there {'>'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardFull: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: -0.2,
  },
  venueName: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.6,
    lineHeight: 28,
    marginTop: 2,
  },
  demandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demandText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statItem: {
    flex: 1,
    gap: 3,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  statDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  outlineBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  solidBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  solidBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
