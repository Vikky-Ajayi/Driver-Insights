import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { Hotspot } from '@/services/api';
import DemandChart from '@/components/DemandChart';

type FeedbackStep = 'none' | 'drove' | 'rating' | 'reason';

const REASONS = [
  'Too far away',
  'Already had trips elsewhere',
  "Didn't have time",
  'Weather changed my plans',
  'I was already on an active trip',
];

const RATINGS = [
  { label: 'Excellent', icon: '😁' },
  { label: 'Good', icon: '🙂' },
  { label: 'Okay', icon: '😐' },
  { label: 'Poor', icon: '🙁' },
  { label: 'Very Poor', icon: '😞' },
];

export default function DetailsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { data, type } = useLocalSearchParams<{ data: string; type: string }>();

  const hotspot: Hotspot | null = useMemo(() => {
    try { return JSON.parse(data ?? 'null'); } catch { return null; }
  }, [data]);

  const [feedbackStep, setFeedbackStep] = useState<FeedbackStep>('none');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  if (!hotspot) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.mutedForeground }}>Hotspot not found.</Text>
      </View>
    );
  }

  const isDelivery = type === 'delivery';

  const handleDriveThere = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
    // Trigger feedback after a delay
    setTimeout(() => setFeedbackStep('drove'), 30 * 60 * 1000); // 30 min
  };

  const scorePercent = hotspot.intensity_score / 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Details</Text>
        <Pressable
          style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
          onPress={() => router.back()}
        >
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon + time */}
        <View style={styles.topRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.foreground }]}>
            {isDelivery ? (
              <MaterialCommunityIcons name="package-variant" size={22} color="#FFFFFF" />
            ) : (
              <MaterialCommunityIcons name="taxi" size={22} color="#FFFFFF" />
            )}
          </View>
          <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
            {hotspot.time_start} - {hotspot.time_end}
          </Text>
        </View>

        {/* Venue name + demand */}
        <Text style={[styles.venueName, { color: colors.foreground }]}>{hotspot.name}</Text>
        <View style={styles.demandRow}>
          <Text style={[styles.demandText, { color: colors.demand }]}>{hotspot.demand_label} </Text>
          <Feather name="trending-up" size={13} color={colors.demand} />
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <View style={styles.statItem}>
            <Feather name="clock" size={15} color={colors.mutedForeground} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{hotspot.drive_time_minutes} min</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Drive time</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            {isDelivery ? (
              <Feather name="activity" size={15} color={colors.mutedForeground} />
            ) : (
              <Feather name="users" size={15} color={colors.mutedForeground} />
            )}
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {isDelivery ? hotspot.demand_requests : hotspot.driver_saturation}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              {isDelivery ? 'Demand Requests' : 'Driver Saturation'}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Feather name="navigation" size={15} color={colors.mutedForeground} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{hotspot.distance_km} KM</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Distance</Text>
          </View>
        </View>

        {/* Live Demand Score */}
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreLabel, { color: colors.foreground }]}>Live Demand Score</Text>
          <Text style={[styles.scoreValue, { color: colors.foreground }]}>{hotspot.intensity_score}/100</Text>
        </View>
        <View style={[styles.scoreBarBg, { backgroundColor: colors.secondary }]}>
          <View
            style={[styles.scoreBarFill, { backgroundColor: colors.foreground, width: `${scorePercent * 100}%` }]}
          />
        </View>

        {/* Info box */}
        <View style={[styles.infoBox, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            {hotspot.name} is at peak demand, 3× more requests than average. Surge active. Most
            drivers are earning ₦3,200+ per trip right now.
          </Text>
        </View>

        {/* Demand by Hour */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.foreground }]}>Demand by Hour</Text>
            <Text style={[styles.chartRange, { color: colors.mutedForeground }]}>7 PM — 2 AM</Text>
          </View>
          <DemandChart currentHour={new Date().getHours() % 12} />
        </View>
      </ScrollView>

      {/* Drive there CTA */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
        <Pressable
          style={[styles.driveBtn, { backgroundColor: colors.foreground }]}
          onPress={handleDriveThere}
        >
          <Text style={[styles.driveBtnText, { color: colors.primaryForeground }]}>
            Drive there {'>'}
          </Text>
        </Pressable>
      </View>

      {/* Feedback modals */}
      {/* Did you drive there? */}
      <Modal visible={feedbackStep === 'drove'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.feedbackSheet, { backgroundColor: colors.background }]}>
            <Pressable style={styles.modalCloseBtn} onPress={() => setFeedbackStep('none')}>
              <Feather name="x" size={20} color={colors.foreground} />
            </Pressable>
            <View style={[styles.feedbackIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="map-pin" size={28} color={colors.foreground} />
            </View>
            <Text style={[styles.feedbackTitle, { color: colors.foreground }]}>Did you drive to this location?</Text>
            <Text style={[styles.feedbackSubtitle, { color: colors.mutedForeground }]}>
              Your feedback helps us improve Trip Planner recommendations for you and other drivers.
            </Text>
            <View style={[styles.feedbackHotspotCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <View style={[styles.iconBox, { backgroundColor: colors.foreground }]}>
                <MaterialCommunityIcons name="taxi" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.feedbackCardTime, { color: colors.mutedForeground }]}>
                  {hotspot.time_start} - {hotspot.time_end}
                </Text>
                <Text style={[styles.feedbackCardName, { color: colors.foreground }]}>{hotspot.name}</Text>
              </View>
            </View>
            <Pressable
              style={[styles.feedbackPrimaryBtn, { backgroundColor: colors.foreground }]}
              onPress={() => setFeedbackStep('rating')}
            >
              <Text style={[styles.feedbackPrimaryBtnText, { color: colors.primaryForeground }]}>Yes, I did</Text>
            </Pressable>
            <Pressable
              style={[styles.feedbackSecondaryBtn, { backgroundColor: colors.secondary }]}
              onPress={() => setFeedbackStep('reason')}
            >
              <Text style={[styles.feedbackSecondaryBtnText, { color: colors.foreground }]}>No, I didn't</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* How was it? */}
      <Modal visible={feedbackStep === 'rating'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.feedbackSheet, { backgroundColor: colors.background }]}>
            <Pressable style={styles.modalCloseBtn} onPress={() => setFeedbackStep('none')}>
              <Feather name="x" size={20} color={colors.foreground} />
            </Pressable>
            <View style={[styles.feedbackIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="star" size={28} color={colors.foreground} />
            </View>
            <Text style={[styles.feedbackTitle, { color: colors.foreground }]}>How was it?</Text>
            <Text style={[styles.feedbackSubtitle, { color: colors.mutedForeground }]}>
              Your feedback helps us improve Trip Planner recommendations for you and other drivers.
            </Text>
            <View style={styles.emojiRow}>
              {RATINGS.map((r) => (
                <Pressable
                  key={r.label}
                  style={[styles.emojiItem, selectedRating === r.label && { borderColor: colors.foreground, borderWidth: 2, borderRadius: 10 }]}
                  onPress={() => setSelectedRating(r.label)}
                >
                  <Text style={styles.emoji}>{r.icon}</Text>
                  <Text style={[styles.emojiLabel, { color: colors.mutedForeground }]}>{r.label}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              style={[styles.feedbackPrimaryBtn, { backgroundColor: colors.foreground }]}
              onPress={() => setFeedbackStep('none')}
            >
              <Text style={[styles.feedbackPrimaryBtnText, { color: colors.primaryForeground }]}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Why not? */}
      <Modal visible={feedbackStep === 'reason'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.feedbackSheet, { backgroundColor: colors.background }]}>
            <Pressable style={styles.modalCloseBtn} onPress={() => setFeedbackStep('none')}>
              <Feather name="x" size={20} color={colors.foreground} />
            </Pressable>
            <View style={[styles.feedbackIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="x-circle" size={28} color={colors.foreground} />
            </View>
            <Text style={[styles.feedbackTitle, { color: colors.foreground }]}>Why not?</Text>
            <Text style={[styles.feedbackSubtitle, { color: colors.mutedForeground }]}>
              Your feedback helps us improve Trip Planner recommendations for you and other drivers.
            </Text>
            {REASONS.map((r) => (
              <Pressable
                key={r}
                style={[styles.reasonRow, { borderBottomColor: colors.border }]}
                onPress={() => setSelectedReason(r)}
              >
                <Text style={[styles.reasonText, { color: colors.foreground }]}>{r}</Text>
                <View style={[styles.radio, { borderColor: colors.foreground }]}>
                  {selectedReason === r && <View style={[styles.radioDot, { backgroundColor: colors.foreground }]} />}
                </View>
              </Pressable>
            ))}
            <Pressable
              style={[styles.feedbackPrimaryBtn, { backgroundColor: colors.foreground }]}
              onPress={() => setFeedbackStep('none')}
            >
              <Text style={[styles.feedbackPrimaryBtnText, { color: colors.primaryForeground }]}>Submit</Text>
            </Pressable>
            <Pressable
              style={[styles.feedbackSecondaryBtn, { backgroundColor: colors.secondary }]}
              onPress={() => setFeedbackStep('none')}
            >
              <Text style={[styles.feedbackSecondaryBtnText, { color: colors.foreground }]}>Skip</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', letterSpacing: -0.7 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, gap: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  timeText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  venueName: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1.1, lineHeight: 34 },
  demandRow: { flexDirection: 'row', alignItems: 'center' },
  demandText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  statsRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 14, marginVertical: 4 },
  statItem: { flex: 1, alignItems: 'flex-start', gap: 3 },
  statValue: { fontSize: 14, fontFamily: 'Inter_700Bold', letterSpacing: -0.3 },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  statDivider: { width: 1, height: 40, marginHorizontal: 8 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  scoreValue: { fontSize: 15, fontFamily: 'Inter_700Bold', letterSpacing: -0.3 },
  scoreBarBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  infoBox: { padding: 14, borderRadius: 12 },
  infoText: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19 },
  chartSection: { gap: 10 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  chartRange: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  ctaContainer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  driveBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  driveBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  feedbackSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, gap: 12 },
  modalCloseBtn: { alignSelf: 'flex-end', padding: 4 },
  feedbackIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  feedbackTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', letterSpacing: -0.7, textAlign: 'center' },
  feedbackSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
  feedbackHotspotCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  feedbackCardTime: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  feedbackCardName: { fontSize: 16, fontFamily: 'Inter_700Bold', marginTop: 2 },
  feedbackPrimaryBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  feedbackPrimaryBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  feedbackSecondaryBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  feedbackSecondaryBtnText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  emojiRow: { flexDirection: 'row', justifyContent: 'space-between' },
  emojiItem: { alignItems: 'center', padding: 8, gap: 4 },
  emoji: { fontSize: 28 },
  emojiLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  reasonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  reasonText: { fontSize: 15, fontFamily: 'Inter_400Regular', flex: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
});
