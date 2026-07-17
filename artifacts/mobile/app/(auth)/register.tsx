import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
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
import { useToast } from '@/components/Toast';

const COUNTRIES = [
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria', dial: '+234' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', dial: '+44' },
  { code: 'US', flag: '🇺🇸', name: 'United States', dial: '+1' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana', dial: '+233' },
  { code: 'KE', flag: '🇰🇪', name: 'Kenya', dial: '+254' },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa', dial: '+27' },
];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { register } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [dialCode, setDialCode] = useState('+234');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDialModal, setShowDialModal] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      toast.error('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password too short', 'Password must be at least 8 characters.');
      return;
    }
    if (!/\d/.test(password)) {
      toast.error('Weak password', 'Password must include at least one number.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    try {
      await register({ fullName, email: email.trim(), phone: `${dialCode}${phone}`, country, password });
      toast.success('Account created!', 'Check your email for the verification code.');
      router.push({ pathname: '/(auth)/verify-email', params: { email: email.trim() } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast.error('Registration failed', message);
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
        <Pressable>
          <Feather name="headphones" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        <View style={styles.headingBlock}>
          <Text style={[styles.heading, { color: colors.foreground }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Set up an account, takes less than 2 minutes
          </Text>
        </View>

        {/* Full Name */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.foreground }]}
            placeholder="e.g John Doe"
            placeholderTextColor={colors.mutedForeground}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
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
          />
        </View>

        {/* Phone */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Phone number</Text>
          <View style={[styles.phoneRow, { backgroundColor: colors.input }]}>
            <Pressable style={styles.dialBtn} onPress={() => setShowDialModal(true)}>
              <Text style={styles.flag}>{COUNTRIES.find((c) => c.dial === dialCode)?.flag ?? '🏳️'}</Text>
            </Pressable>
            <TextInput
              style={[styles.phoneInput, { color: colors.foreground }]}
              placeholder={`e.g 000 1234 8292 29`}
              placeholderTextColor={colors.mutedForeground}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Country */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Country</Text>
          <Pressable
            style={[styles.countryBtn, { backgroundColor: colors.input }]}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={[styles.countryText, { color: country ? colors.foreground : colors.mutedForeground }]}>
              {country || 'Select Country'}
            </Text>
            <Feather name="chevron-down" size={18} color={colors.mutedForeground} />
          </Pressable>
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
            />
            <Pressable style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.foreground, opacity: loading ? 0.7 : 1 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Create account</Text>
          )}
        </Pressable>

        <View style={styles.signinRow}>
          <Text style={[styles.signinText, { color: colors.mutedForeground }]}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={[styles.signinLink, { color: colors.foreground }]}>Sign in</Text>
          </Pressable>
        </View>
      </View>

      {/* Country picker modal */}
      <Modal visible={showCountryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Select Country</Text>
            <ScrollView>
              {COUNTRIES.map((c) => (
                <Pressable
                  key={c.code}
                  style={styles.modalRow}
                  onPress={() => { setCountry(c.name); setShowCountryModal(false); }}
                >
                  <Text style={styles.flag}>{c.flag}</Text>
                  <Text style={[styles.modalRowText, { color: colors.foreground }]}>{c.name}</Text>
                  {country === c.name && <Feather name="check" size={18} color={colors.foreground} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Dial code modal */}
      <Modal visible={showDialModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Select Country Code</Text>
            <ScrollView>
              {COUNTRIES.map((c) => (
                <Pressable
                  key={c.code}
                  style={styles.modalRow}
                  onPress={() => { setDialCode(c.dial); setShowDialModal(false); }}
                >
                  <Text style={styles.flag}>{c.flag}</Text>
                  <Text style={[styles.modalRowText, { color: colors.foreground }]}>{c.name} ({c.dial})</Text>
                  {dialCode === c.dial && <Feather name="check" size={18} color={colors.foreground} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    gap: 18,
    paddingBottom: 20,
  },
  headingBlock: { gap: 4 },
  heading: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1.1 },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', letterSpacing: -0.2, marginTop: 4 },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium', letterSpacing: -0.2 },
  input: { paddingHorizontal: 16, paddingVertical: 15, borderRadius: 12, fontSize: 15, fontFamily: 'Inter_400Regular' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, overflow: 'hidden' },
  dialBtn: { paddingHorizontal: 14, paddingVertical: 15, borderRightWidth: 1, borderRightColor: '#E5E5E5' },
  flag: { fontSize: 20 },
  phoneInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 15, fontSize: 15, fontFamily: 'Inter_400Regular' },
  countryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15, borderRadius: 12 },
  countryText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  eyeBtn: { position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' },
  bottomSection: { paddingHorizontal: 24, gap: 14, paddingTop: 12 },
  primaryBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  signinRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signinText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  signinLink: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40, maxHeight: '70%' },
  modalTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 16 },
  modalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalRowText: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
});
