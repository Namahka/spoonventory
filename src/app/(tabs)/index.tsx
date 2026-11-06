import { Palette } from "@/constants/colors";
import { getDateKey } from "@/constants/date";
import { useResponsive } from "@/constants/responsive";
import { STORAGE_KEYS } from "@/constants/storage";
import { useLanguage } from "@/contexts/language-context";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { DayRecord, pruneHistory } from "@/lib/spoon-history";
import { ScreenBackground } from "@/components/screen-background";
import { SpoonRing } from "@/components/spoon-ring";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SpoonData {
  spoonsToday: number;
  spoonBank: number;
  baseSpoons: number;
  lastActiveDate: string;
}

interface Activity {
  id: string;
  name: string;
  takes: number;
  gives: number;
}

// Calculates how many spoons roll over to the next day above
// (or below) the regular daily ration: positive if you "gained" more
// than you "spent", negative if you went below zero, otherwise 0.
const getCarryover = (spoonBank: number, baseSpoons: number): number => {
  if (spoonBank > baseSpoons) return spoonBank - baseSpoons;
  if (spoonBank < 0) return spoonBank;
  return 0;
};

const DEFAULT_DATA: SpoonData = {
  spoonsToday: 0,
  spoonBank: 12,
  baseSpoons: 12,
  lastActiveDate: getDateKey(),
};

const DEFAULT_ACTIVITIES: Activity[] = [
  { id: "1", name: "Shower", takes: 2, gives: 0 },
  { id: "2", name: "Commute", takes: 3, gives: 0 },
  { id: "3", name: "Socializing", takes: 5, gives: 0 },
  { id: "4", name: "Work / study", takes: 4, gives: 0 },
  { id: "5", name: "Sensory input", takes: 2, gives: 0 },
  { id: "6", name: "Sleep", takes: 0, gives: 4 },
  { id: "7", name: "Alone time", takes: 0, gives: 3 },
  { id: "8", name: "Special interest", takes: 0, gives: 4 },
  { id: "9", name: "Favorite food", takes: 0, gives: 2 },
  { id: "10", name: "Walk in nature", takes: 0, gives: 3 },
];

// Earlier versions saved the default activities with Swedish names.
// Rename those to English when loading; custom activities are left as is.
const LEGACY_ACTIVITY_NAMES: Record<string, string> = {
  Duscha: "Shower",
  Pendla: "Commute",
  "Social samvaro": "Socializing",
  "Jobba / studera": "Work / study",
  "Sensorisk input": "Sensory input",
  Sova: "Sleep",
  "Ensam tid": "Alone time",
  Favoritmat: "Favorite food",
  "Promenad i natur": "Walk in nature",
};

const migrateActivities = (stored: Activity[]): Activity[] =>
  stored.map((a) =>
    LEGACY_ACTIVITY_NAMES[a.name]
      ? { ...a, name: LEGACY_ACTIVITY_NAMES[a.name] }
      : a,
  );

