import { Palette } from "@/constants/colors";
import { ReactNode, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CARD_MAX_WIDTH = 420;

// Shared layout for the account screens (create account, login, unlock):
// a centered card with the app badge, a title and a subtitle.
export function AuthScreen({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.column}>
            <View style={styles.brand}>
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>🥄</Text>
              </View>
              <Text style={styles.brandName}>spoonventory</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
              <View style={styles.cardBody}>{children}</View>
            </View>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthField({
  label,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: TextInputProps & { label?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={Palette.textMuted}
        {...inputProps}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, styles.noOutline, focused && styles.inputFocused, style]}
      />
    </View>
  );
}

export function AuthButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[styles.button, disabled && styles.buttonDisabled]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function AuthError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View style={styles.error}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function AuthLink({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8}>
      <Text style={styles.link}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  column: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
  },
  brand: {
    alignItems: "center",
    marginBottom: 28,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Palette.accentMuted,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 94, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  badgeEmoji: {
    fontSize: 34,
  },
  brandName: {
    color: Palette.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: Palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 24,
  },
  title: {
    color: Palette.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
  },
  cardBody: {
    marginTop: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: Palette.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: Palette.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: Palette.textPrimary,
    fontSize: 16,
    width: "100%",
  },
  inputFocused: {
    borderColor: Palette.accent,
  },
  // Hide the browser's default focus ring; the accent border shows focus instead.
  noOutline: Platform.select({ web: { outlineStyle: "none" } as object, default: {} }),
  button: {
    backgroundColor: Palette.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    backgroundColor: Palette.accentMuted,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorText: {
    color: Palette.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  link: {
    color: Palette.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
