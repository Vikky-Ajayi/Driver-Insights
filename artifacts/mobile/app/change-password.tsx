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
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useColors } from '@/hooks/useColors';

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!current || !next || !confirm) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (next !== confirm) {
      Alert.alert('Mismatch', 'New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      Alert.alert('Password Changed', 'Your password has been updated.');
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <Feather name="headphones" size={22} color={colors.foreground} />
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        <Text style={[styles.heading, { color: colors.foreground }]}>Change Password</Text>

        {[
          { label: 'Current Password', value: current, set: setCurrent, show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
          { label: 'New Password', value: next, set: setNext, show: showNext, toggle: () => setShowNext((v) => !v) },
          { label: 'Confirm New Password', value: confirm, set: setConfirm, show: showConfirm, toggle: () => setShowConfirm((v) => !v) },
        ].map(({ label, value, set, show, toggle }) => (
          <View style={styles.fieldGroup} key={label}>
            <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
            <View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.input, color: colors.foreground, paddingRight: 50 }]}
                placeholder="--- --- --- --"
                placeholderTextColor={colors.mutedForeground}
                value={value}
                onChangeText={set}
                secureTextEntry={!show}
              />
              <Pressable style={styles.eyeBtn} onPress={toggle}>
                <Feather name={show ? 'eye' : 'eye-off'} size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>
        ))}
      </KeyboardAwareScrollView>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.foreground, opacity: loading ? 0.7 : 1 }]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Reset Password</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 24, paddingTop: 12, gap: 18, paddingBottom: 20 },
  heading: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1.1, marginBottom: 4 },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  input: { paddingHorizontal: 16, paddingVertical: 15, borderRadius: 12, fontSize: 15, fontFamily: 'Inter_400Regular' },
  eyeBtn: { position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' },
  bottomSection: { paddingHorizontal: 24, paddingTop: 12 },
  primaryBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
});
