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
}

function DemandLabel({ label, colors }: { label: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.demandRow}>
      <Text style={[styles.demandText, { color: colors.demand }]}>{label} </Text>
      <Feather name="trending-up" size={13} color={colors.demand} />
    </View>
  );
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

export default function OpportunityCard({ hotspot, type, onViewDetails, onDriveThere }: Props) {
  const colors = useColors();

  const handleDriveThere = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDriveThere();
  };

  const timeRange = `${hotspot.time_start} - ${hotspot.time_end}`;

  const icon =
    type === 'taxi' ? (
      <MaterialCommunityIcons name="taxi" size={22} color="#FFFFFF" />
    ) : (
      <MaterialCommunityIcons name="package-variant" size={22} color="#FFFFFF" />
    );

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={[styles.iconBox, { backgroundColor: colors.foreground }]}>{icon}</View>
        <Text style={[styles.timeText, { color: colors.mutedForeground }]}>{timeRange}</Text>
      </View>

      {/* Venue name */}
      <Text style={[styles.venueName, { color: colors.foreground }]} numberOfLines={1}>
        {hotspot.name}
      </Text>

      {/* Demand label */}
      <DemandLabel label={hotspot.demand_label} colors={colors} />

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatItem
          icon={<Feather name="clock" size={14} color={colors.mutedForeground} />}
          value={`${hotspot.drive_time_minutes} min`}
          label="Drive time"
          colors={colors}
        />
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        {type === 'taxi' ? (
          <>
            <StatItem
              icon={<Feather name="users" size={14} color={colors.mutedForeground} />}
              value={hotspot.driver_saturation}
              label="Driver Saturation"
              colors={colors}
            />
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <StatItem
              icon={<Feather name="navigation" size={14} color={colors.mutedForeground} />}
              value={`${hotspot.distance_km} KM`}
              label="Distance"
              colors={colors}
            />
          </>
        ) : (
          <>
            <StatItem
              icon={<Feather name="activity" size={14} color={colors.mutedForeground} />}
              value={hotspot.demand_requests}
              label="Demand Requests"
              colors={colors}
            />
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <StatItem
              icon={<Feather name="navigation" size={14} color={colors.mutedForeground} />}
              value={`${hotspot.distance_km} KM`}
              label="Distance"
              colors={colors}
            />
          </>
        )}
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
            Drive there {'›'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: -0.3,
  },
  venueName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  demandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demandText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statItem: {
    flex: 1,
    gap: 2,
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
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  solidBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  solidBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
});
