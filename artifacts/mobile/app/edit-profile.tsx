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
import { useAuth } from '@/contexts/AuthContext';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [country, setCountry] = useState(user?.country ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Would call driverApi.updateProfile(...)
      await new Promise((r) => setTimeout(r, 800));
      Alert.alert('Saved', 'Profile updated successfully.');
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
            <Feather name="user" size={40} color={colors.mutedForeground} />
          </View>
          <Pressable style={[styles.changePhotoBtn, { borderColor: colors.border }]}>
            <Text style={[styles.changePhotoText, { color: colors.foreground }]}>Change Profile picture</Text>
          </Pressable>
        </View>

        {/* Fields */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.foreground }]}
            placeholder="e.g John Doe"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

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

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Phone number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.foreground }]}
            placeholder="e.g 000 1234 8292 29"
            placeholderTextColor={colors.mutedForeground}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Country</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.foreground }]}
            placeholder="Select Country"
            placeholderTextColor={colors.mutedForeground}
            value={country}
            onChangeText={setCountry}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.foreground, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Save Changes</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', letterSpacing: -0.4 },
  content: { paddingHorizontal: 24, paddingTop: 8, gap: 18, paddingBottom: 20 },
  avatarSection: { alignItems: 'center', gap: 12, marginBottom: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  changePhotoBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100, borderWidth: 1 },
  changePhotoText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  input: { paddingHorizontal: 16, paddingVertical: 15, borderRadius: 12, fontSize: 15, fontFamily: 'Inter_400Regular' },
  bottomSection: { paddingHorizontal: 24, paddingTop: 12 },
  primaryBtn: { paddingVertical: 17, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
});
