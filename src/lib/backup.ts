import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import { STORAGE_KEYS } from "@/constants/storage";

const BACKUP_APP_ID = "spoonventory";

interface BackupFile {
  app: typeof BACKUP_APP_ID;
  exportedAt: string;
  data: Record<string, string>;
}

export async function exportBackup(): Promise<void> {
  const keys = Object.values(STORAGE_KEYS);
  const entries = await AsyncStorage.multiGet(keys);
  const data: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (value !== null) data[key] = value;
  }

  const backup: BackupFile = {
    app: BACKUP_APP_ID,
    exportedAt: new Date().toISOString(),
    data,
  };
  const json = JSON.stringify(backup, null, 2);
  const filename = `spoonventory-backup-${Date.now()}.json`;

  if (Platform.OS === "web") {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const file = new File(Paths.cache, filename);
  file.write(json);
  await Sharing.shareAsync(file.uri, {
    mimeType: "application/json",
    dialogTitle: "Save backup",
  });
}

export async function importBackup(): Promise<"cancelled" | "success"> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
  });
  if (result.canceled || !result.assets?.[0]) return "cancelled";

  const asset = result.assets[0];
  const text =
    Platform.OS === "web" && asset.file
      ? await asset.file.text()
      : await new File(asset.uri).text();

  const backup = JSON.parse(text) as Partial<BackupFile>;
  if (backup.app !== BACKUP_APP_ID || !backup.data) {
    throw new Error("Ogiltig backup-fil");
  }

  await AsyncStorage.multiSet(Object.entries(backup.data));
  return "success";
}
