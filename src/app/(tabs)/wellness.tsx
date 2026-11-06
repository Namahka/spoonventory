import { Palette } from "@/constants/colors";
import { getDateKey, getLastNDays, getMonthGridDays } from "@/constants/date";
import { useResponsive } from "@/constants/responsive";
import { STORAGE_KEYS } from "@/constants/storage";
import { useLanguage } from "@/contexts/language-context";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { TranslationKey } from "@/lib/i18n/translations";
import { DayRecord, getCrashStreak } from "@/lib/spoon-history";
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

interface Mood {
  level: number;
  emoji: string;
  labelKey: TranslationKey;
  color: string;
}

interface Symptom {
  id: string;
  name: string;
  nameKey?: TranslationKey;
}

interface Medication {
  id: string;
  name: string;
  dosage?: string;
}

interface DailyLog {
  symptoms?: Record<string, number>;
  medications?: string[];
  note?: string;
}

const MOODS: Mood[] = [
  { level: 1, emoji: "😣", labelKey: "wellness.mood1", color: "#F5A5A5" },
  { level: 2, emoji: "😕", labelKey: "wellness.mood2", color: "#FFD4A3" },
  { level: 3, emoji: "😐", labelKey: "wellness.mood3", color: "#E8D4C4" },
  { level: 4, emoji: "🙂", labelKey: "wellness.mood4", color: "#B8D4E8" },
  { level: 5, emoji: "😄", labelKey: "wellness.mood5", color: "#6FD38F" },
];

const SEVERITY_LEVELS = [1, 2, 3, 4, 5];

const DEFAULT_SYMPTOMS: Symptom[] = [
  { id: "1", name: "Pain", nameKey: "wellness.symptomPain" },
  { id: "2", name: "Fatigue", nameKey: "wellness.symptomFatigue" },
  { id: "3", name: "Dizziness", nameKey: "wellness.symptomDizziness" },
  { id: "4", name: "Brain fog", nameKey: "wellness.symptomBrainFog" },
  { id: "5", name: "Nausea", nameKey: "wellness.symptomNausea" },
];

const TREND_BAR_HEIGHT = 80;

