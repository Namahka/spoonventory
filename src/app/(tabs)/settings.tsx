import { Palette } from "@/constants/colors";
import { useResponsive } from "@/constants/responsive";
import { STORAGE_KEYS } from "@/constants/storage";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { exportBackup, importBackup } from "@/lib/backup";
import { LANGUAGE_NAMES, Language } from "@/lib/i18n/translations";
import {
  cancelDailyReminder,
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/lib/notifications";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ReactNode, useState } from "react";
import {
  Alert,
  DevSettings,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type IconName = keyof typeof MaterialIcons.glyphMap;

interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

const onlyDigits = (text: string) => text.replace(/\D/g, "").slice(0, 4);

interface FieldConfig {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "number-pad";
  maxLength?: number;
}

function FieldModal({
  visible,
  title,
  fields,
  error,
  onCancel,
  onSave,
}: {
  visible: boolean;
  title: string;
  fields: FieldConfig[];
  error: string;
  onCancel: () => void;
  onSave: () => void;
}) {
  const { t } = useLanguage();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          {fields.map((field, index) => (
            <TextInput
              key={index}
              style={styles.textInput}
              placeholder={field.placeholder}
              value={field.value}
              onChangeText={field.onChangeText}
              placeholderTextColor={Palette.textMuted}
              secureTextEntry={field.secureTextEntry}
              keyboardType={field.keyboardType ?? "default"}
              maxLength={field.maxLength}
              autoFocus={index === 0}
            />
          ))}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.confirmBtn}>
              <Text style={styles.confirmBtnText}>{t("common.save")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  destructive,
  rightElement,
  last,
  fontSize,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  rightElement?: ReactNode;
  last?: boolean;
  fontSize: number;
}) {
  const labelColor = destructive ? Palette.accent : Palette.textPrimary;

  const content = (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <View
        style={[
          styles.rowIconWrap,
          destructive && styles.rowIconWrapDestructive,
        ]}
      >
        <MaterialIcons
          name={icon}
          size={18}
          color={destructive ? Palette.accent : Palette.textSecondary}
        />
      </View>
      <Text
        style={[styles.rowLabel, { color: labelColor, fontSize }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <View style={styles.rowRight}>
        {rightElement ?? (
          <>
            {value ? (
              <Text
                style={[styles.rowValue, { fontSize: fontSize - 2 }]}
                numberOfLines={1}
              >
                {value}
              </Text>
            ) : null}
            {onPress ? (
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={Palette.textMuted}
              />
            ) : null}
          </>
        )}
      </View>
    </View>
  );

  if (!onPress) return content;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      {content}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { spacing, typography } = useResponsive();
  const { t, language, setLanguage } = useLanguage();
  const {
    account,
    appLock,
    logout,
    setAppLock,
    updateName,
    changePassword,
    changePin,
  } = useAuth();

  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showSetPinModal, setShowSetPinModal] = useState(false);
  const [setPin, setSetPin] = useState("");
  const [setConfirmPin, setSetConfirmPin] = useState("");
  const [setPinError, setSetPinError] = useState("");

  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [changePinError, setChangePinError] = useState("");

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [reminder, setReminder] = usePersistedState<ReminderSettings>(
    STORAGE_KEYS.reminder,
    { enabled: false, hour: 20, minute: 0 },
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const resetAllData = () => {
    Alert.alert(
      t("settings.clearAllData"),
      t("settings.resetConfirmBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.clear"),
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
            DevSettings.reload();
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t("settings.logoutConfirmTitle"),
      t("settings.logoutConfirmBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("common.logout"), style: "destructive", onPress: () => logout() },
      ],
    );
  };

  const openNameModal = () => {
    setNameInput(account?.name ?? "");
    setNameError("");
    setShowNameModal(true);
  };

  const saveName = async () => {
    if (!nameInput.trim()) {
      setNameError(t("settings.nameError"));
      return;
    }
    await updateName(nameInput);
    setShowNameModal(false);
  };

  const openPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
    setShowPasswordModal(true);
  };

  const savePassword = async () => {
    if (!currentPassword || !newPassword) {
      setPasswordError(t("settings.passwordFieldsError"));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError(t("settings.passwordMismatch"));
      return;
    }
    const success = await changePassword(currentPassword, newPassword);
    if (!success) {
      setPasswordError(t("settings.wrongCurrentPassword"));
      return;
    }
    setShowPasswordModal(false);
  };

  const handleToggleAppLock = (value: boolean) => {
    if (value) {
      setSetPin("");
      setSetConfirmPin("");
      setSetPinError("");
      setShowSetPinModal(true);
    } else {
      setAppLock(false);
    }
  };

  const saveSetPin = async () => {
    if (setPin.length !== 4) {
      setSetPinError(t("settings.codeLengthError"));
      return;
    }
    if (setPin !== setConfirmPin) {
      setSetPinError(t("settings.codeMismatch"));
      return;
    }
    await setAppLock(true, setPin);
    setShowSetPinModal(false);
  };

  const openChangePinModal = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmNewPin("");
    setChangePinError("");
    setShowChangePinModal(true);
  };

  const saveChangePin = async () => {
    if (newPin.length !== 4) {
      setChangePinError(t("settings.codeLengthError"));
      return;
    }
    if (newPin !== confirmNewPin) {
      setChangePinError(t("settings.codeMismatch"));
      return;
    }
    const success = await changePin(currentPin, newPin);
    if (!success) {
      setChangePinError(t("settings.wrongCurrentCode"));
      return;
    }
    setShowChangePinModal(false);
  };

  const handleToggleReminder = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          t("settings.notificationsOffTitle"),
          t("settings.notificationsOffBody"),
        );
        return;
      }
      await scheduleDailyReminder(reminder.hour, reminder.minute);
      setReminder({ ...reminder, enabled: true });
    } else {
      await cancelDailyReminder();
      setReminder({ ...reminder, enabled: false });
    }
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (event.type !== "set" || !selectedDate) return;

    const hour = selectedDate.getHours();
    const minute = selectedDate.getMinutes();
    setReminder({ ...reminder, hour, minute });
    if (reminder.enabled) scheduleDailyReminder(hour, minute);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportBackup();
    } catch {
      Alert.alert(t("settings.exportErrorTitle"), t("settings.exportErrorBody"));
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    Alert.alert(
      t("settings.importConfirmTitle"),
      t("settings.importConfirmBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.importConfirmAction"),
          style: "destructive",
          onPress: async () => {
            setIsImporting(true);
            try {
              const result = await importBackup();
              if (result === "success") {
                DevSettings.reload();
              }
            } catch {
              Alert.alert(
                t("settings.importErrorTitle"),
                t("settings.importErrorBody"),
              );
            } finally {
              setIsImporting(false);
            }
          },
        },
      ],
    );
  };

  const bodySize = typography.body;

  return (
    <SafeAreaView style={styles.safeArea} collapsable={false}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.lg + spacing.md,
          },
        ]}
      >
        <Text style={[styles.title, { fontSize: typography.title }]}>
          {t("settings.title")}
        </Text>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
          {t("settings.account")}
        </Text>
        <View style={[styles.card, { marginTop: spacing.sm }]}>
          <SettingsRow
            icon="person"
            label={t("settings.username")}
            value={account?.name}
            onPress={openNameModal}
            fontSize={bodySize}
          />
          <SettingsRow
            icon="password"
            label={t("settings.changePassword")}
            onPress={openPasswordModal}
            last
            fontSize={bodySize}
          />
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
          {t("settings.security")}
        </Text>
        <View style={[styles.card, { marginTop: spacing.sm }]}>
          <SettingsRow
            icon="lock"
            label={t("settings.requireCodeOnOpen")}
            fontSize={bodySize}
            last={!appLock.enabled}
            rightElement={
              <View style={styles.switchGroup}>
                <Text style={[styles.rowValue, { fontSize: bodySize - 2 }]}>
                  {appLock.enabled ? t("settings.on") : t("settings.off")}
                </Text>
                <Switch
                  value={appLock.enabled}
                  onValueChange={handleToggleAppLock}
                  trackColor={{
                    false: Palette.surfaceAlt,
                    true: Palette.accentMuted,
                  }}
                  thumbColor={
                    appLock.enabled ? Palette.accent : Palette.textMuted
                  }
                />
              </View>
            }
          />
          {appLock.enabled && (
            <SettingsRow
              icon="vpn-key"
              label={t("settings.changeCode")}
              onPress={openChangePinModal}
              last
              fontSize={bodySize}
            />
          )}
        </View>

        {Platform.OS !== "web" && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
              {t("settings.reminders")}
            </Text>
            <View style={[styles.card, { marginTop: spacing.sm }]}>
              <SettingsRow
                icon="notifications"
                label={t("settings.dailyReminder")}
                fontSize={bodySize}
                last={!reminder.enabled}
                rightElement={
                  <View style={styles.switchGroup}>
                    <Text
                      style={[styles.rowValue, { fontSize: bodySize - 2 }]}
                    >
                      {reminder.enabled ? t("settings.on") : t("settings.off")}
                    </Text>
                    <Switch
                      value={reminder.enabled}
                      onValueChange={handleToggleReminder}
                      trackColor={{
                        false: Palette.surfaceAlt,
                        true: Palette.accentMuted,
                      }}
                      thumbColor={
                        reminder.enabled ? Palette.accent : Palette.textMuted
                      }
                    />
                  </View>
                }
              />
              {reminder.enabled && (
                <SettingsRow
                  icon="access-time"
                  label={t("settings.time")}
                  value={`${String(reminder.hour).padStart(2, "0")}:${String(
                    reminder.minute,
                  ).padStart(2, "0")}`}
                  onPress={() => setShowTimePicker(true)}
                  last
                  fontSize={bodySize}
                />
              )}
            </View>
            {showTimePicker && (
              <View style={[styles.card, { marginTop: spacing.sm }]}>
                <DateTimePicker
                  value={new Date(2000, 0, 1, reminder.hour, reminder.minute)}
                  mode="time"
                  is24Hour
                  onChange={handleTimeChange}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(false)}
                    style={styles.iosDoneButton}
                  >
                    <Text
                      style={[styles.iosDoneButtonText, { fontSize: bodySize }]}
                    >
                      {t("settings.done")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
          {t("settings.language")}
        </Text>
        <View style={[styles.card, { marginTop: spacing.sm }]}>
          <SettingsRow
            icon="language"
            label={t("settings.language")}
            value={LANGUAGE_NAMES[language]}
            onPress={() => setShowLanguageModal(true)}
            last
            fontSize={bodySize}
          />
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
          {t("settings.backup")}
        </Text>
        <View style={[styles.card, { marginTop: spacing.sm }]}>
          <SettingsRow
            icon="cloud-upload"
            label={t("settings.exportData")}
            value={isExporting ? t("settings.exporting") : undefined}
            onPress={isExporting ? undefined : handleExport}
            fontSize={bodySize}
          />
          <SettingsRow
            icon="cloud-download"
            label={t("settings.importData")}
            value={isImporting ? t("settings.importing") : undefined}
            onPress={isImporting ? undefined : handleImport}
            last
            fontSize={bodySize}
          />
        </View>
        <Text style={[styles.sectionFooter, { marginTop: spacing.sm }]}>
          {t("settings.backupFooter")}
        </Text>

        <View style={[styles.card, { marginTop: spacing.xl }]}>
          <SettingsRow
            icon="logout"
            label={t("common.logout")}
            onPress={handleLogout}
            last
            fontSize={bodySize}
          />
        </View>

        <View
          style={[styles.card, styles.destructiveCard, { marginTop: spacing.md }]}
        >
          <SettingsRow
            icon="delete-forever"
            label={t("settings.clearAllData")}
            onPress={resetAllData}
            destructive
            last
            fontSize={bodySize}
          />
        </View>
      </ScrollView>

      <FieldModal
        visible={showNameModal}
        title={t("settings.changeUsernameTitle")}
        fields={[
          {
            value: nameInput,
            onChangeText: setNameInput,
            placeholder: t("common.name"),
          },
        ]}
        error={nameError}
        onCancel={() => setShowNameModal(false)}
        onSave={saveName}
      />

      <FieldModal
        visible={showPasswordModal}
        title={t("settings.changePassword")}
        fields={[
          {
            value: currentPassword,
            onChangeText: setCurrentPassword,
            placeholder: t("settings.currentPassword"),
            secureTextEntry: true,
          },
          {
            value: newPassword,
            onChangeText: setNewPassword,
            placeholder: t("settings.newPassword"),
            secureTextEntry: true,
          },
          {
            value: confirmNewPassword,
            onChangeText: setConfirmNewPassword,
            placeholder: t("settings.confirmNewPassword"),
            secureTextEntry: true,
          },
        ]}
        error={passwordError}
        onCancel={() => setShowPasswordModal(false)}
        onSave={savePassword}
      />

      <FieldModal
        visible={showSetPinModal}
        title={t("settings.setPinTitle")}
        fields={[
          {
            value: setPin,
            onChangeText: (text) => setSetPin(onlyDigits(text)),
            placeholder: t("settings.code"),
            secureTextEntry: true,
            keyboardType: "number-pad",
            maxLength: 4,
          },
          {
            value: setConfirmPin,
            onChangeText: (text) => setSetConfirmPin(onlyDigits(text)),
            placeholder: t("settings.confirmCode"),
            secureTextEntry: true,
            keyboardType: "number-pad",
            maxLength: 4,
          },
        ]}
        error={setPinError}
        onCancel={() => setShowSetPinModal(false)}
        onSave={saveSetPin}
      />

      <FieldModal
        visible={showChangePinModal}
        title={t("settings.changeCode")}
        fields={[
          {
            value: currentPin,
            onChangeText: (text) => setCurrentPin(onlyDigits(text)),
            placeholder: t("settings.currentCode"),
            secureTextEntry: true,
            keyboardType: "number-pad",
            maxLength: 4,
          },
          {
            value: newPin,
            onChangeText: (text) => setNewPin(onlyDigits(text)),
            placeholder: t("settings.newCode"),
            secureTextEntry: true,
            keyboardType: "number-pad",
            maxLength: 4,
          },
          {
            value: confirmNewPin,
            onChangeText: (text) => setConfirmNewPin(onlyDigits(text)),
            placeholder: t("settings.confirmNewCode"),
            secureTextEntry: true,
            keyboardType: "number-pad",
            maxLength: 4,
          },
        ]}
        error={changePinError}
        onCancel={() => setShowChangePinModal(false)}
        onSave={saveChangePin}
      />

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("settings.chooseLanguage")}</Text>

            {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang, index) => (
              <TouchableOpacity
                key={lang}
                onPress={() => {
                  setLanguage(lang);
                  setShowLanguageModal(false);
                }}
                style={[
                  styles.languageOption,
                  index === Object.keys(LANGUAGE_NAMES).length - 1 &&
                    styles.languageOptionLast,
                ]}
              >
                <Text style={styles.languageOptionText}>
                  {LANGUAGE_NAMES[lang]}
                </Text>
                {language === lang && (
                  <MaterialIcons name="check" size={20} color={Palette.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontWeight: "700",
    color: Palette.textPrimary,
  },
  sectionLabel: {
    fontWeight: "600",
    color: Palette.textMuted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  sectionFooter: {
    color: Palette.textMuted,
    fontSize: 12,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: "hidden",
  },
  destructiveCard: {
    borderColor: Palette.accentMuted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  rowIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Palette.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  rowIconWrapDestructive: {
    backgroundColor: Palette.accentMuted,
  },
  rowLabel: {
    flex: 1,
    fontWeight: "500",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
    maxWidth: "45%",
  },
  rowValue: {
    color: Palette.textMuted,
    flexShrink: 1,
  },
  switchGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iosDoneButton: {
    backgroundColor: Palette.surfaceAlt,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    margin: 8,
  },
  iosDoneButtonText: {
    color: Palette.textSecondary,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Palette.textPrimary,
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  languageOptionLast: {
    borderBottomWidth: 0,
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: Palette.textPrimary,
  },
  textInput: {
    backgroundColor: Palette.surfaceAlt,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: Palette.textPrimary,
    borderWidth: 1,
    borderColor: Palette.border,
    fontSize: 16,
  },
  errorText: {
    color: Palette.accent,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Palette.surfaceAlt,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    color: Palette.textSecondary,
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: Palette.accent,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  confirmBtnText: {
    color: Palette.white,
    fontWeight: "600",
  },
});
