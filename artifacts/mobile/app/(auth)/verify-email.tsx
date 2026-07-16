import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { authApi } from '@/services/api';

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const maskedEmail = email
    ? email.replace(/^(.{4})(.+)(@.+)$/, (_, a, _b, c) => `${a}****${c}`)
    : 'your email';

  const handleConfirm = async () => {
    if (!code || code.length < 6) {
      Alert.alert('Invalid code', 'Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      await authApi.verifyOtp(email ?? '', code);
      router.replace('/(tabs)/');
    } catch (err: unknown) {
      Alert.alert('Verification failed', err instanceof Error ? err.message : 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(59);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
    authApi.forgotPassword(email ?? '').catch(() => null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <Feather name="headphones" size={22} color={colors.foreground} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.heading, { color: colors.foreground }]}>Verify your email</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          A 6 digit Code was sent to{' '}
          <Text style={[styles.boldText, { color: colors.foreground }]}>{maskedEmail}</Text>
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Enter Code</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.foreground }]}
            placeholder="-- -- -- --"
            placeholderTextColor={colors.mutedForeground}
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <Pressable onPress={handleResend}>
          <Text style={[styles.resendText, { color: colors.mutedForeground }]}>
            Didn't get Code?{' '}
            <Text style={{ color: countdown > 0 ? colors.mutedForeground : colors.foreground, fontFamily: 'Inter_700Bold' }}>
              {countdown > 0
                ? `Resend Code in 00:${String(countdown).padStart(2, '0')}`
                : 'Resend Code'}
            </Text>
          </Text>
        </Pressable>
      </View>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.foreground, opacity: loading ? 0.7 : 1 }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Confirm</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 12, gap: 16 },
  heading: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1.1 },
  subtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', letterSpacing: -0.3, lineHeight: 22 },
  boldText: { fontFamily: 'Inter_700Bold' },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  input: { paddingHorizontal: 16, paddingVertical: 15, borderRadius: 12, fontSize: 20, fontFamily: 'Inter_700Bold', letterSpacing: 4 },
  resendText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  bottomSection: { paddingHorizontal: 24, paddingTop: 12 },
  primaryBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
});
