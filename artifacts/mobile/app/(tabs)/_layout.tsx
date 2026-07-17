import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAVY = '#0B0132';
const GRAY = '#9CA3AF';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: NAVY,
        tabBarInactiveTintColor: GRAY,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : '#FFFFFF',
          // Design shows a thin hairline border, no shadow
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: '#E5E5E5',
          elevation: 0,
          shadowOpacity: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter_500Medium',
          marginTop: 2,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={80}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]} />
          ),
      }}
    >
      {/* Home — Feather outline house, matches design exactly */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />

      {/* Taxi — car side profile, matches design */}
      <Tabs.Screen
        name="taxi"
        options={{
          title: 'Taxi',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="car-side" size={22} color={color} />
          ),
        }}
      />

      {/* Delivery — open-top package box, matches design */}
      <Tabs.Screen
        name="delivery"
        options={{
          title: 'Delivery',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="package-variant" size={22} color={color} />
          ),
        }}
      />

      {/* Account — Feather outline person, matches design exactly */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
