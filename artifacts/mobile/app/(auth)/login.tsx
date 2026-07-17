import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError, authApi } from '@/services/api';
import { useToast } from '@/components/Toast';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Missing fields', 'Please enter your email and password.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/');
    } catch (err: unknown) {
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_VERIFIED') {
        // Resend a fresh verification code silently
        authApi.resendVerification(email.trim()).catch(() => null);
        toast.info(
          'Email not verified',
          'A verification code was sent to your inbox. Please enter it to continue.'
        );
        setTimeout(() => {
          router.push({ pathname: '/(auth)/verify-email', params: { email: email.trim() } });
        }, 1800);
      } else {
        const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
        toast.error('Login failed', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar */}
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
        {/* Heading */}
        <View style={styles.headingBlock}>
          <Text style={[styles.heading, { color: colors.foreground }]}>Welcome back,</Text>
          <Text style={[styles.headingMuted, { color: colors.mutedForeground }]}>Driver</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Sign in to see live demand maps in your city.
          </Text>
        </View>

        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Email address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.foreground }]}
            placeholder="e.g Johndoe@email.com"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
          <View>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, color: colors.foreground, paddingRight: 50 }]}
              placeholder="Min. 8 characters"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <Pressable style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>
          <Pressable style={styles.forgotRow} onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={[styles.forgotText, { color: colors.foreground }]}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Spacer to push button to bottom */}
        <View style={{ flex: 1, minHeight: 32 }} />

        {/* CTA */}
        <View style={styles.ctaBlock}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: colors.foreground, opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.primaryForeground} />
              : <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Log in</Text>
            }
          </Pressable>

          <View style={styles.signinRow}>
            <Text style={[styles.signinText, { color: colors.mutedForeground }]}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={[styles.signinLink, { color: colors.foreground }]}>Create account</Text>
            </Pressable>
          </View>
        </View>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 20,
    flexGrow: 1,
  },
  headingBlock: { gap: 4 },
  heading: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1.1, lineHeight: 34 },
  headingMuted: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1.1, lineHeight: 34, opacity: 0.4 },
  subtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', letterSpacing: -0.3, marginTop: 4 },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium', letterSpacing: -0.2 },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    letterSpacing: -0.3,
  },
  eyeBtn: { position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' },
  forgotRow: { alignItems: 'flex-end', marginTop: 4 },
  forgotText: { fontSize: 14, fontFamily: 'Inter_500Medium', letterSpacing: -0.2 },
  ctaBlock: { gap: 14 },
  primaryBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  signinRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signinText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  signinLink: { fontSize: 14, fontFamily: 'Inter_700Bold' },
});
