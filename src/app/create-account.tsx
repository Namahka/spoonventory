import {
  AuthButton,
  AuthError,
  AuthField,
  AuthScreen,
} from "@/components/auth-screen";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";

export default function CreateAccountScreen() {
  const { t } = useLanguage();
  const { createAccount } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t("createAccount.nameError"));
      return;
    }
    if (!password) {
      setError(t("createAccount.passwordError"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("createAccount.passwordMismatch"));
      return;
    }
    setError("");
    setIsSubmitting(true);
    await createAccount(name, password);
    setIsSubmitting(false);
  };

  return (
    <AuthScreen
      title={t("createAccount.title")}
      subtitle={t("createAccount.welcome")}
    >
      <AuthField
        label={t("common.name")}
        placeholder={t("createAccount.namePlaceholder")}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoFocus
      />
      <AuthField
        label={t("common.password")}
        placeholder={t("common.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AuthField
        label={t("createAccount.confirmPassword")}
        placeholder={t("createAccount.confirmPassword")}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        onSubmitEditing={handleSubmit}
      />

      <AuthError message={error} />

      <AuthButton
        label={
          isSubmitting
            ? t("createAccount.submitting")
            : t("createAccount.submit")
        }
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </AuthScreen>
  );
}
