import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';

function SettingRow({
  label,
  onPress,
  right,
  colors,
}: {
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <Text style={[styles.settingLabel, { color: colors.foreground }]}>{label}</Text>
      {right ?? <Feather name="chevron-right" size={18} color={colors.mutedForeground} />}
    </Pressable>
  );
}

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user, logout } = useAuth();

  const [inAppNotif, setInAppNotif] = useState(true);
  const [mailNotif, setMailNotif] = useState(true);
  const [opportunityNotif, setOpportunityNotif] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace('/(auth)/onboarding');
  };

  const sectionLabelStyle = [styles.sectionLabel, { color: colors.mutedForeground }];
  const cardStyle = [styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Account</Text>

        {/* Profile row */}
        <Pressable
          style={[styles.profileRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/edit-profile')}
        >
          <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
            <Feather name="user" size={28} color={colors.mutedForeground} />
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>
              {user?.name ?? 'Driver'}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>
              {user?.email ?? 'driver@email.com'}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>

        {/* Settings */}
        <Text style={sectionLabelStyle}>SETTINGS</Text>
        <View style={cardStyle}>
          <Pressable
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/subscription')}
          >
            <View style={styles.settingRowLeft}>
              <Feather name="credit-card" size={17} color={colors.foreground} />
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>Subscription</Text>
              <Text style={[styles.planBadge, { color: colors.mutedForeground }]}>· Free Plan</Text>
            </View>
            <View style={styles.settingRowRight}>
              <View style={[styles.upgradeBadge, { backgroundColor: colors.upgrade }]}>
                <Text style={styles.upgradeText}>Upgrade</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </View>
          </Pressable>

          <SettingRow
            label="Change Password"
            onPress={() => router.push('/change-password')}
            colors={colors}
            right={
              <View style={styles.lockRow}>
                <Feather name="lock" size={17} color={colors.foreground} style={{ marginRight: 8 }} />
                <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
              </View>
            }
          />
        </View>

        {/* Notifications */}
        <Text style={sectionLabelStyle}>NOTIFICATIONS</Text>
        <View style={cardStyle}>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.foreground }]}>In-App Notifications</Text>
            <Switch
              value={inAppNotif}
              onValueChange={setInAppNotif}
              trackColor={{ false: colors.border, true: '#22C55E' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.foreground }]}>Mail Notifications</Text>
            <Switch
              value={mailNotif}
              onValueChange={setMailNotif}
              trackColor={{ false: colors.border, true: '#22C55E' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.settingRow, { borderBottomColor: 'transparent' }]}>
            <Text style={[styles.settingLabel, { color: colors.foreground }]}>Opportunity Notifications</Text>
            <Switch
              value={opportunityNotif}
              onValueChange={setOpportunityNotif}
              trackColor={{ false: colors.border, true: '#22C55E' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* More */}
        <Text style={sectionLabelStyle}>MORE</Text>
        <View style={cardStyle}>
          <SettingRow label="FAQs" colors={colors} />
          <SettingRow label="Contact us" colors={colors} />
          <SettingRow label="Privacy Policy" colors={colors} />
          <View style={[styles.settingRow, { borderBottomColor: 'transparent' }]}>
            <Pressable onPress={() => setShowLogout(true)}>
              <Text style={[styles.settingLabel, { color: colors.destructive }]}>Log out</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Logout confirmation modal */}
      <Modal visible={showLogout} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowLogout(false)}>
          <View style={[styles.logoutSheet, { backgroundColor: colors.background }]}>
            <Pressable style={styles.closeBtn} onPress={() => setShowLogout(false)}>
              <Feather name="x" size={20} color={colors.foreground} />
            </Pressable>

            <View style={[styles.logoutIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Feather name="log-out" size={24} color={colors.destructive} />
            </View>

            <Text style={[styles.logoutTitle, { color: colors.foreground }]}>Logout</Text>
            <Text style={[styles.logoutSubtitle, { color: colors.mutedForeground }]}>
              Are you sure you want to logout? Once you logout, you need to login again.
            </Text>

            <Pressable
              style={[styles.logoutBtn, { backgroundColor: colors.destructive }]}
              onPress={handleLogout}
            >
              <Text style={[styles.logoutBtnText, { color: '#FFFFFF' }]}>Yes, Logout</Text>
            </Pressable>
            <Pressable
              style={[styles.cancelBtn, { backgroundColor: colors.secondary }]}
              onPress={() => setShowLogout(false)}
            >
              <Text style={[styles.cancelBtnText, { color: colors.foreground }]}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 12 },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', letterSpacing: -0.8, marginBottom: 4 },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 4,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  profileText: { flex: 1 },
  profileName: { fontSize: 16, fontFamily: 'Inter_700Bold', letterSpacing: -0.3 },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  sectionLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5, marginTop: 8 },
  settingCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  settingRowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  planBadge: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  upgradeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  upgradeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  lockRow: { flexDirection: 'row', alignItems: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  logoutSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 12,
  },
  closeBtn: { alignSelf: 'flex-end', padding: 4 },
  logoutIconBox: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  logoutTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', letterSpacing: -0.7 },
  logoutSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
  logoutBtn: { width: '100%', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  logoutBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  cancelBtn: { width: '100%', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  cancelBtnText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
});
