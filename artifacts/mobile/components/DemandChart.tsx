import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';

interface Props {
  currentHour?: number; // 0–23
}

const HOURS = ['9AM', '', '', '', '', '', 'NOW', '', '', ''];
const BAR_COUNT = 12;

// Simulated demand pattern peaking around midnight
const DEMAND_PATTERN = [0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.9, 0.75, 0.55, 0.4, 0.3, 0.25];

export default function DemandChart({ currentHour = 6 }: Props) {
  const colors = useColors();
  const chartWidth = 280;
  const chartHeight = 80;
  const barWidth = chartWidth / BAR_COUNT - 4;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight}>
        {DEMAND_PATTERN.map((height, i) => {
          const isNow = i === currentHour;
          const barH = height * chartHeight;
          const x = i * (chartWidth / BAR_COUNT) + 2;
          const y = chartHeight - barH;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={3}
              fill={isNow ? colors.foreground : colors.border}
            />
          );
        })}
      </Svg>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>9AM</Text>
        <Text style={[styles.nowLabel, { color: colors.foreground }]}>NOW</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  nowLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
});
