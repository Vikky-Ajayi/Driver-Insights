import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const handleCreateAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/register');
  };

  const handleSignIn = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Illustration — ~55% of screen */}
      <View style={[styles.illustrationContainer, { height: SCREEN_HEIGHT * 0.55 }]}>
        <Image
          source={require('@/assets/images/onboarding.png')}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        {/* Heading: alternating black / gray per Figma */}
        <Text style={styles.heading}>
          <Text style={[styles.headingBlack, { color: colors.foreground }]}>Find More </Text>
          <Text style={[styles.headingGray, { color: colors.mutedForeground }]}>Rides.{'\n'}</Text>
          <Text style={[styles.headingBlack, { color: colors.foreground }]}>Get More </Text>
          <Text style={[styles.headingGray, { color: colors.mutedForeground }]}>Deliveries.{'\n'}</Text>
          <Text style={[styles.headingGray, { color: colors.mutedForeground }]}>Earn More.</Text>
        </Text>

        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          RideSpot helps drivers and dispatch riders find{'\n'}
          high-demand areas to get more rides,{'\n'}
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
    width: '100%',
    overflow: 'hidden',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 12,
  },
  heading: {
    fontSize: 30,
    fontFamily: 'Inter_700Bold',
    lineHeight: 38,
    letterSpacing: -1.2,
  },
  headingBlack: {
    fontSize: 30,
    fontFamily: 'Inter_700Bold',
    lineHeight: 38,
  },
  headingGray: {
    fontSize: 30,
    fontFamily: 'Inter_700Bold',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  primaryBtn: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
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
