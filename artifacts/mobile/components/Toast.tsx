import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

interface ToastConfig {
  type: ToastType;
  title: string;
  message?: string;
  id: number;
}

interface ToastContextValue {
  show: (title: string, message?: string, type?: ToastType) => void;
  error: (title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANTS: Record<ToastType, { iconName: keyof typeof Feather.glyphMap; iconColor: string }> = {
  error:   { iconName: 'alert-circle', iconColor: '#FF4D4F' },
  success: { iconName: 'check-circle', iconColor: '#22C55E' },
  info:    { iconName: 'info',          iconColor: '#60A5FA' },
  warning: { iconName: 'alert-triangle', iconColor: '#F59E0B' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const translateY = useRef(new Animated.Value(160)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 160, duration: 280, useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0, duration: 220, useNativeDriver: true,
      }),
    ]).start(() => setToast(null));
  }, [translateY, opacity]);

  const show = useCallback(
    (title: string, message?: string, type: ToastType = 'info') => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const id = Date.now();
      setToast({ type, title, message, id });

      // Reset values before animating in
      translateY.setValue(160);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0, useNativeDriver: true, tension: 60, friction: 9,
        }),
        Animated.timing(opacity, {
          toValue: 1, duration: 180, useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(dismiss, 4000);
    },
    [translateY, opacity, dismiss],
  );

  const value: ToastContextValue = {
    show,
    error:   (t, m) => show(t, m, 'error'),
    success: (t, m) => show(t, m, 'success'),
    info:    (t, m) => show(t, m, 'info'),
  };

  const variant = toast ? VARIANTS[toast.type] : null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && variant && (
        <Animated.View
          style={[
            styles.toastWrapper,
            { bottom: Math.max(insets.bottom, 16) + 16 },
            { opacity, transform: [{ translateY }] },
          ]}
          pointerEvents="box-none"
        >
          <Pressable style={styles.toast} onPress={dismiss}>
            {/* Icon bubble */}
            <View style={[styles.iconBubble, { backgroundColor: `${variant.iconColor}22` }]}>
              <Feather name={variant.iconName} size={19} color={variant.iconColor} />
            </View>

            {/* Text */}
            <View style={styles.textBlock}>
              <Text style={styles.toastTitle} numberOfLines={1}>
                {toast.title}
              </Text>
              {toast.message ? (
                <Text style={styles.toastMessage} numberOfLines={2}>
                  {toast.message}
                </Text>
              ) : null}
            </View>

            {/* Dismiss */}
            <Pressable hitSlop={12} onPress={dismiss}>
              <Feather name="x" size={15} color="rgba(255,255,255,0.45)" />
            </Pressable>
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    // Android elevation
    elevation: 16,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 11,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: { flex: 1, gap: 2 },
  toastTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  toastMessage: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.60)',
    lineHeight: 17,
  },
});
