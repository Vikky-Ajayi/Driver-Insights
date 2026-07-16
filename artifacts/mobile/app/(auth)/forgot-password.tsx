import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { authApi } from '@/services/api';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      router.push({ pathname: '/(auth)/enter-otp', params: { email: email.trim() } });
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
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
        <Text style={[styles.heading, { color: colors.foreground }]}>Forgot Password?</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Enter email address, you will receive a code to reset your password
        </Text>

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
      </View>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.foreground, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Send Code</Text>
          )}
        </Pressable>

        <View style={styles.row}>
          <Text style={[styles.rowText, { color: colors.mutedForeground }]}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={[styles.rowLink, { color: colors.foreground }]}>Sign in</Text>
          </Pressable>
        </View>
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
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  input: { paddingHorizontal: 16, paddingVertical: 15, borderRadius: 12, fontSize: 15, fontFamily: 'Inter_400Regular' },
  bottomSection: { paddingHorizontal: 24, gap: 14, paddingTop: 12 },
  primaryBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  rowText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  rowLink: { fontSize: 14, fontFamily: 'Inter_700Bold' },
});
