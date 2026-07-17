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
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useColors } from '@/hooks/useColors';
import { authApi } from '@/services/api';
import { useToast } from '@/components/Toast';

export default function SetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const toast = useToast();
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Missing fields', 'Please fill in both password fields.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password too short', 'Password must be at least 8 characters.');
      return;
    }
    if (!/\d/.test(newPassword)) {
      toast.error('Weak password', 'Password must include at least one number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', 'Please make sure both passwords are the same.');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(email ?? '', otp ?? '', newPassword);
      toast.success('Password changed', 'Your password has been updated.');
      setTimeout(() => router.replace('/(auth)/login'), 1200);
    } catch (err: unknown) {
      toast.error('Reset failed', err instanceof Error ? err.message : 'Invalid or expired code.');
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

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={32}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingBlock}>
          <Text style={[styles.heading, { color: colors.foreground }]}>Set new password</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Create a strong password with at least 8 characters and one number.
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>New Password</Text>
          <View>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, color: colors.foreground, paddingRight: 50 }]}
              placeholder="Min. 8 chars + one number"
              placeholderTextColor={colors.mutedForeground}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
            />
            <Pressable style={styles.eyeBtn} onPress={() => setShowNew((v) => !v)}>
              <Feather name={showNew ? 'eye' : 'eye-off'} size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Confirm New Password</Text>
          <View>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, color: colors.foreground, paddingRight: 50 }]}
              placeholder="Repeat your password"
              placeholderTextColor={colors.mutedForeground}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
            />
            <Pressable style={styles.eyeBtn} onPress={() => setShowConfirm((v) => !v)}>
              <Feather name={showConfirm ? 'eye' : 'eye-off'} size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>

        <View style={{ flex: 1, minHeight: 40 }} />

        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.foreground, opacity: loading ? 0.7 : 1 }]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.primaryForeground} />
            : <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Reset Password</Text>
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
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  eyeBtn: { position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' },
  primaryBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
});
