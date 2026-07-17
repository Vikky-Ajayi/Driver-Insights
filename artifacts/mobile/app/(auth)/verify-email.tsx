import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useColors } from '@/hooks/useColors';
import { authApi } from '@/services/api';
import { useToast } from '@/components/Toast';

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const toast = useToast();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startCountdown();
    return () => clearInterval(timerRef.current!);
  }, []);

  const startCountdown = () => {
    clearInterval(timerRef.current!);
    setCountdown(59);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const maskedEmail = email
    ? email.replace(/^(.{3})(.+)(@.+)$/, (_, a, _b, c) => `${a}****${c}`)
    : 'your email';

  const handleConfirm = async () => {
    if (!code || code.length < 6) {
      toast.error('Invalid code', 'Please enter the full 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      await authApi.verifyEmail(email ?? '', code);
      toast.success('Email verified!', 'Your account is ready. Please log in.');
      setTimeout(() => router.replace('/(auth)/login'), 1200);
    } catch (err: unknown) {
      toast.error(
        'Verification failed',
        err instanceof Error ? err.message : 'The code is incorrect or has expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    authApi.resendVerification(email ?? '').catch(() => null);
    toast.info('Code resent', 'A new verification code is on its way.');
    startCountdown();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <Feather name="headphones" size={22} color={colors.foreground} />
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={32}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingBlock}>
          <Text style={[styles.heading, { color: colors.foreground }]}>Verify your email</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            A 6-digit code was sent to{' '}
            <Text style={[styles.boldText, { color: colors.foreground }]}>{maskedEmail}</Text>
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Enter Code</Text>
          <TextInput
            style={[styles.codeInput, { backgroundColor: colors.input, color: colors.foreground }]}
            placeholder="• • • • • •"
            placeholderTextColor={colors.mutedForeground}
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />
        </View>

        <Pressable onPress={handleResend} disabled={countdown > 0}>
          <Text style={[styles.resendText, { color: colors.mutedForeground }]}>
            Didn't get the code?{' '}
            <Text style={[
              styles.resendAction,
              { color: countdown > 0 ? colors.mutedForeground : colors.foreground }
            ]}>
              {countdown > 0
                ? `Resend in 00:${String(countdown).padStart(2, '0')}`
                : 'Resend Code'}
            </Text>
          </Text>
        </Pressable>

        <View style={{ flex: 1, minHeight: 40 }} />

        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.foreground, opacity: loading ? 0.7 : 1 }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.primaryForeground} />
            : <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Confirm</Text>
          }
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 20,
    flexGrow: 1,
  },
  headingBlock: { gap: 8 },
  heading: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1.1 },
  subtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', letterSpacing: -0.3, lineHeight: 22 },
  boldText: { fontFamily: 'Inter_700Bold' },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  codeInput: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 14,
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 10,
    textAlign: 'center',
  },
  resendText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  resendAction: { fontFamily: 'Inter_700Bold' },
  primaryBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
});
