// Web stub — react-native-maps doesn't support web.
// Renders a placeholder grey box so the web preview doesn't crash.
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { forwardRef } from 'react';

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapViewProps {
  style?: ViewStyle | ViewStyle[];
  initialRegion?: Region;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<unknown>;
  onRegionChange?: (region: Region) => void;
  onRegionChangeComplete?: (region: Region) => void;
  animateToRegion?: (region: Region, duration?: number) => void;
}

const MapView = forwardRef<unknown, MapViewProps>(({ style, children }, _ref) => (
  <View style={[styles.container, style as ViewStyle]}>
    <Text style={styles.label}>Map view — open in Expo Go on your device</Text>
    {/* Render children so that Marker etc. don't cause null ref errors */}
  </View>
));
MapView.displayName = 'MapView';

export { MapView };
export default MapView;

// No-op child components
export const Circle = () => null;
export const Marker = ({ children }: { children?: React.ReactNode; [k: string]: unknown }) =>
  children ? <>{children}</> : null;
export const Polyline = () => null;
export const Callout = ({ children }: { children?: React.ReactNode; [k: string]: unknown }) =>
  children ? <>{children}</> : null;
export const PROVIDER_GOOGLE = 'google' as const;
export const PROVIDER_DEFAULT = null;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    padding: 12,
  },
});
