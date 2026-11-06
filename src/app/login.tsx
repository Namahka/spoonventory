import {
  AuthButton,
  AuthError,
  AuthField,
  AuthLink,
  AuthScreen,
} from "@/components/auth-screen";
import { STORAGE_KEYS } from "@/constants/storage";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, DevSettings } from "react-native";

export default function LoginScreen() {
  const { t } = useLanguage();
  const { account, login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    const success = await login(password);
    setIsSubmitting(false);
    if (!success) {
      setError(t("login.wrongPassword"));
      setPassword("");
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(t("settings.clearAllData"), t("login.resetConfirmBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.clear"),
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
          DevSettings.reload();
        },
      },
    ]);
  };

  return (
    <AuthScreen
      title={t("login.title")}
      subtitle={t("login.welcomeBack", { name: account?.name ?? "" })}
      footer={
        <AuthLink
          label={t("login.forgotPassword")}
          onPress={handleForgotPassword}
        />
      }
    >
      <AuthField
        label={t("common.password")}
        placeholder={t("common.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoFocus
        onSubmitEditing={handleSubmit}
      />

      <AuthError message={error} />

      <AuthButton
        label={isSubmitting ? t("login.submitting") : t("login.submit")}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </AuthScreen>
  );
}
