import { Palette } from "@/constants/colors";
import { useResponsive } from "@/constants/responsive";
import { STORAGE_KEYS } from "@/constants/storage";
import { useLanguage } from "@/contexts/language-context";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Reminder {
  id: string;
  text: string;
  done: boolean;
}

export default function RememberScreen() {
  const { spacing, typography } = useResponsive();
  const { t } = useLanguage();
  const [reminders, setReminders] = usePersistedState<Reminder[]>(
    STORAGE_KEYS.reminders,
    [],
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminderText, setNewReminderText] = useState("");

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const addReminder = () => {
    if (newReminderText.trim()) {
      setReminders([
        ...reminders,
        {
          id: Date.now().toString(),
          text: newReminderText.trim(),
          done: false,
        },
      ]);
      setNewReminderText("");
      setShowAddModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} collapsable={false}>
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.lg + spacing.md,
            paddingBottom: spacing.md,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { fontSize: typography.heading }]}>
          {t("remember.title")}
        </Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.list, { paddingHorizontal: spacing.md }]}
        contentContainerStyle={styles.scrollContent}
      >
        {reminders.length === 0 ? (
          <Text style={[styles.emptyText, { fontSize: typography.body }]}>
            {t("remember.empty")}
          </Text>
        ) : (
          reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderItem}>
              <TouchableOpacity
                onPress={() => toggleReminder(reminder.id)}
                style={styles.reminderContent}
              >
                <View
                  style={[
                    styles.checkbox,
                    reminder.done && styles.checkboxDone,
                  ]}
                >
                  {reminder.done && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.reminderText,
                    { fontSize: typography.body },
                    reminder.done && styles.reminderTextDone,
                  ]}
                >
                  {reminder.text}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteReminder(reminder.id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteBtnText}>⊗</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("remember.newReminder")}</Text>

            <TextInput
              style={styles.textInput}
              placeholder={t("remember.placeholder")}
              value={newReminderText}
              onChangeText={setNewReminderText}
              placeholderTextColor={Palette.textMuted}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addReminder}
                style={styles.confirmBtn}
              >
                <Text style={styles.confirmBtnText}>{t("common.add")}</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Palette.background,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  headerTitle: {
    fontWeight: "600",
    color: Palette.textPrimary,
  },
  addButton: {
    color: Palette.accent,
    fontSize: 28,
    fontWeight: "400",
  },
  list: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  emptyText: {
    color: Palette.textSecondary,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 40,
  },
  reminderItem: {
    backgroundColor: Palette.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  reminderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Palette.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxDone: {
    backgroundColor: Palette.positive,
    borderColor: Palette.positive,
  },
  checkmark: {
    color: Palette.white,
    fontWeight: "700",
    fontSize: 14,
  },
  reminderText: {
    color: Palette.textPrimary,
    fontWeight: "600",
    flex: 1,
  },
  reminderTextDone: {
    color: Palette.textMuted,
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  deleteBtn: {
    padding: 8,
  },
  deleteBtnText: {
    fontSize: 16,
    color: Palette.textSecondary,
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
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
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