export default function HomeScreen() {
  const [data, setData] = usePersistedState<SpoonData>(
    STORAGE_KEYS.spoonData,
    DEFAULT_DATA,
  );
  const [screen, setScreen] = useState<"home" | "log">("home");
  const [activities, setActivities] = usePersistedState<Activity[]>(
    STORAGE_KEYS.activities,
    DEFAULT_ACTIVITIES,
    migrateActivities,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityTakes, setNewActivityTakes] = useState("0");
  const [newActivityGives, setNewActivityGives] = useState("0");
  const { width, spacing, typography } = useResponsive();
  const { t } = useLanguage();

  const spoonsLeft = data.spoonBank;
  const percentage = Math.round((spoonsLeft / data.baseSpoons) * 100);
  const ringSize = Math.min(Math.max(width * 0.55, 200), 260);
  const carryover = getCarryover(spoonsLeft, data.baseSpoons);

  // On a new day the balance resets to the daily ration, plus any surplus
  // (gained more than spent) or minus any deficit (went below zero).
  useEffect(() => {
    const today = getDateKey();
    if (data.lastActiveDate !== today) {
      setData((prev) => ({
        ...prev,
        spoonBank:
          prev.baseSpoons + getCarryover(prev.spoonBank, prev.baseSpoons),
        spoonsToday: 0,
        lastActiveDate: today,
      }));
    }
  }, [data.lastActiveDate]);

  // Saves today's usage in the history (for the trend chart and crash warning)
  const [, setSpoonHistory] = usePersistedState<Record<string, DayRecord>>(
    STORAGE_KEYS.spoonHistory,
    {},
  );
  useEffect(() => {
    setSpoonHistory((prev) =>
      pruneHistory({
        ...prev,
        [data.lastActiveDate]: {
          used: data.spoonsToday,
          base: data.baseSpoons,
        },
      }),
    );
  }, [data.spoonsToday, data.baseSpoons, data.lastActiveDate]);

  const logActivity = (activity: Activity) => {
    const netChange = activity.gives - activity.takes;
    setData({
      ...data,
      spoonBank: data.spoonBank + netChange,
      spoonsToday: data.spoonsToday + activity.takes,
    });
    setScreen("home");
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const updateActivity = (id: string, takes: number, gives: number) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, takes, gives } : a)),
    );
    setEditingId(null);
  };

  const addNewActivity = () => {
    if (newActivityName.trim()) {
      setActivities([
        ...activities,
        {
          id: Date.now().toString(),
          name: newActivityName,
          takes: parseInt(newActivityTakes) || 0,
          gives: parseInt(newActivityGives) || 0,
        },
      ]);
      setNewActivityName("");
      setNewActivityTakes("0");
      setNewActivityGives("0");
      setShowAddModal(false);
    }
  };

  if (screen === "log") {
    return (
      <SafeAreaView style={styles.safeArea} collapsable={false}>
        <View
          style={[
            styles.logHeader,
            {
              paddingHorizontal: spacing.md,
              paddingTop: spacing.lg + spacing.md,
              paddingBottom: spacing.md,
            },
          ]}
        >
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={styles.backButton}>{t("home.back")}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: typography.heading }]}>
            {t("home.logActivity")}
          </Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Text style={styles.addButton}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={[styles.activitiesList, { paddingHorizontal: spacing.md }]}
          contentContainerStyle={styles.scrollContent}
        >
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              {editingId === activity.id ? (
                <View style={styles.editMode}>
                  <View style={styles.editRow}>
                    <Text style={styles.editLabel}>{t("home.takes")}</Text>
                    <View style={styles.counterGroup}>
                      <TouchableOpacity
                        onPress={() =>
                          updateActivity(
                            activity.id,
                            Math.max(0, activity.takes - 1),
                            activity.gives,
                          )
                        }
                        style={[styles.counterBtn, styles.minusBtn]}
                      >
                        <Text style={styles.counterBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>{activity.takes}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateActivity(
                            activity.id,
                            activity.takes + 1,
                            activity.gives,
                          )
                        }
                        style={[styles.counterBtn, styles.plusBtn]}
                      >
                        <Text style={styles.counterBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.editRow}>
                    <Text style={styles.editLabel}>{t("home.gives")}</Text>
                    <View style={styles.counterGroup}>
                      <TouchableOpacity
                        onPress={() =>
                          updateActivity(
                            activity.id,
                            activity.takes,
                            Math.max(0, activity.gives - 1),
                          )
                        }
                        style={[styles.counterBtn, styles.minusBtn]}
                      >
                        <Text style={styles.counterBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>{activity.gives}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateActivity(
                            activity.id,
                            activity.takes,
                            activity.gives + 1,
                          )
                        }
                        style={[styles.counterBtn, styles.plusBtn]}
                      >
                        <Text style={styles.counterBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setEditingId(null)}
                    style={styles.saveBtn}
                  >
                    <Text style={styles.saveBtnText}>{t("common.save")}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => logActivity(activity)}
                  style={styles.activityItemContent}
                >
                  <View style={styles.activityInfo}>
                    <Text
                      style={[
                        styles.activityName,
                        { fontSize: typography.body },
                      ]}
                    >
                      {activity.name}
                    </Text>
                    <View style={styles.activityStats}>
                      {activity.takes > 0 && (
                        <Text style={styles.takesLabel}>−{activity.takes}</Text>
                      )}
                      {activity.gives > 0 && (
                        <Text style={styles.givesLabel}>+{activity.gives}</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => setEditingId(activity.id)}
                      style={styles.editBtn}
                    >
                      <Text style={styles.editBtnText}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteActivity(activity.id)}
                      style={styles.deleteBtn}
                    >
                      <Text style={styles.deleteBtnText}>⊗</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Add Activity Modal */}
        <Modal
          visible={showAddModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("home.newActivity")}</Text>

              <Text style={styles.inputLabel}>{t("common.name")}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={t("home.namePlaceholder")}
                value={newActivityName}
                onChangeText={setNewActivityName}
                placeholderTextColor={Palette.textMuted}
              />

              <Text style={styles.inputLabel}>{t("home.takesSpoons")}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0"
                value={newActivityTakes}
                onChangeText={setNewActivityTakes}
                keyboardType="number-pad"
                placeholderTextColor={Palette.textMuted}
              />

              <Text style={styles.inputLabel}>{t("home.givesSpoons")}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0"
                value={newActivityGives}
                onChangeText={setNewActivityGives}
                keyboardType="number-pad"
                placeholderTextColor={Palette.textMuted}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setShowAddModal(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>{t("common.cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={addNewActivity}
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

  return (
    <View style={styles.safeArea}>
      <ScreenBackground />
      <SafeAreaView style={styles.flex} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.homeScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.homeColumn}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.brand}>
                <MaterialCommunityIcons
                  name="silverware-spoon"
                  size={36}
                  color={Palette.accent}
                />
                <Text style={styles.logoText}>spoonventory</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/settings")}
                style={styles.iconButton}
                accessibilityLabel={t("tabs.settings")}
              >
                <MaterialIcons
                  name="settings"
                  size={24}
                  color={Palette.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {/* Spoon ring */}
            <View style={styles.spoonDisplay}>
              <SpoonRing
                value={spoonsLeft}
                max={data.baseSpoons}
                size={ringSize}
              />
              <Text style={styles.subtitle}>{t("home.spoonsLeftToday")}</Text>
            </View>

            {/* Progress card */}
            <View style={styles.card}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.max(0, Math.min(percentage, 100))}%` },
                  ]}
                />
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.stat}>
                  {t("home.used", { count: data.baseSpoons - spoonsLeft })}
                </Text>
                {carryover !== 0 && (
                  <Text
                    style={[
                      styles.stat,
                      carryover > 0 ? styles.statPositive : styles.statNegative,
                    ]}
                  >
                    {t("home.carryover", {
                      value: carryover > 0 ? `+${carryover}` : carryover,
                    })}
                  </Text>
                )}
              </View>
            </View>

            {/* Log activity button */}
            <TouchableOpacity
              onPress={() => setScreen("log")}
              style={styles.logButton}
              activeOpacity={0.85}
            >
              <View style={styles.logIcon}>
                <MaterialCommunityIcons
                  name="silverware-spoon"
                  size={28}
                  color={Palette.white}
                />
              </View>
              <Text style={styles.logButtonText}>{t("home.logActivity")}</Text>
              <MaterialIcons
                name="arrow-forward"
                size={24}
                color={Palette.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  logHeader: {
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
  backButton: {
    color: Palette.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  addButton: {
    color: Palette.accent,
    fontSize: 28,
    fontWeight: "400",
  },
  flex: {
    flex: 1,
  },
  homeScroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  homeColumn: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "800",
    color: Palette.textPrimary,
    letterSpacing: -1,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(39, 39, 44, 0.8)",
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  spoonDisplay: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: 18,
    fontWeight: "500",
    marginTop: 12,
  },
  card: {
    backgroundColor: "rgba(27, 27, 31, 0.85)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 18,
    marginBottom: 24,
  },
  progressBar: {
    height: 12,
    backgroundColor: Palette.surfaceAlt,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: Palette.accent,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    color: Palette.textSecondary,
    fontSize: 15,
    fontWeight: "500",
  },
  statPositive: {
    color: Palette.positive,
    fontWeight: "600",
  },
  statNegative: {
    color: Palette.accent,
    fontWeight: "600",
  },
  logButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(42, 30, 34, 0.9)",
    borderRadius: 26,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 94, 0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  logIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.accentMuted,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 94, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  logButtonText: {
    flex: 1,
    color: Palette.textPrimary,
    fontSize: 20,
    fontWeight: "600",
  },
  activitiesList: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  activityItem: {
    backgroundColor: Palette.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: "hidden",
  },
  activityItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontWeight: "600",
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  activityStats: {
    flexDirection: "row",
    gap: 8,
  },
  takesLabel: {
    color: Palette.accent,
    fontWeight: "600",
    fontSize: 12,
  },
  givesLabel: {
    color: Palette.positive,
    fontWeight: "600",
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    padding: 8,
  },
  editBtnText: {
    fontSize: 16,
    color: Palette.textSecondary,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteBtnText: {
    fontSize: 16,
    color: Palette.textSecondary,
  },
  editMode: {
    padding: 16,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  editLabel: {
    fontWeight: "600",
    color: Palette.textPrimary,
    fontSize: 14,
  },
  counterGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  minusBtn: {
    backgroundColor: Palette.accent,
  },
  plusBtn: {
    backgroundColor: Palette.positive,
  },
  counterBtnText: {
    color: Palette.white,
    fontWeight: "700",
    fontSize: 18,
  },
  counterValue: {
    fontWeight: "600",
    color: Palette.textPrimary,
    minWidth: 30,
    textAlign: "center",
  },
  saveBtn: {
    backgroundColor: Palette.accent,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 12,
  },
  saveBtnText: {
    color: Palette.white,
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
  inputLabel: {
    fontWeight: "600",
    color: Palette.textPrimary,
    marginBottom: 8,
    fontSize: 14,
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
