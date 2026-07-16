import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const handleCreateAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/register');
  };

  const handleSignIn = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('@/assets/images/onboarding.png')}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={[styles.heading, { color: colors.foreground }]}>
          Find More Rides.{'\n'}
          <Text style={[styles.headingMuted, { color: colors.mutedForeground }]}>
            Get More Deliveries.{'\n'}
          </Text>
          <Text style={[styles.headingMuted, { color: colors.mutedForeground }]}>
            Earn More.
          </Text>
        </Text>

        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          RideSpot helps drivers and dispatch riders find high-demand areas to get more rides,
          deliveries, and more time earning.
        </Text>

        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.foreground }]}
          onPress={handleCreateAccount}
        >
          <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
            Create account
          </Text>
        </Pressable>

        <View style={styles.signinRow}>
          <Text style={[styles.signinText, { color: colors.mutedForeground }]}>
            Already have an account?{' '}
          </Text>
          <Pressable onPress={handleSignIn}>
            <Text style={[styles.signinLink, { color: colors.foreground }]}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  illustrationContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 14,
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    lineHeight: 34,
    letterSpacing: -1.1,
  },
  headingMuted: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    lineHeight: 34,
    letterSpacing: -1.1,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  primaryBtn: {
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: -0.3,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  signinLink: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
