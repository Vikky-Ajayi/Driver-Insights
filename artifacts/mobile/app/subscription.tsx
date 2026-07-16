import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { paymentApi } from '@/services/api';

interface Plan {
  id: string;
  price: string;
  period: string;
  label: string;
  sublabel: string;
  badge?: string;
  features: Array<{ included: boolean; text: string }>;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    price: '₦0.00',
    period: '/ Month',
    label: 'Free',
    sublabel: 'No payment Needed',
    features: [
      { included: true, text: 'Live heatmap (30 min delay)' },
      { included: true, text: 'Top 3 hotspots per city' },
      { included: true, text: 'Basic earnings tracker' },
      { included: false, text: 'Real-time surge alerts' },
      { included: false, text: 'Peak hour predictions' },
    ],
  },
  {
    id: 'pro',
    price: '₦4,900.00',
    period: '/ Month',
    label: 'Pro',
    sublabel: '3 days Free Trial',
    badge: 'Most Popular',
    features: [
      { included: true, text: 'Real-time heatmap' },
      { included: true, text: 'Unlimited hotspots' },
      { included: true, text: 'Real-time surge alerts' },
      { included: true, text: 'Peak hour predictions' },
      { included: true, text: 'Advanced earnings tracker' },
    ],
  },
  {
    id: 'fleet',
    price: '₦18,000.00',
    period: '/ Month',
    label: 'Fleet',
    sublabel: 'Contact Sales',
    features: [
      { included: true, text: 'Everything in Pro' },
      { included: true, text: 'Fleet management dashboard' },
      { included: true, text: 'Driver performance analytics' },
      { included: true, text: 'Priority support' },
    ],
  },
];

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [selected, setSelected] = useState('free');
  const [loading, setLoading] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === selected) ?? PLANS[0]!;

  const handleSubscribe = async () => {
    if (selected === 'free') {
      router.back();
      return;
    }
    setLoading(true);
    try {
      const { paymentUrl } = await paymentApi.initialize(selected);
      await Linking.openURL(paymentUrl);
    } catch (err: unknown) {
      Alert.alert('Payment Error', err instanceof Error ? err.message : 'Failed to start payment.');
    } finally {
      setLoading(false);
    }
  };

  const btnLabel = selected === 'free' ? 'Try For Free' : `Try ${selectedPlan.label} For Free`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={{ width: 36 }} />
        <View />
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
        {/* Icon + heading */}
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="map-pin" size={28} color={colors.foreground} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>Get unlimited access</Text>
        </View>

        {/* Plan cards */}
        {PLANS.map((plan) => (
          <Pressable
            key={plan.id}
            style={[
              styles.planCard,
              {
                borderColor: selected === plan.id ? colors.foreground : colors.border,
                borderWidth: selected === plan.id ? 2 : 1,
              },
            ]}
            onPress={() => setSelected(plan.id)}
          >
            <View style={styles.planHeader}>
              <View style={styles.planPriceRow}>
                <Text style={[styles.planPrice, { color: colors.foreground }]}>{plan.price}</Text>
                <Text style={[styles.planPeriod, { color: colors.mutedForeground }]}> {plan.period}</Text>
                {plan.badge && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.upgrade }]}>
                    <Text style={styles.popularBadgeText}>{plan.badge}</Text>
                  </View>
                )}
              </View>
              <View style={styles.planRadioRow}>
                <Text style={[styles.planLabel, { color: colors.foreground }]}>{plan.label}</Text>
                <Text style={[styles.planSublabel, { color: colors.mutedForeground }]}> · {plan.sublabel}</Text>
                <View style={[styles.radio, { borderColor: selected === plan.id ? colors.foreground : colors.border }]}>
                  {selected === plan.id && <View style={[styles.radioDot, { backgroundColor: colors.foreground }]} />}
                </View>
              </View>
            </View>

            <View style={[styles.planDivider, { backgroundColor: colors.border }]} />

            {plan.features.map((f) => (
              <View key={f.text} style={styles.featureRow}>
                {f.included ? (
                  <Feather name="check" size={15} color={colors.green} />
                ) : (
                  <Feather name="x" size={15} color={colors.destructive} />
                )}
                <Text style={[styles.featureText, { color: colors.foreground }]}>{f.text}</Text>
              </View>
            ))}
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
        <Pressable
          style={[styles.ctaBtn, { backgroundColor: colors.foreground, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={[styles.ctaBtnText, { color: colors.primaryForeground }]}>{btnLabel}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 8 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, gap: 14 },
  heroSection: { alignItems: 'center', gap: 14, paddingVertical: 8 },
  heroIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', letterSpacing: -0.9 },
  planCard: { borderRadius: 14, padding: 16, gap: 10 },
  planHeader: { gap: 4 },
  planPriceRow: { flexDirection: 'row', alignItems: 'center' },
  planPrice: { fontSize: 22, fontFamily: 'Inter_700Bold', letterSpacing: -0.7 },
  planPeriod: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  popularBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, marginLeft: 8 },
  popularBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  planRadioRow: { flexDirection: 'row', alignItems: 'center' },
  planLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  planSublabel: { fontSize: 13, fontFamily: 'Inter_400Regular', flex: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  planDivider: { height: 1 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  ctaContainer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  ctaBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  ctaBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
});