export default function WellnessScreen() {
  const { spacing, typography } = useResponsive();
  const { t, monthNames, weekdayLabels } = useLanguage();
  const [moods, setMoods] = usePersistedState<Record<string, number>>(
    STORAGE_KEYS.moods,
    {},
  );
  const [symptoms, setSymptoms] = usePersistedState<Symptom[]>(
    STORAGE_KEYS.symptoms,
    DEFAULT_SYMPTOMS,
  );
  const [medications, setMedications] = usePersistedState<Medication[]>(
    STORAGE_KEYS.medications,
    [],
  );
  const [dailyLogs, setDailyLogs] = usePersistedState<
    Record<string, DailyLog>
  >(STORAGE_KEYS.dailyLogs, {});
  const [spoonHistory] = usePersistedState<Record<string, DayRecord>>(
    STORAGE_KEYS.spoonHistory,
    {},
  );

  const [showAddSymptomModal, setShowAddSymptomModal] = useState(false);
  const [newSymptomName, setNewSymptomName] = useState("");
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [newMedicationName, setNewMedicationName] = useState("");
  const [newMedicationDosage, setNewMedicationDosage] = useState("");
  const [noteDraft, setNoteDraft] = useState<string | null>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const todayKey = getDateKey();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthPrefix = todayKey.slice(0, 7);
  const gridDays = getMonthGridDays(year, month);

  const loggedThisMonth = Object.keys(moods).filter((key) =>
    key.startsWith(monthPrefix),
  ).length;

  const selectedMood = MOODS.find((m) => m.level === moods[todayKey]);

  const setTodayMood = (level: number) => {
    setMoods({ ...moods, [todayKey]: level });
  };

  const todayLog = dailyLogs[todayKey];
  const crashStreak = getCrashStreak(spoonHistory);
  const last7Days = getLastNDays(7);
  const noteValue = noteDraft ?? todayLog?.note ?? "";

  const selectedDayLog = selectedDayKey ? dailyLogs[selectedDayKey] : undefined;
  const selectedDayMood = MOODS.find(
    (m) => m.level === (selectedDayKey ? moods[selectedDayKey] : undefined),
  );
  const selectedDaySymptoms = symptoms
    .map((symptom) => ({
      symptom,
      severity: selectedDayLog?.symptoms?.[symptom.id] ?? 0,
    }))
    .filter(({ severity }) => severity > 0);
  const selectedDayMedications = medications.filter((medication) =>
    selectedDayLog?.medications?.includes(medication.id),
  );
  const hasSelectedDayData =
    !!selectedDayMood ||
    selectedDaySymptoms.length > 0 ||
    selectedDayMedications.length > 0 ||
    !!selectedDayLog?.note;
  const selectedDayLabel = selectedDayKey
    ? `${parseInt(selectedDayKey.slice(8, 10), 10)} ${
        monthNames[parseInt(selectedDayKey.slice(5, 7), 10) - 1]
      } ${selectedDayKey.slice(0, 4)}`
    : "";

  const setSymptomSeverity = (symptomId: string, level: number) => {
    const current = todayLog?.symptoms ?? {};
    const newSymptoms = { ...current };
    if (current[symptomId] === level) {
      delete newSymptoms[symptomId];
    } else {
      newSymptoms[symptomId] = level;
    }
    setDailyLogs({
      ...dailyLogs,
      [todayKey]: { ...todayLog, symptoms: newSymptoms },
    });
  };

  const addSymptom = () => {
    if (newSymptomName.trim()) {
      setSymptoms([
        ...symptoms,
        { id: Date.now().toString(), name: newSymptomName.trim() },
      ]);
      setNewSymptomName("");
      setShowAddSymptomModal(false);
    }
  };

  const deleteSymptom = (id: string) => {
    setSymptoms(symptoms.filter((s) => s.id !== id));
  };

  const toggleMedicationTaken = (medicationId: string) => {
    const current = todayLog?.medications ?? [];
    const newMedications = current.includes(medicationId)
      ? current.filter((id) => id !== medicationId)
      : [...current, medicationId];
    setDailyLogs({
      ...dailyLogs,
      [todayKey]: { ...todayLog, medications: newMedications },
    });
  };

  const addMedication = () => {
    if (newMedicationName.trim()) {
      setMedications([
        ...medications,
        {
          id: Date.now().toString(),
          name: newMedicationName.trim(),
          dosage: newMedicationDosage.trim() || undefined,
        },
      ]);
      setNewMedicationName("");
      setNewMedicationDosage("");
      setShowAddMedicationModal(false);
    }
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const commitNote = () => {
    if (noteDraft !== null) {
      setDailyLogs({
        ...dailyLogs,
        [todayKey]: { ...todayLog, note: noteDraft },
      });
    }
  };

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
          {t("wellness.title")}
        </Text>

        {crashStreak >= 2 && (
          <View style={[styles.warningBanner, { marginTop: spacing.md }]}>
            <Text style={styles.warningText}>
              {t("wellness.crashWarning", { count: crashStreak })}
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.sectionLabel,
            { fontSize: typography.body, marginTop: spacing.lg },
          ]}
        >
          {t("wellness.howAreYouToday")}
        </Text>

        <View style={[styles.moodRow, { marginTop: spacing.sm }]}>
          {MOODS.map((mood) => {
            const selected = moods[todayKey] === mood.level;
            return (
              <TouchableOpacity
                key={mood.level}
                onPress={() => setTodayMood(mood.level)}
                style={[
                  styles.moodButton,
                  {
                    backgroundColor: selected ? mood.color : Palette.surface,
                    borderColor: selected ? mood.color : Palette.border,
                  },
                ]}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text
          style={[
            styles.selectedMoodLabel,
            { fontSize: typography.small, marginTop: spacing.xs },
          ]}
        >
          {selectedMood ? t(selectedMood.labelKey) : t("wellness.noneSelectedToday")}
        </Text>

        <Text
          style={[
            styles.sectionLabel,
            { fontSize: typography.body, marginTop: spacing.xl },
          ]}
        >
          {t("wellness.symptoms")}
        </Text>

        <View style={[styles.sectionCard, { marginTop: spacing.sm }]}>
          {symptoms.map((symptom) => {
            const severity = todayLog?.symptoms?.[symptom.id] ?? 0;
            return (
              <View key={symptom.id} style={styles.listRow}>
                <Text style={styles.listRowLabel}>
                  {symptom.nameKey ? t(symptom.nameKey) : symptom.name}
                </Text>
                <View style={styles.severityDots}>
                  {SEVERITY_LEVELS.map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setSymptomSeverity(symptom.id, level)}
                      style={[
                        styles.severityDot,
                        severity >= level && styles.severityDotFilled,
                      ]}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => deleteSymptom(symptom.id)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteBtnText}>⊗</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          <TouchableOpacity
            onPress={() => setShowAddSymptomModal(true)}
            style={[styles.listRow, styles.addRow]}
          >
            <Text style={styles.addRowText}>+ {t("wellness.addSymptom")}</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.sectionLabel,
            { fontSize: typography.body, marginTop: spacing.xl },
          ]}
        >
          {t("wellness.medications")}
        </Text>

        <View style={[styles.sectionCard, { marginTop: spacing.sm }]}>
          {medications.map((medication) => {
            const taken =
              todayLog?.medications?.includes(medication.id) ?? false;
            return (
              <View key={medication.id} style={styles.listRow}>
                <View style={styles.medicationInfo}>
                  <Text style={styles.listRowLabel}>{medication.name}</Text>
                  {medication.dosage && (
                    <Text style={styles.medicationDosage}>
                      {medication.dosage}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => toggleMedicationTaken(medication.id)}
                  style={[styles.checkbox, taken && styles.checkboxChecked]}
                >
                  {taken && <Text style={styles.checkboxMark}>✓</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteMedication(medication.id)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteBtnText}>⊗</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          <TouchableOpacity
            onPress={() => setShowAddMedicationModal(true)}
            style={[styles.listRow, styles.addRow]}
          >
            <Text style={styles.addRowText}>
              + {t("wellness.addMedication")}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.sectionLabel,
            { fontSize: typography.body, marginTop: spacing.xl },
          ]}
        >
          {monthNames[month]} {year}
        </Text>

        <View style={[styles.weekdayRow, { marginTop: spacing.sm }]}>
          {weekdayLabels.map((label, i) => (
            <Text key={i} style={styles.weekdayLabel}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {gridDays.map((day, i) => {
            if (day === null) {
              return <View key={i} style={styles.dayCell} />;
            }

            const dateKey = `${monthPrefix}-${String(day).padStart(2, "0")}`;
            const moodLevel = moods[dateKey];
            const moodColor = moodLevel
              ? MOODS[moodLevel - 1].color
              : Palette.surface;
            const isToday = dateKey === todayKey;

            return (
              <View key={i} style={styles.dayCell}>
                <TouchableOpacity
                  onPress={() => setSelectedDayKey(dateKey)}
                  style={[
                    styles.dayCellBox,
                    {
                      backgroundColor: moodColor,
                      borderColor: isToday ? Palette.accent : Palette.border,
                      borderWidth: isToday ? 2 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      { color: moodLevel ? Palette.moodText : Palette.textPrimary },
                    ]}
                  >
                    {day}
                  </Text>
                  {moodLevel && (
                    <Text style={styles.dayMoodEmoji}>
                      {MOODS[moodLevel - 1].emoji}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <Text
          style={[
            styles.summary,
            { fontSize: typography.small, marginTop: spacing.md },
          ]}
        >
          {t("wellness.daysLoggedThisMonth", { count: loggedThisMonth })}
        </Text>

        <Text
          style={[
            styles.sectionLabel,
            { fontSize: typography.body, marginTop: spacing.xl },
          ]}
        >
          {t("wellness.trend")}
        </Text>

        <View style={[styles.trendRow, { marginTop: spacing.sm }]}>
          {last7Days.map((dateKey) => {
            const record = spoonHistory[dateKey];
            const ratio =
              record && record.base > 0 ? record.used / record.base : 0;
            const overspent = !!record && record.used > record.base;
            const barHeight = Math.max(
              Math.min(ratio, 1) * TREND_BAR_HEIGHT,
              4,
            );
            const moodLevel = moods[dateKey];
            const moodColor = moodLevel
              ? MOODS[moodLevel - 1].color
              : Palette.surfaceAlt;
            const weekday = new Date(`${dateKey}T00:00:00`).getDay();
            const weekdayLabel = weekdayLabels[(weekday + 6) % 7];
            const isToday = dateKey === todayKey;

            return (
              <View key={dateKey} style={styles.trendColumn}>
                <View
                  style={[styles.trendBarTrack, { height: TREND_BAR_HEIGHT }]}
                >
                  {overspent && (
                    <View
                      style={[
                        styles.trendOverflowMarker,
                        { backgroundColor: Palette.accent },
                      ]}
                    />
                  )}
                  <View
                    style={[
                      styles.trendBar,
                      {
                        height: barHeight,
                        backgroundColor: overspent
                          ? Palette.accent
                          : Palette.positive,
                      },
                    ]}
                  />
                </View>
                <View
                  style={[styles.trendMoodDot, { backgroundColor: moodColor }]}
                />
                <Text
                  style={[
                    styles.trendDayLabel,
                    isToday && styles.trendDayLabelToday,
                  ]}
                >
                  {weekdayLabel}
                </Text>
              </View>
            );
          })}
        </View>

        <Text
          style={[
            styles.sectionLabel,
            { fontSize: typography.body, marginTop: spacing.xl },
          ]}
        >
          {t("wellness.note")}
        </Text>

        <TextInput
          style={[styles.noteInput, { marginTop: spacing.sm }]}
          placeholder={t("wellness.notePlaceholder")}
          placeholderTextColor={Palette.textMuted}
          value={noteValue}
          onChangeText={setNoteDraft}
          onBlur={commitNote}
          multiline
          numberOfLines={4}
        />
      </ScrollView>

      <Modal
        visible={showAddSymptomModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddSymptomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("wellness.addSymptom")}</Text>

            <Text style={styles.inputLabel}>{t("common.name")}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t("wellness.symptomPlaceholder")}
              value={newSymptomName}
              onChangeText={setNewSymptomName}
              placeholderTextColor={Palette.textMuted}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowAddSymptomModal(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addSymptom} style={styles.confirmBtn}>
                <Text style={styles.confirmBtnText}>{t("common.add")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddMedicationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddMedicationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("wellness.addMedication")}
            </Text>

            <Text style={styles.inputLabel}>{t("common.name")}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t("wellness.medicationNamePlaceholder")}
              value={newMedicationName}
              onChangeText={setNewMedicationName}
              placeholderTextColor={Palette.textMuted}
            />

            <TextInput
              style={styles.textInput}
              placeholder={t("wellness.medicationDosagePlaceholder")}
              value={newMedicationDosage}
              onChangeText={setNewMedicationDosage}
              placeholderTextColor={Palette.textMuted}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowAddMedicationModal(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addMedication}
                style={styles.confirmBtn}
              >
                <Text style={styles.confirmBtnText}>{t("common.add")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={selectedDayKey !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDayKey(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDayLabel}</Text>

            {hasSelectedDayData ? (
              <>
                {selectedDayMood && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t("wellness.moodLabel")}
                    </Text>
                    <Text style={styles.detailValue}>
                      {selectedDayMood.emoji} {t(selectedDayMood.labelKey)}
                    </Text>
                  </View>
                )}

                {selectedDaySymptoms.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>
                      {t("wellness.symptoms")}
                    </Text>
                    {selectedDaySymptoms.map(({ symptom, severity }) => (
                      <View key={symptom.id} style={styles.detailSymptomRow}>
                        <Text style={styles.detailLabel}>
                          {symptom.nameKey ? t(symptom.nameKey) : symptom.name}
                        </Text>
                        <View style={styles.severityDots}>
                          {SEVERITY_LEVELS.map((level) => (
                            <View
                              key={level}
                              style={[
                                styles.severityDot,
                                severity >= level && styles.severityDotFilled,
                              ]}
                            />
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {selectedDayMedications.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>
                      {t("wellness.medicationsTaken")}
                    </Text>
                    {selectedDayMedications.map((medication) => (
                      <Text key={medication.id} style={styles.detailListItem}>
                        {medication.name}
                        {medication.dosage ? ` (${medication.dosage})` : ""}
                      </Text>
                    ))}
                  </View>
                )}

                {selectedDayLog?.note && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>
                      {t("wellness.noteLabel")}
                    </Text>
                    <Text style={styles.detailNoteText}>
                      {selectedDayLog.note}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.noDataText}>
                {t("wellness.noDataForDay")}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => setSelectedDayKey(null)}
              style={[styles.cancelBtn, { marginTop: 20 }]}
            >
              <Text style={styles.cancelBtnText}>{t("common.close")}</Text>
            </TouchableOpacity>
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
    color: Palette.textPrimary,
  },
  moodRow: {
    flexDirection: "row",
    gap: 8,
  },
  moodButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 28,
  },
  selectedMoodLabel: {
    color: Palette.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },
  weekdayRow: {
    flexDirection: "row",
  },
  weekdayLabel: {
    width: "14.2857%",
    textAlign: "center",
    color: Palette.textSecondary,
    fontWeight: "600",
    fontSize: 12,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.2857%",
    aspectRatio: 1,
    padding: 2,
  },
  dayCellBox: {
    flex: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  dayNumber: {
    fontSize: 10,
    fontWeight: "500",
  },
  dayMoodEmoji: {
    fontSize: 15,
    lineHeight: 17,
  },
  summary: {
    color: Palette.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },
  warningBanner: {
    backgroundColor: Palette.accentMuted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.accent,
    padding: 12,
  },
  warningText: {
    color: Palette.accent,
    fontWeight: "600",
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: Palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  listRowLabel: {
    flex: 1,
    color: Palette.textPrimary,
    fontWeight: "500",
  },
  severityDots: {
    flexDirection: "row",
    gap: 6,
  },
  severityDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  severityDotFilled: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  addRow: {
    borderBottomWidth: 0,
  },
  addRowText: {
    color: Palette.accent,
    fontWeight: "600",
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    fontSize: 16,
    color: Palette.textSecondary,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationDosage: {
    color: Palette.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Palette.positive,
    borderColor: Palette.positive,
  },
  checkboxMark: {
    color: Palette.white,
    fontWeight: "700",
    fontSize: 14,
  },
  trendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trendColumn: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  trendBarTrack: {
    width: 16,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  trendBar: {
    width: 16,
    borderRadius: 4,
  },
  trendOverflowMarker: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 4,
    borderRadius: 2,
  },
  trendMoodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trendDayLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: "600",
  },
  trendDayLabelToday: {
    color: Palette.accent,
  },
  noteInput: {
    backgroundColor: Palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 12,
    color: Palette.textPrimary,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    color: Palette.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    color: Palette.textPrimary,
    fontWeight: "600",
  },
  detailSection: {
    marginBottom: 12,
  },
  detailSectionTitle: {
    fontWeight: "600",
    color: Palette.textPrimary,
    marginBottom: 8,
    fontSize: 14,
  },
  detailSymptomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  detailListItem: {
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  detailNoteText: {
    color: Palette.textPrimary,
    lineHeight: 20,
  },
  noDataText: {
    color: Palette.textSecondary,
    textAlign: "center",
    paddingVertical: 20,
  },
});
