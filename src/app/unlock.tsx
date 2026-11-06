import {
  AuthError,
  AuthField,
  AuthLink,
  AuthScreen,
} from "@/components/auth-screen";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";

export default function UnlockScreen() {
  const { t } = useLanguage();
  const { unlock, logout } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (value: string) => {
    const success = await unlock(value);
    if (!success) {
      setError(t("unlock.wrongCode"));
      setPin("");
    }
  };

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    setPin(digits);
    setError("");
    if (digits.length === 4) {
      handleSubmit(digits);
    }
  };

  const handleLogout = () => {
    Alert.alert(t("settings.logoutConfirmTitle"), t("unlock.logoutConfirmBody"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.logout"), style: "destructive", onPress: () => logout() },
    ]);
  };

  return (
    <AuthScreen
      title={t("unlock.title")}
      subtitle={t("unlock.subtitle")}
      footer={<AuthLink label={t("unlock.logoutInstead")} onPress={handleLogout} />}
    >
      <AuthField
        style={styles.pinInput}
        value={pin}
        onChangeText={handleChange}
        placeholder="••••"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        autoFocus
      />
      <AuthError message={error} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  pinInput: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 12,
  },
});
